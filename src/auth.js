import Replacer from './helper/replacer'
import {Buffer} from 'safe-buffer'

const Request = require('lapi-http').Request

class authNone {
  authorize() {
    return this
  }
}

class authBasic {
  /**
   *
   * @param {Request} request
   * @param parameters
   * @returns {authBasic}
   */
  authorize(request, parameters) {
    const bearer = (new Buffer(Replacer.replace('{{auth_user}}:{{auth_password}}', parameters))).toString('base64')
    request.getHeader().set('Authorization', 'Bearer ' + bearer)
    return this
  }
}

export default class Auth {
  constructor(type) {
    this.type = type
    switch (type) {
      case Auth.TYPE_BASIC:
        this.adapter = new authBasic()
        break
      default:
        this.adapter = new authNone()
        break
    }
  }

  authorize(request, parameters) {
    return this.adapter.authorize(request, parameters)
  }
}
Auth.TYPE_BASIC = 'basic'
