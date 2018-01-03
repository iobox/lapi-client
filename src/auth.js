import Replacer from './helper/replacer'
import {Buffer} from 'safe-buffer'

import {Request} from 'lapi-http'

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
    request.getHeader().set('Authorization', 'Basic ' + bearer)
    return this
  }
}

/**
 * Authorization Extension
 *
 * Helps to authorize request
 */
export default class Auth {
  /**
   * Constructor
   * @param {!string} type
   */
  constructor(type = Auth.TYPE_NONE) {
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

  /**
   * Authorize request
   * @param {Request} request
   * @param {!Object} parameters
   * @returns {authBasic}
   */
  authorize(request, parameters) {
    return this.adapter.authorize(request, parameters)
  }
}
Auth.TYPE_NONE = ''
Auth.TYPE_BASIC = 'basic'
