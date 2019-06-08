'use strict'

const Bookmark = use('App/Models/Bookmark')
const Hasher = use('App/Helpers/Hasher')
const UnauthorizedException = use('App/Exceptions/UnauthorizedException')

class BookmarkDestroy {

  async authorize () {
    const id = (new Hasher()).decode(this.ctx.params.id)

    const bookmark = await Bookmark.findOrFail(id)

    if (this.ctx.auth.user.id !== bookmark.user_id) {
      throw new UnauthorizedException(
        'You can only delete your own bookmarks.',
        403
      )

      return false
    }

    return true
  }

  get rules () {
    return {}
  }
}

module.exports = BookmarkDestroy
