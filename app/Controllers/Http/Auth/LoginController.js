'use strict'

const { validateAll } = use('Validator')

class LoginController {
  /**
   * Show the page to login
   * @param  options.view
   * @return redirect
   */
  showLogin ({ view, session }) {
    return view.render('auth.login')
  }

  /**
   * Perform the login action
   * @param  options.request
   * @param  options.auth
   * @param  options.response
   * @param  options.session
   * @return redirect
   */
  async login ({ request, auth, response, session }) {
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashOnly(['email'])

      return response.redirect('back')
    }

    const { email, password, remember } = request.all()

    try {
      await auth.remember(!!remember).attempt(email, password)

      return response.route('home')
    } catch (error) {
      session.flashOnly(['email'])
        .flash({
          notification: {
            type: 'error',
            message: `We couldn't verify your credentials.`
          }
        })

      return response.redirect('back')
    }
  }
}

module.exports = LoginController
