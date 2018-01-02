import Spec from './spec'
import Requester from './requester'

export default class Client {
    constructor(spec = {}) {
        if (spec instanceof Spec) {
            this.spec = spec
        } else {
            this.spec = new Spec(spec)
        }
    }

    make(name) {
        return new Requester()
    }
}