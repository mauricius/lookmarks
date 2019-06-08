'use strict'

/*
|--------------------------------------------------------------------------
| CategorySeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Category = use('App/Models/Category')

class CategorySeeder {
  async run () {
    const categories = [
      {
        name: 'Development',
        slug: 'development',
        description: 'Everything software development'
      },
      {
        name: 'Design',
        slug: 'design',
        description: 'Software design tips and tricks'
      },
      {
        name: 'DevOps',
        slug: 'devops',
        description: 'Everything software development and operations'
      }
    ]

    await Category.createMany(categories)
  }
}

module.exports = CategorySeeder
