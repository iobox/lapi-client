'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
      authorizations: {},
      environments: {},
      settings: {
        env: '',
        uri: '',
        auth: ''
      }
    };

    if (typeof data['endpoints'] !== 'undefined') {
      this.register('endpoints', data['endpoints']);
    }
    if (typeof data['authorizations'] !== 'undefined') {
      this.register('authorizations', data['authorizations']);
    }
    if (typeof data['environments'] !== 'undefined') {
      this.register('environments', data['environments']);
    }
  }

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
        case 'authorization':
          this.data.authorizations[args[0]] = args[1];
          break;
        case 'authorizations':
          Object.keys(args[0]).forEach(function (key) {
            return _this.register('authorization', key, args[0][key]);
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
        default:
          break;
      }

      return this;
    }
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
        case 'authorization':
          if (!args.length) {
            this.data.authorizations = {};
          } else {
            args.forEach(function (key) {
              return delete _this2.data.authorizations[key];
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
  }, {
    key: 'endpoints',
    value: function endpoints() {
      return this.data.endpoints;
    }
  }, {
    key: 'authorizations',
    value: function authorizations() {
      return this.data.authorizations;
    }
  }, {
    key: 'environments',
    value: function environments() {
      return this.data.environments;
    }
  }, {
    key: 'settings',
    value: function settings() {
      return this.data.settings;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      this.data.settings[key] = value;
      return this;
    }

    /**
     * Make a request
     * @param {string} name
     * @returns {Error|Request}
     */

  }, {
    key: 'make',
    value: function make(name) {
      if (typeof this.endpoints()[name] === 'undefined') {
        return new Error('Endpoint "' + name + '" could not be found');
      }

      var request = new _lapiHttp.Request();
      var auth = void 0,
          parameters = void 0,
          uri = void 0;
      var endpoint = this.endpoints()[name];
      if (typeof endpoint['auth'] !== 'undefined') {
        auth = new _auth2.default(endpoint['auth']);
      } else if (typeof this.settings()['auth'] !== 'undefined') {
        auth = new _auth2.default(this.settings()['auth']);
      } else {
        auth = new _auth2.default();
      }
      if (typeof this.settings()['env'] !== 'undefined' && typeof this.environments()[this.settings()['env']] !== 'undefined') {
        parameters = this.environments()[this.settings()['env']];
      } else {
        parameters = {};
      }
      auth.authorize(request, parameters);

      if (typeof endpoint['method'] !== 'undefined') {
        request.setMethod(endpoint['method']);
      }
      if (typeof endpoint['uri'] !== 'undefined') {
        uri = endpoint['uri'];
      }
      if (typeof endpoint['path'] !== 'undefined') {
        uri += endpoint['path'];
      }
      uri = _replacer2.default.replace(uri, parameters);
      request.setUri(uri);

      return request;
    }
  }]);

  return Spec;
}();

exports.default = Spec;