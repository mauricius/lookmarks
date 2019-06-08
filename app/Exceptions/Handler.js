'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { session, response, view }) {
    if (error.name === 'InvalidSessionException') {
      session.flash({
        notification: {
          type: 'error',
          message: 'You must login to proceed.'
        }
      })

      await session.commit()

      return response.redirect('/login')
    }

    if (error.status === 404) {
      return response.send(view.render('errors.404'))
    }

    return super.handle(...arguments)
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {}
}

module.exports = ExceptionHandler
