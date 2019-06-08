'use strict'

const Logger = use('Logger')
const got = require('got')
const path = require('path')
const crypto = require('crypto')
const webshot = require('node-webshot')
const metascraper = require('metascraper')([
  require('metascraper-description')()
])

class MetaService {
  /**
   * Fetch the meta description from targetUrl
   * @param  string targetUrl
   * @return string
   */
  static async fetchDescription(targetUrl) {
    try {
      const { body: html, url } = await got(targetUrl)
      const metadata = await metascraper({ html, url })

      return metadata.description || ''
    } catch (error) {
      Logger.error(error)

      return ''
    }
  }

  /**
   * Fetch a screenshot of targetUrl
   * @param  string targetUrl
   * @param  string destination
   * @return string
   */
  static async fetchScreenshot(targetUrl, destination) {
    try {
      const filename =
        crypto
          .createHash('md5')
          .update(targetUrl)
          .digest('hex') + '.png'
      const destPath = path.join(destination, filename)

      await new Promise(function(resolve, reject) {
        webshot(targetUrl, destPath, function(err) {
          if (err) reject(err)

          resolve()
        })
      })

      return filename
    } catch (error) {
      Logger.error(error)

      return ''
    }
  }
}

module.exports = MetaService
