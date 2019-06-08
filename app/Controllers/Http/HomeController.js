'use strict'

const Bookmark = use('App/Models/Bookmark')

class HomeController {
  /**
   * Show the Home page of the application
   * @param  options.view
   * @param  options.response
   * @param  options.auth
   * @return
   */
  async index({ view, response, auth }) {
    await auth.check()

    const bookmarks = await Bookmark.query()
      .with('categories')
      .where('user_id', auth.user.id)
      .orderBy('created_at', 'desc')
      .limit(6)
      .fetch()

    return view.render('home', {
      bookmarks: bookmarks.toJSON()
    })
  }
}

module.exports = HomeController
