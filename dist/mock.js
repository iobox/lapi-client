'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mock = function () {
  function Mock() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Mock);

    this.options = Object.assign({
      dir: null
    }, options);
  }

  /**
   * Execute Mock's request
   * @param {string} name
   * @param {?Object} parameters
   * @returns {Promise<any>}
   */


  _createClass(Mock, [{
    key: 'execute',
    value: function execute(name) {
      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var self = this;
      return new Promise(function (resolve, reject) {
        if (!self.validate()) {
          reject(new Error("Mock's configuration is incorrect."));
        }

        var file = self.locate(name, parameters);
        _fs2.default.readFile(file, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        });
      });
    }

    /**
     * Get options's value
     * @param {string} key
     * @param {?*} def
     * @returns {*}
     */

  }, {
    key: 'get',
    value: function get(key) {
      var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      return typeof this.options[key] !== 'undefined' ? this.options[key] : def;
    }

    /**
     * Validate options
     * @returns {boolean}
     */

  }, {
    key: 'validate',
    value: function validate() {
      if (this.get('dir') === null) {
        return false;
      }

      return true;
    }

    /**
     * Locate mock's json file
     * @param {string} name
     * @param {?Object} parameters
     * @returns {string}
     */

  }, {
    key: 'locate',
    value: function locate(name) {
      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var dir = this.get('dir');
      return _path2.default.resolve(dir, name + '.json');
    }
  }]);

  return Mock;
}();

exports.default = Mock;