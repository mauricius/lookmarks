'use strict'

const { validateAll } = use('Validator')

const Bookmark = use('App/Models/Bookmark')
const Category = use('App/Models/Category')
const Config = use('Config')
const Hash = use('Hash')
const Helpers = use('Helpers')
const uuid = require('uuid/v4')

class UserController {
  /**
   * Show the page for editing the account
   * @param  options.view
   * @return view
   */
  showEditAccount({ view }) {
    return view.render('users.account')
  }

  /**
   * Update the account
   * @param  options.request
   * @param  options.auth
   * @param  options.session
   * @param  options.response
   * @return response
   */
  async updateAccount({ request, auth, session, response }) {
    const data = request.only(['name', 'email', 'catchphrase'])

    const validation = await validateAll(data, {
      name: 'required',
      email: `required|email|unique:users,email,id,${auth.user.id}`
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    if (request.file('avatar') && request.file('avatar').size > 0) {
      const avatar = await this._processUpload(
        request.file('avatar', { types: ['image'], size: '2mb' })
      )

      if (!avatar.moved()) {
        session.flash({
          notification: {
            type: 'error',
            message: avatar.error().message
          }
        })

        return response.redirect('back')
      }

      data['avatar'] = Config.get('uploads.avatar') + avatar.fileName
    }

    auth.user.merge(data)
    await auth.user.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Account updated!'
      }
    })

    return response.redirect('back')
  }

  /**
   * Process the uploaded file
   * @param  file
   * @return file
   */
  async _processUpload(file) {
    await file.move(Helpers.publicPath(Config.get('uploads.avatar')), {
      name: `${uuid()}.${file.subtype}`
    })

    return file
  }

  /**
   * Show the page for changing the password
   * @param  options.view
   * @return view
   */
  showChangePassword({ view }) {
    return view.render('users.password')
  }

  /**
   * Update the password of the user
   * @param  options.request
   * @param  options.response
   * @param  options.session
   * @param  options.auth
   * @return response
   */
  async updatePassword({ request, response, session, auth }) {
    const data = request.only([
      'current_password',
      'new_password',
      'new_password_confirmation'
    ])

    const validation = await validateAll(data, {
      current_password: 'required',
      new_password: 'required|confirmed'
    })

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept([
          'current_password',
          'new_password',
          'new_password_confirmation'
        ])

      return response.redirect('back')
    }

    if (!(await this._verifyPassword({ auth }, data.current_password))) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'Current password could not be verified! Please try again.'
        }
      })

      return response.redirect('back')
    }

    auth.user.password = data.new_password
    await auth.user.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Password changed!'
      }
    })

    return response.redirect('back')
  }

  /**
   * Show the page to confirm personal data deletion
   * @param  options.view
   * @return view
   */
  async showPersonalData({ view }) {
    const bookmarks = await Bookmark.getCount()
    const categories = await Category.getCount()

    return view.render('users.data', {
      bookmarks,
      categories
    })
  }

  /**
   * Delete all user's personal data
   * @param  options.request
   * @param  options.response
   * @param  options.session
   * @param  options.auth
   * @return response
   */
  async deleteData({ request, response, session, auth }) {
    const data = request.only(['current_password'])

    if (!(await this._verifyPassword({ auth }, data.current_password))) {
      session.flash({
        notification: {
          type: 'error',
          message: 'Current password could not be verified! Please try again.'
        }
      })

      return response.redirect('back')
    }

    await Bookmark.query()
      .where('user_id', auth.user.id)
      .delete()
    await Category.query()
      .where('user_id', auth.user.id)
      .delete()

    session.flash({
      notification: {
        type: 'success',
        message: 'Data deleted!'
      }
    })

    return response.redirect('back')
  }

  /**
   * Verify user's password
   * @param  options.auth
   * @param  current_password
   * @return boolean
   */
  async _verifyPassword({ auth }, current_password) {
    return await Hash.verify(current_password, auth.user.password)
  }
}

module.exports = UserController
