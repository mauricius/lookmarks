'use strict'

const Bookmark = use('App/Models/Bookmark')
const Category = use('App/Models/Category')
const Hasher = use('App/Helpers/Hasher')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')
const Event = use('Event')
const MetaService = use('App/Services/MetaService')
const UploadBookmarksService = use('App/Services/UploadBookmarksService')
const ScreenshotService = use('App/Services/ScreenshotService')
const path = require('path')

class BookmarkController {

  /**
   * Index of Bookmarks
   * @param  options.request
   * @param  options.view
   * @return view
   */
  async index ({ request, auth, params, view }) {
    const query = Bookmark.query()
      .filter(request.all())
      .where('user_id', auth.user.id)
      .with('categories')

    if (request.get()._sort === 'name') {
      query.orderBy(request.get()._sort)
    } else if (request.get()._sort === 'created_at') {
      query.orderBy(request.get()._sort, 'desc')
    }

    const categories = await Category.query()
      .where('user_id', auth.user.id)
      .withCount('bookmarks')
      .fetch()

    if (request.get()._sort && request.get()._sort === 'category') {
      const bookmarks = await query.fetch()

      return view.presenter('CategoryPresenter')
        .render('bookmarks.index_category', {
          bookmarks: bookmarks.toJSON(),
          categories: categories.toJSON()
        })
    }

    const page = request.get().page || 1

    const bookmarks = await query.paginate(page)

    let category = null

    if (request.get().category) {
      const category_id = this.decode(request.get().category)

      category = await Category.query()
        .where('user_id', auth.user.id)
        .where('id', category_id)
        .firstOrFail()
    }

    return view.presenter('CategoryPresenter')
      .render('bookmarks.index', {
        bookmarks: bookmarks.toJSON(),
        categories: categories.toJSON(),
        category: category ? category.toJSON() : null
      })
  }

  /**
   * Show the view to create a new Bookmark
   * @param  options.view
   * @param  options.params
   * @return view
   */
  async create ({ view, params, auth }) {
    const categories = await Category.query()
      .where('user_id', auth.user.id)
      .fetch()

    return view.render('bookmarks.form', {
      categories: categories.toJSON()
    })
  }

  /**
   * Store a new bookmark
   * @param  options.request
   * @param  options.response
   * @param  options.auth
   * @param  options.session
   * @return redirect
   */
  async store ({ request, response, auth, session }) {
    const description = request.input('description') || await MetaService.fetchDescription(request.input('url'))

    const screenshot = await MetaService.fetchScreenshot(request.input('url'), Helpers.publicPath('uploads'))

    const bookmark = new Bookmark()
    bookmark.name = request.input('name')
    bookmark.url = request.input('url')
    bookmark.description = description
    bookmark.screenshot = screenshot ? '/uploads/' + screenshot : null
    bookmark.user_id = auth.user.id

    await bookmark.save()

    if (request.input('categories')) {
      await bookmark.categories().attach(request.input('categories'))
    }

    session.flash({
      notification: {
        type: 'success',
        message: 'Bookmark created!'
      }
    })

    return response.route('bookmarks.index')
  }

  /**
   * Show the page to edit a bookmark
   * @param  options.view
   * @param  options.params
   * @param  options.request
   * @param  options.response
   * @return view
   */
  async edit ({ auth, params, request, response, view }) {
    const id = this.decode(params.id)

    const bookmark = await Bookmark.query()
      .with('categories')
      .where('user_id', auth.user.id)
      .where('id', id)
      .firstOrFail()

    const categories = await Category.query()
      .where('user_id', auth.user.id)
      .fetch()

    return view.presenter('CategoryPresenter')
      .render('bookmarks.form', {
        bookmark: bookmark.toJSON(),
        categories: categories.toJSON()
      })
  }

