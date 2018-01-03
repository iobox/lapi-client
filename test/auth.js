import Auth from '../src/auth'
import {Request} from 'lapi-http'
import {Buffer} from 'safe-buffer'

var expect = require('chai').expect

/** @test {Auth} */
describe('helper/replacer.js', function () {
  /** @test {Auth#authorize} */
  it('[authorize][none] should authorize request', () => {
    const request = new Request()
    const auth = new Auth()
    auth.authorize(request, {})
    expect(request.getHeader().has('Authorization')).to.be.false
  })

  /** @test {Auth#authorize} */
  it('[authorize][basic] should authorize request', () => {
    const request = new Request()
    const auth = new Auth(Auth.TYPE_BASIC)
    auth.authorize(request, {
      'auth_user': 'john',
      'auth_password': 'dummy'
    })
    expect(request.getHeader().has('Authorization')).to.be.true
    expect(request.getHeader().get('Authorization')).to.equal('Bearer ' + (new Buffer('john:dummy')).toString('base64'))
  })
})
