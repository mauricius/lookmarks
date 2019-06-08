'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

const Route = use('Route')

Route.get('/', 'HomeController.index').as('home')

Route.get('register', 'Auth/RegisterController.showRegister').middleware(['guest']).as('register')
Route.post('register', 'Auth/RegisterController.register').as('register')
Route.post('logout', 'Auth/LogoutController.logout').as('logout')
Route.get('login', 'Auth/LoginController.showLogin').middleware(['guest']).as('showLogin')
Route.post('login', 'Auth/LoginController.login').as('login')
Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm').middleware(['guest']).as('password.reset')
Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail').as('password.email')
Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm').middleware(['guest'])
Route.post('password/reset', 'Auth/PasswordResetController.reset')

Route.group(() => {
  Route.get('/account', 'UserController.showEditAccount').as('settings.account')
  Route.put('/account', 'UserController.updateAccount').as('settings.updateAccount')
  Route.get('/password', 'UserController.showChangePassword').as('settings.password')
  Route.put('/password', 'UserController.updatePassword')
  Route.get('/data', 'UserController.showPersonalData').as('settings.data')
  Route.delete('/data', 'UserController.deleteData')
})
  .prefix('settings')
  .middleware(['auth'])

Route.group(() => {
  Route.resource('categories', 'CategoryController')
    .except(['show'])
    .validator(new Map([
      [['categories.store'], ['CategoryStore']],
      [['categories.update'], ['CategoryUpdate']],
      [['categories.destroy'], ['CategoryDestroy']],
    ]))

  Route.get('bookmarks/upload', 'BookmarkController.showUpload').as('bookmarks.show_upload')
  Route.post('bookmarks/upload', 'BookmarkController.upload').as('bookmarks.upload')
  Route.get('bookmarks/:id/screenshot', 'BookmarkController.screenshot').as('bookmarks.screenshot')
  Route.delete('bookmarks/:id/screenshot', 'BookmarkController.deleteScreenshot').as('bookmarks.deleteScreenshot')
  Route.resource('bookmarks', 'BookmarkController')
    .except(['show'])
    .validator(new Map([
      [['bookmarks.store'], ['BookmarkStore']],
      [['bookmarks.update'], ['BookmarkUpdate']],
      [['bookmarks.destroy'], ['BookmarkDestroy']],
    ]))
})
  .middleware(['auth'])
