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

  /**
   * Register an element
   * @param {string} type
   * @param {?Array} args
   * @returns {Spec}
   */
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

  /**
   * Remove an element by type
   * @param {string} type
   * @param {?Array} args
   */
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

  /**
   * Set a setting by key-value
   * @param {string} key
   * @param {*} value
   * @returns {Spec}
   */
  set(key, value = null) {
    this.data.settings[key] = value
    return this
  }

  /**
   * Get a setting by key
   * @param {string} key
   * @param {?*} def
   * @returns {*}
   */
  get(key, def = null) {
    return typeof this.data.settings[key] !== 'undefined' ? this.data.settings[key] : def
  }

  /**
   * Make a request
   * @param {string} name
   * @returns {Error|Request}
   */
  make(name) {
    if (typeof this.data.endpoints[name] === 'undefined') {
      return new Error('Endpoint "' + name + '" could not be found')
    }

    let request = new Request()
    let auth, parameters, uri
    const endpoint = this.data.endpoints[name]
    if (typeof endpoint['auth'] !== 'undefined') {
      auth = new Auth(endpoint['auth'])
    } else if (this.get('auth', '') !== '') {
      auth = new Auth(this.get('auth'))
    } else {
      auth = new Auth()
    }

    const env = this.get('env', '')
    if (env !== '' && typeof this.data.environments[env] !== 'undefined') {
      parameters = this.data.environments[env]
    } else {
      parameters = {}
    }
    auth.authorize(request, parameters)

    if (typeof endpoint['method'] !== 'undefined') {
      request.setMethod(endpoint['method'])
    }
    if (typeof endpoint['uri'] !== 'undefined') {
      uri = endpoint['uri']
    } else {
      uri = this.get('uri', '')
    }
    if (typeof endpoint['path'] !== 'undefined') {
      uri += endpoint['path']
    }
    uri = Replacer.replace(uri, parameters)
    request.setUri(uri)

    return request
  }
}
