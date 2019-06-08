'use strict'

const Env = use('Env')
const Model = use('Model')
const Hasher = use('App/Helpers/Hasher')
const BookmarkFilter = use('App/ModelFilters/BookmarkFilter')

class Bookmark extends Model {

  static boot () {
    super.boot()

    this.addHook('beforeDelete', 'BookmarkHook.deleteScreenshot')
    this.addTrait('@provider:Filterable', BookmarkFilter)
  }

  static get computed () {
    return ['host', 'encodedId']
  }

  getHost ({ url }) {
    return new URL(url).host;
  }

  getEncodedId ({ id }) {
    const hasher = new Hasher()

    return hasher.encode(id)
  }

  static castDates (field, value) {
    if (field === 'created_at') {
      return value.format('D MMM YYYY')
    }

    return super.formatDates(field, value)
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  categories () {
    return this
      .belongsToMany('App/Models/Category')
      .pivotTable('bookmark_category')
  }
}

module.exports = Bookmark
