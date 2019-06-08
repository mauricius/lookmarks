const Bookmark = use('App/Models/Bookmark')
const Category = use('App/Models/Category')
const Database = use('Database')
const Helpers = use('Helpers')
const uuid = require('uuid/v4')
const parse = Helpers.promisify(require('bookmarks-parser'))
const fs = Helpers.promisify(require('fs'))
const dd = require('dump-die')
const moment = use('moment')

class UploadBookmarksService {
  constructor(user_id) {
    this.user_id = user_id
  }

  async persist(file) {
    await file.move(Helpers.tmpPath('uploads'), {
      name: `${uuid()}.${file.subtype}`
    })

    return file
  }

  async processFile(file) {
    const content = await fs.readFile(file, 'utf8')

    try {
      const res = await parse(content)

      const bookmarks = res.bookmarks

      await this.processBookmarks(bookmarks, [])

      await fs.unlink(file)
    } catch (error) {
      try {
        await fs.unlink(file)
      } catch (error) {
        console.log(error)
      }

      console.log(error)
    }
  }

  async processBookmarks(bookmarks, categories = []) {
    if (!bookmarks.length) return

    for (const bookmark of bookmarks) {
      if (!bookmark.type) {
        if (bookmark.children)
          await this.processBookmarks(bookmark.children, [])
      } else if (bookmark.type === 'folder') {
        await this.parseFolder(bookmark, categories)

        categories = []
      } else if (bookmark.type === 'bookmark') {
        const existingBookmark = await this.existingBookmark(bookmark)

        if (existingBookmark) {
          await this.applyCategories(existingBookmark.id, categories)
        } else {
          await this.parseBookmark(bookmark, categories)
        }
      }
    }
  }

  async parseFolder(bookmark, categories) {
    const category = new Category()
    category.name = bookmark.title
    category.user_id = this.user_id
    category.created_at = moment(chromeDtToDate(category.add_date)).format(
      'YYYY-MM-DD HH:mm:ss'
    )

    await category.save()

    categories.push(category.id)

    if (bookmark.children) {
      await this.processBookmarks(bookmark.children, categories)
    }
  }

  async existingBookmark(bookmark) {
    return await Database.table('bookmarks')
      .where('url', bookmark.url)
      .first()
  }

  async parseBookmark(bookmark, categories) {
    const bookmark_id = await Database.insert({
      name: sanitize(bookmark.title).substring(0, 200),
      url: bookmark.url,
      description: sanitize(bookmark.title),
      user_id: this.user_id,
      created_at: moment(chromeDtToDate(bookmark.add_date)).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }).into('bookmarks')

    if (categories.length) {
      await this.applyCategories(bookmark_id, categories)
    }
  }

  async applyCategories(bookmark_id, categories) {
    const insert = categories.map(id => {
      return {
        bookmark_id: bookmark_id,
        category_id: id
      }
    })

    await Database.insert(insert).into('bookmark_category')
  }
}

/**
 * Chrome Datetime to Date
 * @param  string dt
 * @return Date
 * @see  https://stackoverflow.com/questions/51343828/how-to-parse-chrome-bookmarks-date-added-value-to-a-date
 */
function chromeDtToDate(st_dt) {
  return new Date(Date.UTC(1970, 0, 1) + st_dt / 1000)
}

/**
 * Sanitize string for title and description
 * @param  string str
 * @return string
 */
function sanitize(str) {
  return str.replace(/[^\x00-\x7F]/g, '')
}

module.exports = UploadBookmarksService
