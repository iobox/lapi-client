'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _spec = require('./spec');

var _spec2 = _interopRequireDefault(_spec);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  function Client() {
    var spec = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Client);

    if (spec instanceof _spec2.default) {
      this.spec = spec;
    } else {
      this.spec = new _spec2.default(spec);
    }
  }

  /**
   * Execute request
   * @param {string} name
   * @param {?function} middleware
   * @returns {AxiosPromise|Promise}
   */


  _createClass(Client, [{
    key: 'request',
    value: function request(name, middleware) {
      var request = this.spec.make(name);
      if (request instanceof Error) {
        return new Promise(function (resolve, reject) {
          reject(request);
        });
      }

      var options = {};
      if (typeof middleware === 'function') {
        middleware(request, options);
      }

      return (0, _axios2.default)(Object.assign({
        method: request.getMethod(),
        url: request.getUri().toString(),
        headers: request.getHeader().all()
      }, options));
    }
  }]);

  return Client;
}();

exports.default = Client;