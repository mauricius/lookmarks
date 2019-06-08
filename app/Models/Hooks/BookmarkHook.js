'use strict'

const Helpers = use('Helpers')
const ScreenshotService = use('App/Services/ScreenshotService')

const BookmarkHook = exports = module.exports = {}

BookmarkHook.deleteScreenshot = async (bookmark) => {
  if (bookmark.screenshot) {
    ScreenshotService.delete(bookmark.screenshot, Helpers.publicPath('uploads'))
  }
}