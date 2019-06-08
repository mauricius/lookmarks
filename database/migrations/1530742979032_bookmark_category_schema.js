'use strict'

const Schema = use('Schema')

class UrlCategorySchema extends Schema {
  up () {
    this.create('bookmark_category', table => {
      table
        .integer('bookmark_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('bookmarks')
        .onDelete('cascade')
      table
        .integer('category_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categories')
        .onDelete('cascade')
    })
  }

  down () {
    this.drop('bookmark_category')
  }
}

module.exports = UrlCategorySchema
