"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lexer = exports.cleanPython = void 0;
var token_1 = require("./token");
/**
 * 获取 注释 以及 分隔符 等词法信息
 * @param {String} python
 */
function lexer(input) {
  // 记录当前字符的位置
  var current = 0;
  var line = 1;
  // 最终的 TokenTypes 结果
  var tokens = [];
  /**
   * 提取 TokenType
   */
  // eslint-disable-next-line
  var extract = function extract(currentChar, validator, TokenType) {
    var value = '';
    var start = current;
    while (validator.test(currentChar)) {
      value += currentChar;
      currentChar = input[++current];
    }
    return {
      type: TokenType,
      start: start,
      end: current,
      lineNumber: line,
      value: value
    };
  };
  /**
   * 过滤（提取） 引号中的内容
   */
  // eslint-disable-next-line
  var matchQuotation = function matchQuotation(currentChar, validator, TokenType) {
    do {
      if (currentChar === '\n') {
        line++;
      }
      currentChar = input[++current];
    } while (!validator.test(currentChar));
    ++current;
  };
  while (current < input.length) {
    var char = input[current];
    // 按顺序处理 换行符 反引号 单引号 双引号 注释 分号
    // 引号内 可能包含注释包含的符号以及分号 所以优先处理引号里面的内容 去除干扰信息
    if (char === '\n') {
      line++;
      current++;
      continue;
    }
    if (token_1.TokenReg.BackQuotation.test(char)) {
      // eslint-disable-next-line
      matchQuotation(char, token_1.TokenReg.BackQuotation, token_1.TokenType.BackQuotation);
      continue;
    }
    if (token_1.TokenReg.SingleQuotation.test(char)) {
      // eslint-disable-next-line
      matchQuotation(char, token_1.TokenReg.SingleQuotation, token_1.TokenType.SingleQuotation);
      continue;
    }
    if (token_1.TokenReg.DoubleQuotation.test(char) && input[current + 1] !== `"`) {
      // eslint-disable-next-line
      matchQuotation(char, token_1.TokenReg.DoubleQuotation, token_1.TokenType.DoubleQuotation);
      continue;
    }
    // 处理单行注释，以 # 开始，\n 结束
    if (char === '#') {
      var value = '';
      var start = current;
      while (char !== '\n') {
        value += char;
        char = input[++current];
      }
      tokens.push({
        type: token_1.TokenType.Comment,
        value: value,
        start: start,
        lineNumber: line,
        end: current
      });
      continue;
    }
    // 处理多行注释，以 """ 开始， """结束
    if (char === `"` && input[current + 1] === `"` && input[current + 2] === `"`) {
      var _value = '"""';
      var _start = current;
      var startLine = line;
      current += 3;
      char = input[current];
      while (!(char === `"` && input[current - 1] === `"` && input[current - 2] === `"`)) {
        if (char === '\n') {
          line++;
        }
        _value += char;
        char = input[++current];
      }
      _value += char;
      ++current;
      tokens.push({
        type: token_1.TokenType.Comment,
        value: _value,
        start: _start,
        lineNumber: startLine,
        end: current
      });
      continue;
    }
    // 处理结束符 ;
    if (token_1.TokenReg.StatementTerminator.test(char)) {
      var newToken = extract(char, token_1.TokenReg.StatementTerminator, token_1.TokenType.StatementTerminator);
      tokens.push(newToken);
      continue;
    }
    current++;
  }
  return tokens;
}
exports.lexer = lexer;
/**
 * 清除注释和前后空格
 * @param {String} python
 */
function cleanPython(python) {
  python.trim(); // 删除前后空格
  var tokens = lexer(python);
  var resultPython = '';
  var startIndex = 0;
  tokens.forEach(function (ele) {
    if (ele.type === token_1.TokenType.Comment) {
      resultPython += python.slice(startIndex, ele.start);
      startIndex = ele.end + 1;
    }
  });
  resultPython += python.slice(startIndex);
  return resultPython;
}
exports.cleanPython = cleanPython;