'use strict'

let User = require('../../backend/models/users')

describe('users', () => {
  it('should do something', () => {
    let votiv = new User({ 'userName': 'votiv' })

    expect(votiv.userName).toEqual('votiv')
  })
})
