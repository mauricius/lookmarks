'use strict'

const Category = use('App/Models/Category')
const Hasher = use('App/Helpers/Hasher')
const UnauthorizedException = use('App/Exceptions/UnauthorizedException')

class CategoryDestroy {

  async authorize () {
    const id = (new Hasher()).decode(this.ctx.params.id)

    const category = await Category.findOrFail(id)

    if (this.ctx.auth.user.id !== category.user_id) {
      throw new UnauthorizedException(
        'You can only delete your own categories.',
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

module.exports = CategoryDestroy
