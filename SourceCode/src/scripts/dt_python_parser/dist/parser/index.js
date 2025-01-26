"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Python3Visitor = exports.Python3Listener = exports.Python3Parser = exports.Python2Visitor = exports.Python2Listener = exports.Python2Parser = void 0;
var python2_1 = require("./python2");
Object.defineProperty(exports, "Python2Parser", {
  enumerable: true,
  get: function get() {
    return python2_1.default;
  }
});
var python2_2 = require("./python2");
Object.defineProperty(exports, "Python2Listener", {
  enumerable: true,
  get: function get() {
    return python2_2.Python2Listener;
  }
});
var python2_3 = require("./python2");
Object.defineProperty(exports, "Python2Visitor", {
  enumerable: true,
  get: function get() {
    return python2_3.Python2Visitor;
  }
});
var python3_1 = require("./python3");
Object.defineProperty(exports, "Python3Parser", {
  enumerable: true,
  get: function get() {
    return python3_1.default;
  }
});
var python3_2 = require("./python3");
Object.defineProperty(exports, "Python3Listener", {
  enumerable: true,
  get: function get() {
    return python3_2.Python3Listener;
  }
});
var python3_3 = require("./python3");
Object.defineProperty(exports, "Python3Visitor", {
  enumerable: true,
  get: function get() {
    return python3_3.Python3Visitor;
  }
});