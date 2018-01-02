import Spec from '../src/spec'
var expect = require('chai').expect

/** @test {Spec} */
describe('spec.js', function() {
    let spec
    beforeEach(() => {
        spec = new Spec()
    })

    /** @test {Spec#register} */
    it('[register] should allow to register endpoints, authorizations, environments', () => {
        expect(spec.data.endpoints).to.deep.equal({})
        expect(spec.data.authorizations).to.deep.equal({})
        expect(spec.data.environments).to.deep.equal({})

        spec.register('endpoint', 'products', {})
        expect(spec.data.endpoints).to.deep.equal({products: {}})
        spec.register('endpoints', {users: {}})
        expect(spec.data.endpoints).to.deep.equal({products: {}, users: {}})

        spec.register('authorization', 'basic', {})
        expect(spec.data.authorizations).to.deep.equal({basic: {}})
        spec.register('authorizations', {oauth: {}})
        expect(spec.data.authorizations).to.deep.equal({basic: {}, oauth: {}})

        spec.register('environment', 'dev', {})
        expect(spec.data.environments).to.deep.equal({dev: {}})
        spec.register('environments', {prod: {}})
        expect(spec.data.environments).to.deep.equal({dev: {}, prod: {}})
    })
})