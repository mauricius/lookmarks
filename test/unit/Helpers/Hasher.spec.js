'use strict'

const { test, beforeEach } = use('Test/Suite')('Hasher')
const Hasher = use('App/Helpers/Hasher')

let hasher;

beforeEach(() => {
  hasher = new Hasher();
})

test('it should encode a number to a 6 chars string', ({ assert }) => {
  assert.equal(6, hasher.encode(123).length,)
})

test('it should decode an encoded string to its original value', ({ assert }) => {
  const encoded = hasher.encode(123)

  assert.equal(123, hasher.decode(encoded))
})
