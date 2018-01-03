import Spec from '../src/spec'

var expect = require('chai').expect

/** @test {Spec} */
describe('spec.js', function () {
  let spec
  beforeEach(() => {
    spec = new Spec()
  })

  /** @test {Spec#register} */
  it('[register] should allow to register endpoints, authorizations, environments', () => {
    expect(spec.data.endpoints).to.deep.equal({})
    expect(spec.data.environments).to.deep.equal({})

    spec.register('endpoint', 'products', {})
    expect(spec.data.endpoints).to.deep.equal({products: {}})
    spec.register('endpoints', {users: {}})
    expect(spec.data.endpoints).to.deep.equal({products: {}, users: {}})

    spec.register('environment', 'dev', {})
    expect(spec.data.environments).to.deep.equal({dev: {}})
    spec.register('environments', {prod: {}})
    expect(spec.data.environments).to.deep.equal({dev: {}, prod: {}})
  })

  /** @test {Spec#make} */
  it('[make] should return an appropriate request', () => {
    const spec = new Spec({
      endpoints: {
        foo: {
          uri: '{{scheme}}://{{host}}',
          path: '/products',
          method: 'GET'
        }
      },
      environments: {
        dev: {
          'scheme': 'http',
          'host': 'dev.com'
        },
        prod: {
          'scheme': 'https',
          'host': 'live.com'
        }
      }
    })

    let request
    spec.set('env', 'dev')
    request = spec.make('foo')
    expect(request.getMethod()).to.equal('GET')
    expect(request.getUri().toString()).to.equal('http://dev.com/products')

    spec.set('env', 'prod')
    request = spec.make('foo')
    expect(request.getMethod()).to.equal('GET')
    expect(request.getUri().toString()).to.equal('https://live.com/products')
  })
})
