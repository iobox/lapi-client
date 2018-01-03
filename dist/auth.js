'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _replacer = require('./helper/replacer');

var _replacer2 = _interopRequireDefault(_replacer);

var _safeBuffer = require('safe-buffer');

var _lapiHttp = require('lapi-http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var authNone = function () {
  function authNone() {
    _classCallCheck(this, authNone);
  }

  _createClass(authNone, [{
    key: 'authorize',
    value: function authorize() {
      return this;
    }
  }]);

  return authNone;
}();

var authBasic = function () {
  function authBasic() {
    _classCallCheck(this, authBasic);
  }

  _createClass(authBasic, [{
    key: 'authorize',

    /**
     *
     * @param {Request} request
     * @param parameters
     * @returns {authBasic}
     */
    value: function authorize(request, parameters) {
      var bearer = new _safeBuffer.Buffer(_replacer2.default.replace('{{auth_user}}:{{auth_password}}', parameters)).toString('base64');
      request.getHeader().set('Authorization', 'Bearer ' + bearer);
      return this;
    }
  }]);

  return authBasic;
}();

/**
 * Authorization Extension
 *
 * Helps to authorize request
 */


var Auth = function () {
  /**
   * Constructor
   * @param {!string} type
   */
  function Auth() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Auth.TYPE_NONE;

    _classCallCheck(this, Auth);

    this.type = type;
    switch (type) {
      case Auth.TYPE_BASIC:
        this.adapter = new authBasic();
        break;
      default:
        this.adapter = new authNone();
        break;
    }
  }

  /**
   * Authorize request
   * @param {Request} request
   * @param {!Object} parameters
   * @returns {authBasic}
   */


  _createClass(Auth, [{
    key: 'authorize',
    value: function authorize(request, parameters) {
      return this.adapter.authorize(request, parameters);
    }
  }]);

  return Auth;
}();

exports.default = Auth;

Auth.TYPE_NONE = '';
Auth.TYPE_BASIC = 'basic';