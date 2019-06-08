'use strict'

class BookmarkStore {
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

module.exports = BookmarkStore
