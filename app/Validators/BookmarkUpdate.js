'use strict'

const Bookmark = use('App/Models/Bookmark')
const Hasher = use('App/Helpers/Hasher')
const UnauthorizedException = use('App/Exceptions/UnauthorizedException')

class BookmarkUpdate {

  async authorize () {
    const id = (new Hasher()).decode(this.ctx.params.id)

    const bookmark = await Bookmark.findOrFail(id)

    if (this.ctx.auth.user.id !== bookmark.user_id) {
      throw new UnauthorizedException(
        'You can only edit your own bookmarks.',
        403
      )

      return false
    }

    return true
  }

  get validateAll () {
    return true
  }

  get rules () {
    return {
      name: 'required',
      url: 'required|url'
    }
  }
}

module.exports = BookmarkUpdate
