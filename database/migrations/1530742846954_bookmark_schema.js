'use strict'

const Schema = use('Schema')

class BookmarkSchema extends Schema {
  up() {
    this.create('bookmarks', table => {
      table.increments()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('cascade')
      table.string('name').notNullable()
      table.string('url', 2048).notNullable()
      table.text('description')
      table.string('screenshot')
      table.timestamps()
    })
  }

  down() {
    this.drop('bookmarks')
  }
}

module.exports = BookmarkSchema
