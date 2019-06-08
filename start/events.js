'use strict'

const Config = use('Config')
const Event = use('Event')
const Mail = use('Mail')

Event.on('forgot::password', async data => {
  const from = Config.get('mail.from')

  await Mail.send('auth.emails.password_reset', data, message => {
    message
      .to(data.user.email)
      .from(from)
      .subject('Password reset link')
  })
})

Event.on('password::reset', async data => {
  const from = Config.get('mail.from')

  await Mail.send('auth.emails.password_reset_success', data, message => {
    message
      .to(data.user.email)
      .from(from)
      .subject('Password reset successfully')
  })
})