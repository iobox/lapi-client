'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _spec = require('./spec');

var _spec2 = _interopRequireDefault(_spec);

var _mock = require('./mock');

var _mock2 = _interopRequireDefault(_mock);

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
   * @param {?Object} parameters
   * @returns {AxiosPromise|Promise}
   */


  _createClass(Client, [{
    key: 'request',
    value: function request(name) {
      var middleware = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var mock = this.spec.get('mock');
      if (mock !== null && mock instanceof _mock2.default) {
        return mock.execute(name, parameters);
      }

      var request = this.spec.make(name, parameters);
      if (request instanceof Error) {
        return new Promise(function (resolve, reject) {
          reject(request);
        });
      }

      var options = {};
      if (middleware !== null && typeof middleware === 'function') {
        middleware(request, options);
      }

      var config = Object.assign({
        method: request.getMethod(),
        url: request.getUri().toString(),
        headers: request.getHeader().all()
      }, options);
      if (request.getMethod().toLowerCase() !== 'get') {
        config.data = request.getBody().getParsedContent();
      }
      return (0, _axios2.default)(config);
    }
  }]);

  return Client;
}();

exports.default = Client;