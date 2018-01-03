import Replacer from '../../src/helper/replacer'

var expect = require('chai').expect

/** @test {Replacer} */
describe('helper/replacer.js', function () {
  /** @test {Replacer#replace} */
  it('[replace] should replace source with input parameters', () => {
    expect(Replacer.replace('{{auth_user}}:{{auth_password}}', {})).to.equal('{{auth_user}}:{{auth_password}}')
    expect(Replacer.replace('{{auth_user}}:{{auth_password}}', {
      'auth_user': 'john',
      'auth_password': 'dummy'
    })).to.equal('john:dummy')
  })
})
