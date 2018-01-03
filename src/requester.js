const Request = require('lapi-http').Request
const InvalidArgumentException = require('lapi-common').exception.InvalidArgumentException

export default class Requester {
    constructor(request) {
      if (request instanceof Request) {
        this.request = request
      } else {
        throw new InvalidArgumentException('request must be an instance of Request')
      }
    }
}
