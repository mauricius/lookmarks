'use strict'

const Chance = require('chance')
const { before, test, trait } = use('Test/Suite')('Category Model')
const Category = use('App/Models/Category')
const User = use('App/Models/User')
const Factory = use('Factory')

trait('DatabaseTransactions')

let chance;

before(async () => {
  chance = new Chance()
})

test('it should store a Category', async ({ assert }) => {
  const category = await Factory
    .model('App/Models/Category')
    .create()

   const count = await Category.getCount()

   assert.equal(1, count)
})

test('it should return the computed property encoded id', async ({ assert }) => {
  const category = await Factory
    .model('App/Models/Category')
    .create()

  const id = category.toJSON().encodedId

  assert.isString(id)
  assert.notEqual(1, id)
})

test('it should belong to a User', async ({ assert }) => {
  const category = await Factory
    .model('App/Models/Category')
    .create()

  const user = await category.user().fetch()

  assert.equal(category.user_id, user.id)
})

test('it should belong to many Bookmarks', async ({ assert }) => {
  const user =  await Factory
    .model('App/Models/User')
    .create()

  const bookmark1 = await Factory
    .model('App/Models/Bookmark')
    .create({
      user_id : user.toJSON().id
    })

  const bookmark2 = await Factory
    .model('App/Models/Bookmark')
    .create({
      user_id : user.toJSON().id
    })

  const category = await Factory
    .model('App/Models/Category')
    .create({
      name: 'Category',
      user_id : user.toJSON().id
    })

  await category.bookmarks().saveMany([bookmark1, bookmark2])

  const count = await category.bookmarks().getCount()

  assert.equal(2, count)
})

test('it should truncate the name field to 255 charachters', async ({ assert }) => {
  const name = chance.word({ length: 256 })

  const category = await Factory
    .model('App/Models/Category')
    .create({
      name
    })

  assert.equal(name.substr(0, 255), category.name)
})

test('it should create a slug from the category name', async ({ assert }) => {
  const name = chance.sentence({ words: 3 })

  const category = await Factory
    .model('App/Models/Category')
    .create({
      name
    })

  assert.isFalse(category.slug.includes(' '))
  assert.isTrue(category.slug.toLowerCase() === category.slug)
})

test('it should not assign the same slug to categories with the same name', async ({ assert }) => {
  const name = chance.sentence({ words: 3 })

  const category1 = await Factory
    .model('App/Models/Category')
    .create({
      name
    })

  const category2 = await Factory
    .model('App/Models/Category')
    .create({
      name
    })

  assert.notEqual(category1.slug, category2.slug)
})