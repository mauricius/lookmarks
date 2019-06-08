'use strict'

class LogoutController {
  /**
   * Perform the logout action
   * @param  options.auth
   * @param  options.response
   * @return redirect
   */
  async logout({ auth, response }) {
    await auth.logout()

    return response.route('login')
  }
}

module.exports = LogoutController
