import Client from "../src/client"
import Spec from "../src/spec"
import Mock from "../src/mock"

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
        expect(config.data).to.equal(JSON.stringify({name: 'John'}))
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
      request.getBody().setParsedContent({
        name: 'John'
      })
    }).then(function (response) {
      expect(response.status).to.equal(200)
      expect(response.data).to.deep.equal({status: true})
      done()
    }).catch(e => done(e))
  })

  /** @test {Client#request} */
  it('[request] should process request from mock', (done) => {
    const spec = new Spec()
    spec.set('mock', new Mock({ dir: './test/mock' }))
    const mockClient = new Client(spec)
    mockClient.request('sample').then(response => {
      try {
        expect(response.status).to.equal(200)
        expect(response.data).to.deep.equal([
          {id: 1, name: 'John'},
          {id: 2, name: 'Marry'}
        ])
        done()
      } catch (e) {
        done(e)
      }
    }).catch(e => done(e))
  })
})
