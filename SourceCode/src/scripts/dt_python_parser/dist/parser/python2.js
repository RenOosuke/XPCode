"use strict";

function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
var __createBinding = void 0 && (void 0).__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __exportStar = void 0 && (void 0).__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
var antlr4_1 = require("antlr4");
var Python2Lexer_1 = require("../lib/python2/Python2Lexer");
var Python2Parser_1 = require("../lib/python2/Python2Parser");
__exportStar(require("../lib/python2/Python2Listener"), exports);
__exportStar(require("../lib/python2/Python2Visitor"), exports);
var BasicParser_1 = require("./common/BasicParser");
var Python = /*#__PURE__*/function (_BasicParser_1$defaul) {
  function Python() {
    return _BasicParser_1$defaul.apply(this, arguments) || this;
  }
  _inheritsLoose(Python, _BasicParser_1$defaul);
  var _proto = Python.prototype;
  _proto.createLexer = function createLexer(input) {
    var chars = new antlr4_1.InputStream(input);
    var lexer = new Python2Lexer_1.Python2Lexer(chars);
    return lexer;
  };
  _proto.createParserFromLexer = function createParserFromLexer(lexer) {
    var tokens = new antlr4_1.CommonTokenStream(lexer);
    return new Python2Parser_1.Python2Parser(tokens);
  };
  return Python;
}(BasicParser_1.default);
exports.default = Python;