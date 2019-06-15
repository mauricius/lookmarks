'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

const Factory = use('Factory')

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return Object.assign(
    {},
    {
      name: faker.username(),
      email: faker.email(),
      password: faker.password(),
      catchphrase: faker.sentence()
    },
    data
  )
})

Factory.blueprint('App/Models/Bookmark', async (faker, i, data) => {
  const user = data.user_id
    ? null
    : await Factory.model('App/Models/User').create()

  return Object.assign(
    {},
    {
      user_id: data.user_id || user.toJSON().id,
      name: faker.word(),
      url: faker.url(),
      description: faker.paragraph()
    },
    data
  )
})

Factory.blueprint('App/Models/Category', async (faker, i, data) => {
  const user = data.user_id
    ? null
    : await Factory.model('App/Models/User').create()

  return Object.assign(
    {},
    {
      user_id: data.user_id || user.toJSON().id,
      name: faker.sentence()
    },
    data
  )
})
