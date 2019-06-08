'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up() {
    this.create('users', table => {
      table.increments()
      table.string('name').notNullable()
      table
        .string('email')
        .notNullable()
        .unique()
      table.string('password', 60).notNullable()
      table.string('avatar')
      table.string('catchphrase')
      table.timestamps()
    })
  }

  down() {
    this.drop('users')
  }
}

module.exports = UserSchema
