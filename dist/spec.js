'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _replacer = require('./helper/replacer');

var _replacer2 = _interopRequireDefault(_replacer);

var _lapiHttp = require('lapi-http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Spec = function () {
  function Spec() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Spec);

    this.data = {
      endpoints: {},
      environments: {},
      middlewares: {},
      settings: {}
    };

    if (typeof data['endpoints'] !== 'undefined') {
      this.register('endpoints', data['endpoints']);
    }
    if (typeof data['environments'] !== 'undefined') {
      this.register('environments', data['environments']);
    }
    if (typeof data['middlewares'] !== 'undefined') {
      this.register('middlewares', data['middlewares']);
    }
  }

  /**
   * Register an element
   * @param {string} type
   * @param {?Array} args
   * @returns {Spec}
   */


  _createClass(Spec, [{
    key: 'register',
    value: function register(type) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      switch (type) {
        case 'endpoint':
          this.data.endpoints[args[0]] = args[1];
          break;
        case 'endpoints':
          Object.keys(args[0]).forEach(function (key) {
            return _this.register('endpoint', key, args[0][key]);
          });
          break;
        case 'environment':
          this.data.environments[args[0]] = args[1];
          break;
        case 'environments':
          Object.keys(args[0]).forEach(function (key) {
            return _this.register('environment', key, args[0][key]);
          });
          break;
        case 'middleware':
          this.data.middlewares[args[0]] = args[1];
          break;
        case 'middlewares':
          Object.keys(args[0]).forEach(function (key) {
            return _this.register('middleware', key, args[0][key]);
          });
          break;
        default:
          break;
      }

      return this;
    }

    /**
     * Remove an element by type
     * @param {string} type
     * @param {?Array} args
     */

  }, {
    key: 'remove',
    value: function remove(type) {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      switch (type) {
        case 'endpoint':
          if (!args.length) {
            this.data.endpoints = {};
          } else {
            args.forEach(function (key) {
              return delete _this2.data.endpoints[key];
            });
          }
          break;
        case 'environment':
          if (!args.length) {
            this.data.environments = {};
          } else {
            args.forEach(function (key) {
              return delete _this2.data.environments[key];
            });
          }
          break;
        default:
          break;
      }
    }

    /**
     * Set a setting by key-value
     * @param {string} key
     * @param {*} value
     * @returns {Spec}
     */

  }, {
    key: 'set',
    value: function set(key) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this.data.settings[key] = value;
      return this;
    }

    /**
     * Get a setting by key
     * @param {string} key
     * @param {?*} def
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(key) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return typeof this.data.settings[key] !== 'undefined' ? this.data.settings[key] : def;
    }

    /**
     * Make a request
     * @param {string} name
     * @returns {Error|Request}
     */

  }, {
    key: 'make',
    value: function make(name) {
      var _this3 = this;

      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (typeof this.data.endpoints[name] === 'undefined') {
        return new Error('Endpoint "' + name + '" could not be found');
      }

      var request = new _lapiHttp.Request();
      var auth = void 0,
          parameters = void 0,
          uri = void 0;
      var endpoint = this.data.endpoints[name];

      var env = this.get('env', '');
      if (env !== '' && typeof this.data.environments[env] !== 'undefined') {
        parameters = this.data.environments[env];
      } else {
        parameters = {};
      }
      if (_typeof(endpoint['parameters']) === 'object') {
        parameters = Object.assign(parameters, endpoint['parameters']);
      }
      parameters = Object.assign(parameters, args);

      if (typeof endpoint['middlewares'] !== 'undefined' && Array.isArray(endpoint['middlewares'])) {
        endpoint['middlewares'].forEach(function (key) {
          if (typeof _this3.data.middlewares[key] !== 'undefined') {
            var _data$middlewares$key = _this3.data.middlewares[key](request, parameters);

            var _data$middlewares$key2 = _slicedToArray(_data$middlewares$key, 2);

            request = _data$middlewares$key2[0];
            parameters = _data$middlewares$key2[1];
          }
        });
      } else if (this.get('middlewares') !== null) {
        this.get('middlewares').forEach(function (key) {
          if (typeof _this3.data.middlewares[key] !== 'undefined') {
            var _data$middlewares$key3 = _this3.data.middlewares[key](request, parameters);

            var _data$middlewares$key4 = _slicedToArray(_data$middlewares$key3, 2);

            request = _data$middlewares$key4[0];
            parameters = _data$middlewares$key4[1];
          }
        });
      }

      if (typeof endpoint['auth'] !== 'undefined') {
        auth = new _auth2.default(endpoint['auth']);
      } else if (this.get('auth', false) !== false) {
        auth = new _auth2.default(this.get('auth'));
      } else if (parameters['auth'] !== 'undefined') {
        auth = new _auth2.default(parameters['auth']);
      } else {
        auth = new _auth2.default();
      }
      auth.authorize(request, parameters);

      if (typeof endpoint['method'] !== 'undefined') {
        request.setMethod(endpoint['method']);
      }
      if (typeof endpoint['uri'] !== 'undefined') {
        uri = endpoint['uri'];
      } else {
        uri = this.get('uri', '');
      }
      if (typeof endpoint['path'] !== 'undefined') {
        uri += endpoint['path'];
      }
      uri = _replacer2.default.replace(uri, parameters);
      request.setUri(uri);
      if (_typeof(endpoint['query']) === 'object') {
        request.getUri().setQuery(endpoint['query']);
      }

      return request;
    }
  }]);

  return Spec;
}();

exports.default = Spec;