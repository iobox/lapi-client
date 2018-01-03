import Auth from './auth'
import Replacer from './helper/replacer'
import {Request} from 'lapi-http'

export default class Spec {
  constructor(data = {}) {
    this.data = {
      endpoints: {},
      environments: {},
      settings: {}
    }

    if (typeof data['endpoints'] !== 'undefined') {
      this.register('endpoints', data['endpoints'])
    }
    if (typeof data['environments'] !== 'undefined') {
      this.register('environments', data['environments'])
    }
  }

  register(type, ...args) {
    switch (type) {
      case 'endpoint':
        this.data.endpoints[args[0]] = args[1]
        break
      case 'endpoints':
        Object.keys(args[0]).forEach(key => this.register('endpoint', key, args[0][key]))
        break
      case 'environment':
        this.data.environments[args[0]] = args[1]
        break
      case 'environments':
        Object.keys(args[0]).forEach(key => this.register('environment', key, args[0][key]))
        break
      default:
        break
    }

    return this
  }

  remove(type, ...args) {
    switch (type) {
      case 'endpoint':
        if (!args.length) {
          this.data.endpoints = {}
        } else {
          args.forEach(key => delete this.data.endpoints[key])
        }
        break
      case 'environment':
        if (!args.length) {
          this.data.environments = {}
        } else {
          args.forEach(key => delete this.data.environments[key])
        }
        break
      default:
        break
    }
  }

  endpoints() {
    return this.data.endpoints
  }

  environments() {
    return this.data.environments
  }

  settings() {
    return this.data.settings
  }

  set(key, value) {
    this.data.settings[key] = value
    return this
  }

  /**
   * Make a request
   * @param {string} name
   * @returns {Error|Request}
   */
  make(name) {
    if (typeof this.endpoints()[name] === 'undefined') {
      return new Error('Endpoint "' + name + '" could not be found')
    }

    let request = new Request()
    let auth, parameters, uri
    const endpoint = this.endpoints()[name]
    if (typeof endpoint['auth'] !== 'undefined') {
      auth = new Auth(endpoint['auth'])
    } else if (typeof this.settings()['auth'] !== 'undefined') {
      auth = new Auth(this.settings()['auth'])
    } else {
      auth = new Auth()
    }
    if (typeof this.settings()['env'] !== 'undefined'
      && typeof this.environments()[this.settings()['env']] !== 'undefined') {
      parameters = this.environments()[this.settings()['env']]
    } else {
      parameters = {}
    }
    auth.authorize(request, parameters)

    if (typeof endpoint['method'] !== 'undefined') {
      request.setMethod(endpoint['method'])
    }
    if (typeof endpoint['uri'] !== 'undefined') {
      uri = endpoint['uri']
    }
    if (typeof endpoint['path'] !== 'undefined') {
      uri += endpoint['path']
    }
    uri = Replacer.replace(uri, parameters)
    request.setUri(uri)

    return request
  }
}
