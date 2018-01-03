import Auth from './auth'
import Replacer from './helper/replacer'
import {Request} from 'lapi-http'

export default class Spec {
  constructor(data = {}) {
    this.data = {
      endpoints: {},
      authorizations: {},
      environments: {},
      settings: {
        env: '',
        uri: '',
        auth: ''
      }
    }

    if (typeof data['endpoints'] !== 'undefined') {
      this.register('endpoints', data['endpoints'])
    }
    if (typeof data['authorizations'] !== 'undefined') {
      this.register('authorizations', data['authorizations'])
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
      case 'authorization':
        this.data.authorizations[args[0]] = args[1]
        break
      case 'authorizations':
        Object.keys(args[0]).forEach(key => this.register('authorization', key, args[0][key]))
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
      case 'authorization':
        if (!args.length) {
          this.data.authorizations = {}
        } else {
          args.forEach(key => delete this.data.authorizations[key])
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

  authorizations() {
    return this.data.authorizations
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

  make(name) {
    let request = new Request()
    if (typeof this.endpoints()[name] === 'undefined') {
      return request
    }

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
