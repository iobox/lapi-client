import Spec from './spec'
import Mock from './mock'
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
   * @param {?Object} parameters
   * @returns {AxiosPromise|Promise}
   */
  request(name, middleware = null, parameters = {}) {
    const mock = this.spec.get('mock');
    if (mock !== null && mock instanceof Mock) {
      return mock.execute(name, parameters)
    }

    let request = this.spec.make(name, parameters)
    if (request instanceof Error) {
      return new Promise(function(resolve, reject) {
        reject(request)
      })
    }

    let options = {}
    if (middleware !== null && typeof middleware === 'function') {
      middleware(request, options)
    }

    let config = Object.assign({
      method: request.getMethod(),
      url: request.getUri().toString(),
      headers: request.getHeader().all()
    }, options)
    if (request.getMethod().toLowerCase() !== 'get') {
      config.data = request.getBody().getParsedContent()
    }
    return axios(config)
  }
}
