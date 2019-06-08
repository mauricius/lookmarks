const Hashids = require('hashids')
const Env = use('Env')

class Hasher {

  constructor() {
    this.hashids = new Hashids(Env.get('APP_KEY'), 6, 'abcdefghijklmnopqrstuvwxyz1234567890')
  }

  encode (text) {
    return this.hashids.encode(text)
  }

  decode (text) {
    return this.hashids.decode(text)[0]
  }
}

module.exports = Hasher