import Spec from './spec'
import Requester from './requester'
import Request from 'lapi-http'

export default class Client {
    constructor(spec = {}) {
        if (spec instanceof Spec) {
            this.spec = spec
        } else {
            this.spec = new Spec(spec)
        }
    }

    make(name) {
        return new Requester(this.spec.make(name))
    }
}
