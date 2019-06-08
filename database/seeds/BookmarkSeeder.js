'use strict'

/*
|--------------------------------------------------------------------------
| BookmarkSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class BookmarkSeeder {
  async run () {
    const bookmarks = await Factory
      .model('App/Models/Bookmark')
      .createMany(5)
  }
}

module.exports = BookmarkSeeder
