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

Factory.blueprint('App/Models/Bookmark', async (faker) => {
  return {
    user_id: 1,
    name: faker.username(),
    url: faker.url(),
    description: faker.paragraph()
  }
})

Factory.blueprint('App/Models/Category', async (faker) => {
  return {
    user_id: 1,
    name: faker.sentence()
  }
})

