'use strict'

const { hooks } = require('@adonisjs/ignitor')
const Hashids = require('hashids')

hooks.after.providersBooted(() => {
  const View = use('Adonis/Src/View')
  const Env = use('Env')

  const hashids = new Hashids(Env.get('APP_KEY'))

  View.global('appUrl', path => {
    const APP_URL = Env.get('APP_URL')

    return path ? `${APP_URL}/${path}` : APP_URL
  })

  View.global('encodeURIComponent', token => {
    return encodeURIComponent(token)
  })

  View.global('encode', text => {
    return hashids.encode(text)
  })

  View.global('decode', text => {
    return hashids.decode(text)
  })

  View.global('range', (start, size) => {
    return [...Array(size).keys()].map(i => i + start)
  })
})
