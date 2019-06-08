'use strict'

const Category = use('App/Models/Category')
const Hasher = use('App/Helpers/Hasher')
const { validateAll } = use('Validator')
const Helpers = use('Helpers')
const Event = use('Event')

class CategoryController {
  /**
   * View the page with all categories
   * @param  options.view
   * @param  options.request
   * @return view
   */
  async index({ view, request, auth }) {
    const categories = await Category.query()
      .where('user_id', auth.user.id)
      .fetch()

    return view.render('categories.index', { categories: categories.toJSON() })
  }

  /**
   * Show the page to create a new category
   * @param  options.view
   * @param  options.request
   * @return view
   */
  create({ view, request }) {
    return view.render('categories.form')
  }

  /**
   * Store a new category
   * @param  options.request
   * @param  options.response
   * @param  options.auth
   * @param  options.session
   * @return response
   */
  async store({ request, response, auth, session }) {
    const category = new Category()
    category.name = request.input('name')
    category.user_id = auth.user.id

    await category.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Category created!'
      }
    })

    return response.route('categories.index')
  }

  /**
   * Show the page to edit a category
   * @param  options.params
   * @param  options.view
   * @param  options.auth
   * @return view
   */
  async edit({ params, view, auth }) {
    const id = this.decode(params.id)

    const category = await Category.query()
      .where('user_id', auth.user.id)
      .where('id', id)
      .firstOrFail()

    return view.render('categories.form', {
      category: category.toJSON()
    })
  }

  /**
   * Update an existing category
   * @param  options.request
   * @param  options.response
   * @param  options.params
   * @param  options.session
   * @return response
   */
  async update({ request, response, auth, params, session }) {
    const id = this.decode(params.id)

    const category = await Category.query()
      .where('user_id', auth.user.id)
      .where('id', id)
      .firstOrFail()

    category.name = request.input('name')

    await category.save()

    session.flash({
      notification: {
        type: 'success',
        message: 'Category updated!'
      }
    })

    return response.route('categories.index')
  }

  /**
   * Delete a category
   * @param  options.params
   * @param  options.auth
   * @param  options.response
   * @param  options.session
   * @return response
   */
  async destroy({ params, auth, response, session }) {
    const id = this.decode(params.id)

    const category = await Category.query()
      .where('user_id', auth.user.id)
      .where('id', id)
      .firstOrFail()

    await category.delete()

    session.flash({
      notification: {
        type: 'success',
        message: 'Category deleted!'
      }
    })

    return response.route('categories.index')
  }

  /**
   * Decode hashed id
   * @param  string param
   * @return number
   */
  decode(param) {
    return new Hasher().decode(param)
  }
}

module.exports = CategoryController
