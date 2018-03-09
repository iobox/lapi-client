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
        },
        baz: {
          uri: '{{scheme}}://{{host}}',
          path: '/products',
          method: 'POST',
          query: {
            a: 'x'
          }
        },
        bar: {
          uri: '{{scheme}}://{{host}}',
          path: '/products',
          method: 'GET',
          middlewares: ['auth']
        },
        test_1: {
          path: '/products/{{product_id}}',
          method: 'GET',
          parameters: {
            product_id: 999,
            service: 'my-service'
          }
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
      },
      middlewares: {
        'auth': function(request, parameters) {
          request.set('some-attr', 'some-value')
          return [request, parameters]
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

    spec.set('env', 'prod')
    request = spec.make('baz')
    expect(request.getMethod()).to.equal('POST')
    expect(request.getUri().toString()).to.equal('https://live.com/products?a=x')

    spec.set('env', 'prod')
    request = spec.make('bar')
    expect(request.getMethod()).to.equal('GET')
    expect(request.getUri().toString()).to.equal('https://live.com/products')
    expect(request.get('some-attr')).to.equal('some-value')

    spec.set('uri', 'http://api/{{service}}')
    spec.set('env', 'prod')
    request = spec.make('test_1')
    expect(request.getUri().toString()).to.equal('http://api/my-service/products/999')
  })
})
