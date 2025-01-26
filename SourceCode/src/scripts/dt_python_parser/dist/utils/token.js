"use strict";

var _exports$TokenReg;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenReg = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
  /**
   * Enclosed in single/double/back quotation, `` Symbol
   * 'abc', "abc", `abc`
   */
  TokenType["SingleQuotation"] = "SingleQuotation";
  TokenType["DoubleQuotation"] = "DoubleQuotation";
  TokenType["BackQuotation"] = "BackQuotation";
  /**
   * Language element type
   */
  TokenType["Comment"] = "Comment";
  /**
   * Statement
   */
  TokenType["StatementTerminator"] = "StatementTerminator";
  /**
   * Others
   */
  TokenType["Error"] = "Error";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
/**
 *  Token recognition rules
 */
exports.TokenReg = (_exports$TokenReg = {}, _exports$TokenReg[TokenType.StatementTerminator] = /[;]/, _exports$TokenReg[TokenType.SingleQuotation] = /[']/, _exports$TokenReg[TokenType.DoubleQuotation] = /["]/, _exports$TokenReg[TokenType.BackQuotation] = /[`]/, _exports$TokenReg);