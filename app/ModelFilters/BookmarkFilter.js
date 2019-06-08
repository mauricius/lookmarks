'use strict'

const ModelFilter = use('ModelFilter')
const Hasher = use('App/Helpers/Hasher')

class BookmarkFilter extends ModelFilter {

  name (name) {
    return this.where(function () {
      this.where('name', 'LIKE', `%${name}%`)
        .orWhere('description', 'LIKE', `%${name}%`)
    })
  }

  category (id) {
    const category_id = (new Hasher()).decode(id)

    return this.whereHas('categories', (builder) => {
      builder.where('id', category_id)
    })
  }
}

module.exports = BookmarkFilter
