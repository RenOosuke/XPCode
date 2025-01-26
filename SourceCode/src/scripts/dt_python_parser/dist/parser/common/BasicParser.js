"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var tree_1 = require("antlr4/tree");
var parserErrorListener_1 = require("./parserErrorListener");
/**
 * Custom Parser class, subclass needs extends it.
 */
var BasicParser = /*#__PURE__*/function () {
  function BasicParser() {}
  var _proto = BasicParser.prototype;
  _proto.parse = function parse(input, errorListener) {
    var parser = this.createParser(input);
    this._parser = parser;
    parser.removeErrorListeners();
    parser.addErrorListener(new parserErrorListener_1.default(errorListener));
    var parserTree = parser.root();
    return parserTree;
  };
  _proto.validate = function validate(input) {
    var lexerError = [];
    var syntaxErrors = [];
    var parser = this.createParser(input);
    this._parser = parser;
    parser.removeErrorListeners();
    parser.addErrorListener(new parserErrorListener_1.ParserErrorCollector(syntaxErrors));
    parser.root();
    return lexerError.concat(syntaxErrors);
  }
  /**
   * Visit parser tree
   * @param parserTree
   */
  // public abstract visit(visitor: any, parserTree: any);
  /**
   * The source string
   * @param input string
   */;
  _proto.getAllTokens = function getAllTokens(input) {
    return this.createLexer(input).getAllTokens();
  }
  /**
   * Get Parser instance by input string
   * @param input
   */;
  _proto.createParser = function createParser(input) {
    var lexer = this.createLexer(input);
    var parser = this.createParserFromLexer(lexer);
    // parser.buildParseTrees = true;
    this._parser = parser;
    return parser;
  }
  /**
   * It convert tree to string, it's convenient to use in unit test.
   * @param string input
   */;
  _proto.parserTreeToString = function parserTreeToString(input) {
    var parser = this.createParser(input);
    this._parser = parser;
    var tree = parser.root();
    return tree.toStringTree(parser.ruleNames);
  }
  /**
   * Get List-like style tree string
   * @param parserTree
   */;
  _proto.toString = function toString(parserTree) {
    return parserTree.toStringTree(this._parser.ruleNames);
  }
  /**
   * @param listener Listener instance extends ParserListener
   * @param parserTree parser Tree
   */;
  _proto.listen = function listen(listener, parserTree) {
    tree_1.ParseTreeWalker.DEFAULT.walk(listener, parserTree);
  };
  return BasicParser;
}();
exports.default = BasicParser;