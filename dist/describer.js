'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Describer = function () {
    function Describer() {
        var describer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Describer);

        this._spec = {};
        this._auth = {};
        this._env = {};

        if (typeof describer['spec'] !== 'undefined') {
            this.register('spec', describer['spec']);
        }
        if (typeof describer['auth'] !== 'undefined') {
            this.register('auth', describer['auth']);
        }
        if (typeof describer['env'] !== 'undefined') {
            this.register('env', describer['env']);
        }
    }

    _createClass(Describer, [{
        key: 'register',
        value: function register(type) {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            switch (type) {
                case 'spec':
                    if (args.length === 1 && Array.isArray(args[0])) {
                        Object.keys(args[0]).forEach(function (key) {
                            return _this.register('spec', key, args[0][key]);
                        });
                    } else if (args.length === 2) {
                        this._spec[args[0]] = args[1];
                    }
                    break;
                case 'auth':
                    if (args.length === 1 && Array.isArray(args[0])) {
                        Object.keys(args[0]).forEach(function (key) {
                            return _this.register('auth', key, args[0][key]);
                        });
                    } else if (args.length === 2) {
                        this._auth[args[0]] = args[1];
                    }
                    break;
                case 'env':
                    if (args.length === 1 && Array.isArray(args[0])) {
                        Object.keys(args[0]).forEach(function (key) {
                            return _this.register('env', key, args[0][key]);
                        });
                    } else if (args.length === 2) {
                        this._env[args[0]] = args[1];
                    }
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
                case 'spec':
                    if (!args.length) {
                        this._spec = {};
                    } else {
                        args.forEach(function (key) {
                            return delete _this2._spec[key];
                        });
                    }
                    break;
                case 'auth':
                    if (!args.length) {
                        this._auth = {};
                    } else {
                        args.forEach(function (key) {
                            return delete _this2._auth[key];
                        });
                    }
                    break;
                case 'env':
                    if (!args.length) {
                        this._env = {};
                    } else {
                        args.forEach(function (key) {
                            return delete _this2._env[key];
                        });
                    }
                    break;
                default:
                    break;
            }
        }
    }]);

    return Describer;
}();

exports.default = Describer;