  /**
   * Update a bookmark
   * @param  options.request
   * @param  options.response
   * @param  options.auth
   * @param  options.session
   * @return redirect
   */
  async update ({ params, request, response, auth, session }) {
    const validation = await validateAll(request.all(), {
      name: 'required',
      url: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    const id = this.decode(params.id)

    const bookmark = await Bookmark.findOrFail(id)
    bookmark.merge({
      name: request.input('name'),
      url: request.input('url'),
      description: request.input('description'),
      user_id: auth.user.id
    })

    await bookmark.save()

    await bookmark.categories().sync(request.input('categories') || [])

    session.flash({
      notification: {
        type: 'success',
        message: 'Bookmark updated!'
      }
    })

    return response.route('bookmarks.index')
  }

  /**
   * Fetch screenshot for the provided bookmark
   * @param  options.params
   * @param  options.response
   * @param  options.session
   * @return response
   */
  async screenshot ({ params, response, session }) {
    const id = this.decode(params.id)

    const bookmark = await Bookmark.findOrFail(id)

    const screenshot = await MetaService.fetchScreenshot(bookmark.url, Helpers.publicPath('uploads'))

    bookmark.merge({
      screenshot : screenshot ? '/uploads/' + screenshot : null
    })

    await bookmark.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Screenshot fetched successfully!'
      }
    })

    return response.route('bookmarks.edit', { id: params.id })
  }

  /**
   * Delete the screenshot from the bookmark
   * @param  options.params
   * @param  options.response
   * @param  options.session
   * @return response
   */
  async deleteScreenshot ({ params, response, session}) {
    const id = this.decode(params.id)

    const bookmark = await Bookmark.findOrFail(id)

    if (! bookmark.screenshot) {
      return response.redirect('back')
    }

    try {
      await ScreenshotService.delete(bookmark.screenshot, Helpers.publicPath('uploads'))

      bookmark.merge({
        screenshot : null
      })

      await bookmark.save()

      session.flash({
        notification: {
          type: 'success',
          message: 'Screenshot deleted successfully!'
        }
      })
    } catch (e) {
      session.flash({
        notification: {
          type: 'error',
          message: e.message
        }
      })
    }

    return response.redirect('back')
  }

  /**
   * Show the page to upload a file
   * @param  options.view
   * @param  options.request
   * @return
   */
  showUpload ({ view, request }) {
    return view.render('bookmarks.upload')
  }

  /**
   * Upload an HTML file
   * @param  options.request
   * @param  options.response
   * @param  options.session
   * @return
   */
  async upload ({ request, response, session, auth }) {
    const uploadService = new UploadBookmarksService(auth.user.id)

    if (! request.file('file')) {
        session.flash({
          notification: {
            type: 'error',
            message: 'The file is missing'
          }
        })

        return response.redirect('back')
      }

    if (request.file('file').size > 0) {
      const file = await uploadService.persist(request.file('file', {
        types: ['html'],
        size: '2mb'
      }))

      await uploadService.processFile(path.join(Helpers.tmpPath('uploads'), file.fileName))

      if (! file.moved()) {
        session.flash({
          notification: {
            type: 'error',
            message: file.error().message
          }
        })

        return response.redirect('back')
      }

      session.flash({
        notification: {
          type: 'success',
          message: 'File uploaded to ' + file.folderName + file.fileName
        }
      })
    }

    return response.route('bookmarks.index')
  }

  /**
   * Delete a bookmark
   * @param  options.params
   * @param  options.response
   * @param  options.session
   * @return response
   */
  async destroy ({ params, response, session }) {
    const id = this.decode(params.id)

    const bookmark = await Bookmark.findOrFail(id)

    await bookmark.delete()

    session.flash({
      notification: {
        type: 'success',
        message: 'Bookmark deleted!'
      }
    })

    return response.route('bookmarks.index')
  }

  /**
   * Decode hashed id
   * @param  string param
   * @return number
   */
  decode (param) {
    return (new Hasher()).decode(param)
  }
}

module.exports = BookmarkController
