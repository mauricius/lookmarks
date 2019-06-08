'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ViewHelpersServiceProvider extends ServiceProvider {
  /**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register() {
    //
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot() {
    const View = this.app.use('Adonis/Src/View')

    View.global('parseInt', (value, base = 10) => parseInt(value, base))

    View.global('year', () => new Date().getFullYear())
  }
}

module.exports = ViewHelpersServiceProvider
