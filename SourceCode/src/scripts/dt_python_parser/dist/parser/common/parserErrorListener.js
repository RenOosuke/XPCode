"use strict";

function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParserErrorCollector = void 0;
var error_1 = require("antlr4/error");
var ParserErrorCollector = /*#__PURE__*/function (_error_1$ErrorListene) {
  function ParserErrorCollector(error) {
    var _this;
    _this = _error_1$ErrorListene.call(this) || this;
    _this._errors = error;
    return _this;
  }
  _inheritsLoose(ParserErrorCollector, _error_1$ErrorListene);
  var _proto = ParserErrorCollector.prototype;
  _proto.syntaxError = function syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
    var endCol = charPositionInLine + 1;
    if (offendingSymbol && offendingSymbol.text !== null) {
      endCol = charPositionInLine + offendingSymbol.text.length;
    }
    this._errors.push({
      startLine: line,
      endLine: line,
      startCol: charPositionInLine,
      endCol: endCol,
      message: msg
    });
  };
  return ParserErrorCollector;
}(error_1.ErrorListener);
exports.ParserErrorCollector = ParserErrorCollector;
var ParserErrorListener = /*#__PURE__*/function (_error_1$ErrorListene2) {
  function ParserErrorListener(errorListener) {
    var _this2;
    _this2 = _error_1$ErrorListene2.call(this) || this;
    _this2._errorHandler = errorListener;
    return _this2;
  }
  _inheritsLoose(ParserErrorListener, _error_1$ErrorListene2);
  var _proto2 = ParserErrorListener.prototype;
  _proto2.syntaxError = function syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
    var endCol = charPositionInLine + 1;
    if (offendingSymbol && offendingSymbol.text !== null) {
      endCol = charPositionInLine + offendingSymbol.text.length;
    }
    if (this._errorHandler) {
      this._errorHandler({
        startLine: line,
        endLine: line,
        startCol: charPositionInLine,
        endCol: endCol,
        message: msg
      }, {
        e: e,
        line: line,
        msg: msg,
        recognizer: recognizer,
        offendingSymbol: offendingSymbol,
        charPositionInLine: charPositionInLine
      });
    }
  };
  return ParserErrorListener;
}(error_1.ErrorListener);
exports.default = ParserErrorListener;