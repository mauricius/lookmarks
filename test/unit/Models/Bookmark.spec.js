'use strict'

const { test, beforeEach } = use('Test/Suite')('Bookmark Model')
const Bookmark = use('App/Models/Bookmark')
const User = use('App/Models/User')
const Factory = use('Factory')

test('it should store a Bookmark', async ({ assert }) => {
  const bookmark = await Factory
    .model('App/Models/Bookmark')
    .create()

   const count = await Bookmark.getCount()

   assert.equal(1, count)
})

test('it should return the computed property host from the url', async ({ assert }) => {
  const bookmark = await Factory
    .model('App/Models/Bookmark')
    .make({
      url: 'http://host.com/my-bookmark'
    })

   assert.equal('host.com', bookmark.toJSON().host)
})

test('it should return the computed property encoded id', async ({ assert }) => {
  const bookmark = await Factory
    .model('App/Models/Bookmark')
    .create()

  const id = bookmark.toJSON().encodedId

  assert.isString(id)
  assert.notEqual(1, id)
})

test('it should belong to a User', async ({ assert }) => {
  const bookmark = await Factory
    .model('App/Models/Bookmark')
    .create()

  const user = await bookmark.user().fetch()

  assert.equal(bookmark.user_id, user.id)
})

test('it should belong to many Categories', async ({ assert }) => {
  const user =  await Factory
    .model('App/Models/User')
    .create()

  const category1 = await Factory
    .model('App/Models/Category')
    .create({
      name: 'Category 1',
      user_id : user.toJSON().id
    })

  const category2 = await Factory
    .model('App/Models/Category')
    .create({
      name: 'Category 2',
      user_id : user.toJSON().id
    })

  const bookmark = await Factory
    .model('App/Models/Bookmark')
    .create({
      user_id : user.toJSON().id
    })

  await bookmark.categories().saveMany([category1, category2])

  const count = await bookmark.categories().getCount()

  assert.equal(2, count)
})
