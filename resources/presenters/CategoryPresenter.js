const { BasePresenter } = require('edge.js')

class CategoryPresenter extends BasePresenter {

  filterBookmarks(bookmarks, category) {
    return bookmarks.filter(bookmark => {
        return bookmark.categories.some(cat => cat.name == category.name)
    })
  }

  joinNames (categories, separator = ', ') {
    return categories.map(category => category.name).join(separator)
  }

  hasCategory (bookmark, category) {
    return bookmark.categories.some(cat => cat.id == category.id)
  }

}

module.exports = CategoryPresenter