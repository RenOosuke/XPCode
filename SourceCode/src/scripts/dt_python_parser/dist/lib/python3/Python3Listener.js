"use strict";

// Generated from /Users/ziv/github.com/dt-python-parser/src/grammar/python3/Python3.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
// This class defines a complete listener for a parse tree produced by Python3Parser.
function Python3Listener() {
  antlr4.tree.ParseTreeListener.call(this);
  return this;
}
Python3Listener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
Python3Listener.prototype.constructor = Python3Listener;
// Enter a parse tree produced by Python3Parser#root.
Python3Listener.prototype.enterRoot = function (ctx) {};
// Exit a parse tree produced by Python3Parser#root.
Python3Listener.prototype.exitRoot = function (ctx) {};
// Enter a parse tree produced by Python3Parser#single_input.
Python3Listener.prototype.enterSingle_input = function (ctx) {};
// Exit a parse tree produced by Python3Parser#single_input.
Python3Listener.prototype.exitSingle_input = function (ctx) {};
// Enter a parse tree produced by Python3Parser#file_input.
Python3Listener.prototype.enterFile_input = function (ctx) {};
// Exit a parse tree produced by Python3Parser#file_input.
Python3Listener.prototype.exitFile_input = function (ctx) {};
// Enter a parse tree produced by Python3Parser#eval_input.
Python3Listener.prototype.enterEval_input = function (ctx) {};
// Exit a parse tree produced by Python3Parser#eval_input.
Python3Listener.prototype.exitEval_input = function (ctx) {};
// Enter a parse tree produced by Python3Parser#decorator.
Python3Listener.prototype.enterDecorator = function (ctx) {};
// Exit a parse tree produced by Python3Parser#decorator.
Python3Listener.prototype.exitDecorator = function (ctx) {};
// Enter a parse tree produced by Python3Parser#decorators.
Python3Listener.prototype.enterDecorators = function (ctx) {};
// Exit a parse tree produced by Python3Parser#decorators.
Python3Listener.prototype.exitDecorators = function (ctx) {};
// Enter a parse tree produced by Python3Parser#decorated.
Python3Listener.prototype.enterDecorated = function (ctx) {};
// Exit a parse tree produced by Python3Parser#decorated.
Python3Listener.prototype.exitDecorated = function (ctx) {};
// Enter a parse tree produced by Python3Parser#async_funcdef.
Python3Listener.prototype.enterAsync_funcdef = function (ctx) {};
// Exit a parse tree produced by Python3Parser#async_funcdef.
Python3Listener.prototype.exitAsync_funcdef = function (ctx) {};
// Enter a parse tree produced by Python3Parser#funcdef.
Python3Listener.prototype.enterFuncdef = function (ctx) {};
// Exit a parse tree produced by Python3Parser#funcdef.
Python3Listener.prototype.exitFuncdef = function (ctx) {};
// Enter a parse tree produced by Python3Parser#parameters.
Python3Listener.prototype.enterParameters = function (ctx) {};
// Exit a parse tree produced by Python3Parser#parameters.
Python3Listener.prototype.exitParameters = function (ctx) {};
// Enter a parse tree produced by Python3Parser#typedargslist.
Python3Listener.prototype.enterTypedargslist = function (ctx) {};
// Exit a parse tree produced by Python3Parser#typedargslist.
Python3Listener.prototype.exitTypedargslist = function (ctx) {};
// Enter a parse tree produced by Python3Parser#tfpdef.
Python3Listener.prototype.enterTfpdef = function (ctx) {};
// Exit a parse tree produced by Python3Parser#tfpdef.
Python3Listener.prototype.exitTfpdef = function (ctx) {};
// Enter a parse tree produced by Python3Parser#varargslist.
Python3Listener.prototype.enterVarargslist = function (ctx) {};
// Exit a parse tree produced by Python3Parser#varargslist.
Python3Listener.prototype.exitVarargslist = function (ctx) {};
// Enter a parse tree produced by Python3Parser#vfpdef.
Python3Listener.prototype.enterVfpdef = function (ctx) {};
// Exit a parse tree produced by Python3Parser#vfpdef.
Python3Listener.prototype.exitVfpdef = function (ctx) {};
// Enter a parse tree produced by Python3Parser#stmt.
Python3Listener.prototype.enterStmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#stmt.
Python3Listener.prototype.exitStmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#simple_stmt.
Python3Listener.prototype.enterSimple_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#simple_stmt.
Python3Listener.prototype.exitSimple_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#small_stmt.
Python3Listener.prototype.enterSmall_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#small_stmt.
Python3Listener.prototype.exitSmall_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#expr_stmt.
Python3Listener.prototype.enterExpr_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#expr_stmt.
Python3Listener.prototype.exitExpr_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#testlist_star_expr.
Python3Listener.prototype.enterTestlist_star_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#testlist_star_expr.
Python3Listener.prototype.exitTestlist_star_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#augassign.
Python3Listener.prototype.enterAugassign = function (ctx) {};
// Exit a parse tree produced by Python3Parser#augassign.
Python3Listener.prototype.exitAugassign = function (ctx) {};
// Enter a parse tree produced by Python3Parser#del_stmt.
Python3Listener.prototype.enterDel_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#del_stmt.
Python3Listener.prototype.exitDel_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#pass_stmt.
Python3Listener.prototype.enterPass_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#pass_stmt.
Python3Listener.prototype.exitPass_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#flow_stmt.
Python3Listener.prototype.enterFlow_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#flow_stmt.
Python3Listener.prototype.exitFlow_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#break_stmt.
Python3Listener.prototype.enterBreak_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#break_stmt.
Python3Listener.prototype.exitBreak_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#continue_stmt.
Python3Listener.prototype.enterContinue_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#continue_stmt.
Python3Listener.prototype.exitContinue_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#return_stmt.
Python3Listener.prototype.enterReturn_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#return_stmt.
Python3Listener.prototype.exitReturn_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#yield_stmt.
Python3Listener.prototype.enterYield_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#yield_stmt.
Python3Listener.prototype.exitYield_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#raise_stmt.
Python3Listener.prototype.enterRaise_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#raise_stmt.
Python3Listener.prototype.exitRaise_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#import_stmt.
Python3Listener.prototype.enterImport_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#import_stmt.
Python3Listener.prototype.exitImport_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#import_name.
Python3Listener.prototype.enterImport_name = function (ctx) {};
// Exit a parse tree produced by Python3Parser#import_name.
Python3Listener.prototype.exitImport_name = function (ctx) {};
// Enter a parse tree produced by Python3Parser#import_from.
Python3Listener.prototype.enterImport_from = function (ctx) {};
// Exit a parse tree produced by Python3Parser#import_from.
Python3Listener.prototype.exitImport_from = function (ctx) {};
// Enter a parse tree produced by Python3Parser#import_as_name.
Python3Listener.prototype.enterImport_as_name = function (ctx) {};
// Exit a parse tree produced by Python3Parser#import_as_name.
Python3Listener.prototype.exitImport_as_name = function (ctx) {};
// Enter a parse tree produced by Python3Parser#dotted_as_name.
Python3Listener.prototype.enterDotted_as_name = function (ctx) {};
// Exit a parse tree produced by Python3Parser#dotted_as_name.
Python3Listener.prototype.exitDotted_as_name = function (ctx) {};
// Enter a parse tree produced by Python3Parser#import_as_names.
Python3Listener.prototype.enterImport_as_names = function (ctx) {};
// Exit a parse tree produced by Python3Parser#import_as_names.
Python3Listener.prototype.exitImport_as_names = function (ctx) {};
// Enter a parse tree produced by Python3Parser#dotted_as_names.
Python3Listener.prototype.enterDotted_as_names = function (ctx) {};
// Exit a parse tree produced by Python3Parser#dotted_as_names.
Python3Listener.prototype.exitDotted_as_names = function (ctx) {};
// Enter a parse tree produced by Python3Parser#dotted_name.
Python3Listener.prototype.enterDotted_name = function (ctx) {};
// Exit a parse tree produced by Python3Parser#dotted_name.
Python3Listener.prototype.exitDotted_name = function (ctx) {};
// Enter a parse tree produced by Python3Parser#global_stmt.
Python3Listener.prototype.enterGlobal_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#global_stmt.
Python3Listener.prototype.exitGlobal_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#nonlocal_stmt.
Python3Listener.prototype.enterNonlocal_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#nonlocal_stmt.
Python3Listener.prototype.exitNonlocal_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#assert_stmt.
Python3Listener.prototype.enterAssert_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#assert_stmt.
Python3Listener.prototype.exitAssert_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#compound_stmt.
Python3Listener.prototype.enterCompound_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#compound_stmt.
Python3Listener.prototype.exitCompound_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#async_stmt.
Python3Listener.prototype.enterAsync_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#async_stmt.
Python3Listener.prototype.exitAsync_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#if_stmt.
Python3Listener.prototype.enterIf_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#if_stmt.
Python3Listener.prototype.exitIf_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#while_stmt.
Python3Listener.prototype.enterWhile_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#while_stmt.
Python3Listener.prototype.exitWhile_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#for_stmt.
Python3Listener.prototype.enterFor_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#for_stmt.
Python3Listener.prototype.exitFor_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#try_stmt.
Python3Listener.prototype.enterTry_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#try_stmt.
Python3Listener.prototype.exitTry_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#with_stmt.
Python3Listener.prototype.enterWith_stmt = function (ctx) {};
// Exit a parse tree produced by Python3Parser#with_stmt.
Python3Listener.prototype.exitWith_stmt = function (ctx) {};
// Enter a parse tree produced by Python3Parser#with_item.
Python3Listener.prototype.enterWith_item = function (ctx) {};
// Exit a parse tree produced by Python3Parser#with_item.
Python3Listener.prototype.exitWith_item = function (ctx) {};
// Enter a parse tree produced by Python3Parser#except_clause.
Python3Listener.prototype.enterExcept_clause = function (ctx) {};
// Exit a parse tree produced by Python3Parser#except_clause.
Python3Listener.prototype.exitExcept_clause = function (ctx) {};
// Enter a parse tree produced by Python3Parser#suite.
Python3Listener.prototype.enterSuite = function (ctx) {};
// Exit a parse tree produced by Python3Parser#suite.
Python3Listener.prototype.exitSuite = function (ctx) {};
// Enter a parse tree produced by Python3Parser#test.
Python3Listener.prototype.enterTest = function (ctx) {};
// Exit a parse tree produced by Python3Parser#test.
Python3Listener.prototype.exitTest = function (ctx) {};
// Enter a parse tree produced by Python3Parser#test_nocond.
Python3Listener.prototype.enterTest_nocond = function (ctx) {};
// Exit a parse tree produced by Python3Parser#test_nocond.
Python3Listener.prototype.exitTest_nocond = function (ctx) {};
// Enter a parse tree produced by Python3Parser#lambdef.
Python3Listener.prototype.enterLambdef = function (ctx) {};
// Exit a parse tree produced by Python3Parser#lambdef.
Python3Listener.prototype.exitLambdef = function (ctx) {};
// Enter a parse tree produced by Python3Parser#lambdef_nocond.
Python3Listener.prototype.enterLambdef_nocond = function (ctx) {};
// Exit a parse tree produced by Python3Parser#lambdef_nocond.
Python3Listener.prototype.exitLambdef_nocond = function (ctx) {};
// Enter a parse tree produced by Python3Parser#or_test.
Python3Listener.prototype.enterOr_test = function (ctx) {};
// Exit a parse tree produced by Python3Parser#or_test.
Python3Listener.prototype.exitOr_test = function (ctx) {};
// Enter a parse tree produced by Python3Parser#and_test.
Python3Listener.prototype.enterAnd_test = function (ctx) {};
// Exit a parse tree produced by Python3Parser#and_test.
Python3Listener.prototype.exitAnd_test = function (ctx) {};
// Enter a parse tree produced by Python3Parser#not_test.
Python3Listener.prototype.enterNot_test = function (ctx) {};
// Exit a parse tree produced by Python3Parser#not_test.
Python3Listener.prototype.exitNot_test = function (ctx) {};
// Enter a parse tree produced by Python3Parser#comparison.
Python3Listener.prototype.enterComparison = function (ctx) {};
// Exit a parse tree produced by Python3Parser#comparison.
Python3Listener.prototype.exitComparison = function (ctx) {};
// Enter a parse tree produced by Python3Parser#comp_op.
Python3Listener.prototype.enterComp_op = function (ctx) {};
// Exit a parse tree produced by Python3Parser#comp_op.
Python3Listener.prototype.exitComp_op = function (ctx) {};
// Enter a parse tree produced by Python3Parser#star_expr.
Python3Listener.prototype.enterStar_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#star_expr.
Python3Listener.prototype.exitStar_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#expr.
Python3Listener.prototype.enterExpr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#expr.
Python3Listener.prototype.exitExpr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#xor_expr.
Python3Listener.prototype.enterXor_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#xor_expr.
Python3Listener.prototype.exitXor_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#and_expr.
Python3Listener.prototype.enterAnd_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#and_expr.
Python3Listener.prototype.exitAnd_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#shift_expr.
Python3Listener.prototype.enterShift_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#shift_expr.
Python3Listener.prototype.exitShift_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#arith_expr.
Python3Listener.prototype.enterArith_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#arith_expr.
Python3Listener.prototype.exitArith_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#term.
Python3Listener.prototype.enterTerm = function (ctx) {};
// Exit a parse tree produced by Python3Parser#term.
Python3Listener.prototype.exitTerm = function (ctx) {};
// Enter a parse tree produced by Python3Parser#factor.
Python3Listener.prototype.enterFactor = function (ctx) {};
// Exit a parse tree produced by Python3Parser#factor.
Python3Listener.prototype.exitFactor = function (ctx) {};
// Enter a parse tree produced by Python3Parser#power.
Python3Listener.prototype.enterPower = function (ctx) {};
// Exit a parse tree produced by Python3Parser#power.
Python3Listener.prototype.exitPower = function (ctx) {};
// Enter a parse tree produced by Python3Parser#atom_expr.
Python3Listener.prototype.enterAtom_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#atom_expr.
Python3Listener.prototype.exitAtom_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#atom.
Python3Listener.prototype.enterAtom = function (ctx) {};
// Exit a parse tree produced by Python3Parser#atom.
Python3Listener.prototype.exitAtom = function (ctx) {};
// Enter a parse tree produced by Python3Parser#testlist_comp.
Python3Listener.prototype.enterTestlist_comp = function (ctx) {};
// Exit a parse tree produced by Python3Parser#testlist_comp.
Python3Listener.prototype.exitTestlist_comp = function (ctx) {};
// Enter a parse tree produced by Python3Parser#trailer.
Python3Listener.prototype.enterTrailer = function (ctx) {};
// Exit a parse tree produced by Python3Parser#trailer.
Python3Listener.prototype.exitTrailer = function (ctx) {};
// Enter a parse tree produced by Python3Parser#subscriptlist.
Python3Listener.prototype.enterSubscriptlist = function (ctx) {};
// Exit a parse tree produced by Python3Parser#subscriptlist.
Python3Listener.prototype.exitSubscriptlist = function (ctx) {};
// Enter a parse tree produced by Python3Parser#subscript.
Python3Listener.prototype.enterSubscript = function (ctx) {};
// Exit a parse tree produced by Python3Parser#subscript.
Python3Listener.prototype.exitSubscript = function (ctx) {};
// Enter a parse tree produced by Python3Parser#sliceop.
Python3Listener.prototype.enterSliceop = function (ctx) {};
// Exit a parse tree produced by Python3Parser#sliceop.
Python3Listener.prototype.exitSliceop = function (ctx) {};
// Enter a parse tree produced by Python3Parser#exprlist.
Python3Listener.prototype.enterExprlist = function (ctx) {};
// Exit a parse tree produced by Python3Parser#exprlist.
Python3Listener.prototype.exitExprlist = function (ctx) {};
// Enter a parse tree produced by Python3Parser#testlist.
Python3Listener.prototype.enterTestlist = function (ctx) {};
// Exit a parse tree produced by Python3Parser#testlist.
Python3Listener.prototype.exitTestlist = function (ctx) {};
// Enter a parse tree produced by Python3Parser#dictorsetmaker.
Python3Listener.prototype.enterDictorsetmaker = function (ctx) {};
// Exit a parse tree produced by Python3Parser#dictorsetmaker.
Python3Listener.prototype.exitDictorsetmaker = function (ctx) {};
// Enter a parse tree produced by Python3Parser#classdef.
Python3Listener.prototype.enterClassdef = function (ctx) {};
// Exit a parse tree produced by Python3Parser#classdef.
Python3Listener.prototype.exitClassdef = function (ctx) {};
// Enter a parse tree produced by Python3Parser#arglist.
Python3Listener.prototype.enterArglist = function (ctx) {};
// Exit a parse tree produced by Python3Parser#arglist.
Python3Listener.prototype.exitArglist = function (ctx) {};
// Enter a parse tree produced by Python3Parser#argument.
Python3Listener.prototype.enterArgument = function (ctx) {};
// Exit a parse tree produced by Python3Parser#argument.
Python3Listener.prototype.exitArgument = function (ctx) {};
// Enter a parse tree produced by Python3Parser#comp_iter.
Python3Listener.prototype.enterComp_iter = function (ctx) {};
// Exit a parse tree produced by Python3Parser#comp_iter.
Python3Listener.prototype.exitComp_iter = function (ctx) {};
// Enter a parse tree produced by Python3Parser#comp_for.
Python3Listener.prototype.enterComp_for = function (ctx) {};
// Exit a parse tree produced by Python3Parser#comp_for.
Python3Listener.prototype.exitComp_for = function (ctx) {};
// Enter a parse tree produced by Python3Parser#comp_if.
Python3Listener.prototype.enterComp_if = function (ctx) {};
// Exit a parse tree produced by Python3Parser#comp_if.
Python3Listener.prototype.exitComp_if = function (ctx) {};
// Enter a parse tree produced by Python3Parser#yield_expr.
Python3Listener.prototype.enterYield_expr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#yield_expr.
Python3Listener.prototype.exitYield_expr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#yield_arg.
Python3Listener.prototype.enterYield_arg = function (ctx) {};
// Exit a parse tree produced by Python3Parser#yield_arg.
Python3Listener.prototype.exitYield_arg = function (ctx) {};
// Enter a parse tree produced by Python3Parser#str.
Python3Listener.prototype.enterStr = function (ctx) {};
// Exit a parse tree produced by Python3Parser#str.
Python3Listener.prototype.exitStr = function (ctx) {};
// Enter a parse tree produced by Python3Parser#number.
Python3Listener.prototype.enterNumber = function (ctx) {};
// Exit a parse tree produced by Python3Parser#number.
Python3Listener.prototype.exitNumber = function (ctx) {};
// Enter a parse tree produced by Python3Parser#integer.
Python3Listener.prototype.enterInteger = function (ctx) {};
// Exit a parse tree produced by Python3Parser#integer.
Python3Listener.prototype.exitInteger = function (ctx) {};
exports.Python3Listener = Python3Listener;