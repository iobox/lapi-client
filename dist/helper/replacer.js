'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Replacer = function () {
  function Replacer() {
    _classCallCheck(this, Replacer);
  }

  _createClass(Replacer, null, [{
    key: 'replace',
    value: function replace(source, parameters) {
      var keys = Object.keys(parameters);
      if (keys.length > 0) {
        keys.forEach(function (key) {
          return source = source.replace('{{' + key + '}}', parameters[key]);
        });
      }

      return source;
    }
  }]);

  return Replacer;
}();

exports.default = Replacer;