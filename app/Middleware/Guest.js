'use strict'

class Guest {
  async handle ({ auth, response }, next) {
    try {
      await auth.check()

      return response.route('home')
    } catch (error) {
      await next()
    }
  }
}

module.exports = Guest
