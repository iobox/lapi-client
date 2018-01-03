import Client from "../src/client"

var expect = require('chai').expect
var settle = require('axios')

/** @test {Client} */
describe('client.js', function () {
  const client = new Client({
    endpoints: {
      foo: {
        uri: 'http://localhost',
        path: '/products',
        method: 'POST'
      }
    }
  })

  /** @test {Client#request} */
  it('[request] should process request from spec', (done) => {
    client.request('foo', function(request, options) {
      options.adapter = function (config) {
        expect(config.timeout).to.equal(1200)
        expect(config.url).to.equal('http://localhost/products')
        expect(config.method).to.equal('post')
        return new Promise(function(resolve) {
          resolve({
            status: 200,
            data: {
              status: true
            }
          })
        })
      }
      options.timeout = 1200
    }).then(function (response) {
      expect(response.status).to.equal(200)
      expect(response.data).to.deep.equal({status: true})
      done()
    }).catch(e => done(e))
  })
})
