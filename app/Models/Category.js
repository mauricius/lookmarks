'use strict'

const Model = use('Model')
const Hasher = use('App/Helpers/Hasher')

class Category extends Model {
  static boot() {
    super.boot()

    this.addTrait('./Truncate', {
      fields: {
        name: 255,
        slug: 255
      }
    })

    this.addTrait('@provider:Lucid/Slugify', {
      fields: { slug: 'name' },
      strategy: 'dbIncrement',
      disableUpdates: false
    })
  }

  static get computed() {
    return ['encodedId']
  }

  getEncodedId({ id }) {
    const hasher = new Hasher()

    return hasher.encode(id)
  }

  user() {
    return this.belongsTo('App/Models/User')
  }

  bookmarks() {
    return this.belongsToMany('App/Models/Bookmark').pivotTable(
      'bookmark_category'
    )
  }
}

module.exports = Category
