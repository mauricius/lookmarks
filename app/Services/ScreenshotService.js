'use strict'

const Helpers = use('Helpers')
const fs = Helpers.promisify(require('fs'))
const path = require('path')

class ScreenshotService {
  /**
   * Delete the screenshot file
   * @param  string screenshot
   * @param  string from
   * @return
   */
  static async delete(screenshot, from) {
    const file = path.join(from, path.basename(screenshot))

    return await fs.unlink(file)
  }
}

module.exports = ScreenshotService
