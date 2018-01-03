import Spec from './spec'
import axios from 'axios'

export default class Client {
  constructor(spec = {}) {
    if (spec instanceof Spec) {
      this.spec = spec
    } else {
      this.spec = new Spec(spec)
    }
  }

  /**
   * Execute request
   * @param {string} name
   * @param {?function} middleware
   * @returns {AxiosPromise|Promise}
   */
  request(name, middleware) {
    let request = this.spec.make(name)
    if (request instanceof Error) {
      return new Promise(function(resolve, reject) {
        reject(request)
      })
    }

    let options = {}
    if (typeof middleware === 'function') {
      middleware(request, options)
    }

    return axios(Object.assign({
      method: request.getMethod(),
      url: request.getUri().toString(),
      headers: request.getHeader().all()
    }, options))
  }
}
