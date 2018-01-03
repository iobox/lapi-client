'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Request = require('lapi-http').Request;
var InvalidArgumentException = require('lapi-common').exception.InvalidArgumentException;

var Requester = function Requester(request) {
  _classCallCheck(this, Requester);

  if (request instanceof Request) {
    this.request = request;
  } else {
    throw new InvalidArgumentException('request must be an instance of Request');
  }
};

exports.default = Requester;