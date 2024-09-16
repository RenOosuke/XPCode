ace.define("ace/theme/cloud_editor_dark-css",[], function(require, exports, module){module.exports = "\n.ace-cloud_editor_dark .ace_gutter {\n    background: #282c34;\n    color: #8e96a9;\n}\n\n.ace-cloud_editor_dark.ace_dark .ace_tooltip-marker-error.ace_tooltip-marker {\n    background-color: #ff5d64;\n}\n.ace-cloud_editor_dark.ace_dark .ace_tooltip-marker-warning.ace_tooltip-marker {\n    background-color: #e0ca57;\n}\n\n.ace-cloud_editor_dark .ace_print-margin {\n    width: 1px;\n    background: #e8e8e8;\n}\n\n.ace-cloud_editor_dark {\n    background-color: #282c34;\n    color: #dcdfe4;\n}\n\n.ace-cloud_editor_dark .ace_cursor {\n    color: #66b2f0;\n}\n\n.ace-cloud_editor_dark .ace_marker-layer .ace_selection {\n    background: #4376bd;\n}\n\n.ace-cloud_editor_dark.ace_multiselect .ace_selection.ace_start {\n    box-shadow: 0 0 3px 0px #8e96a9;\n    border-radius: 2px;\n}\n\n.ace-cloud_editor_dark .ace_marker-layer .ace_step {\n    background: #6fb342;\n}\n\n.ace-cloud_editor_dark .ace_marker-layer .ace_bracket {\n    margin: 0 0 0 -1px;\n    border: 1px solid #e8e8e8;\n}\n\n.ace-cloud_editor_dark .ace_marker-layer .ace_active-line {\n    box-sizing: border-box;\n    border-top: 1px solid #75777a;\n    border-bottom: 1px solid #75777a;\n}\n\n.ace-cloud_editor_dark .ace_gutter-cell_svg-icons {\n    box-sizing: border-box;\n    border-top: 1px solid #282c34;\n    border-bottom: 1px solid #282c34;\n}\n\n.ace-cloud_editor_dark .ace_gutter-active-line {\n    background-repeat: no-repeat;\n    box-sizing: border-box;\n    border-top: 1px solid #75777a;\n    border-bottom: 1px solid #75777a;\n}\n\n.ace-cloud_editor_dark .ace_marker-layer .ace_selected-word {\n    border: 1px solid #9bd0f7;\n}\n\n.ace-cloud_editor_dark .ace_fold {\n    background-color: #66b2f0;\n    border-color: #dcdfe4;\n}\n\n.ace-cloud_editor_dark .ace_keyword {\n    color: #c674dc;\n}\n\n.ace-cloud_editor_dark .ace_constant {\n    color: #e5c383;\n}\n\n.ace-cloud_editor_dark .ace_constant.ace_numeric {\n    color: #e5c383;\n}\n\n.ace-cloud_editor_dark .ace_constant.ace_character.ace_escape {\n    color: #71ccc7;\n}\n\n.ace-cloud_editor_dark .ace_support.ace_function {\n    color: #e96a71;\n}\n\n.ace-cloud_editor_dark .ace_support.ace_class {\n    color: #e5c383;\n}\n\n.ace-cloud_editor_dark .ace_storage {\n    color: #c674dc;\n}\n\n.ace-cloud_editor_dark .ace_invalid.ace_illegal {\n    color: #dcdfe4;\n    background-color:#66b2f0;\n}\n\n.ace-cloud_editor_dark .ace_invalid.ace_deprecated {\n    color: #dcdfe4;\n    background-color: #e5c383;\n}\n\n.ace-cloud_editor_dark .ace_string {\n    color: #6fb342;\n}\n\n.ace-cloud_editor_dark .ace_string.ace_regexp {\n    color: #6fb342;\n}\n\n.ace-cloud_editor_dark .ace_comment,\n.ace-cloud_editor_dark .ace_ghost_text {\n    color: #b5bac0;\n    opacity: 1;\n}\n\n.ace-cloud_editor_dark .ace_variable {\n    color:#66b2f0;\n}\n\n.ace-cloud_editor_dark .ace_meta.ace_selector {\n    color: #c674dc;\n}\n\n.ace-cloud_editor_dark .ace_entity.ace_other.ace_attribute-name {\n    color: #e5c383;\n}\n\n.ace-cloud_editor_dark .ace_entity.ace_name.ace_function {\n    color: #e96a71;\n}\n\n.ace-cloud_editor_dark .ace_entity.ace_name.ace_tag {\n    color:#66b2f0;\n}\n.ace-cloud_editor_dark .ace_heading {\n    color: #e96a71;\n}\n\n.ace-cloud_editor_dark .ace_xml-pe {\n    color: #e5c383;\n}\n.ace-cloud_editor_dark .ace_doctype {\n    color:#66b2f0;\n}\n\n.ace-cloud_editor_dark .ace_entity.ace_name.ace_tag,\n.ace-cloud_editor_dark .ace_entity.ace_other.ace_attribute-name,\n.ace-cloud_editor_dark .ace_meta.ace_tag,\n.ace-cloud_editor_dark .ace_string.ace_regexp,\n.ace-cloud_editor_dark .ace_variable {\n    color:#66b2f0;\n}\n\n.ace-cloud_editor_dark .ace_tooltip {\n    background-color: #282c34;\n    color: #dcdfe4;\n}\n\n.ace-cloud_editor_dark .ace_icon_svg.ace_error,\n.ace-cloud_editor_dark .ace_icon_svg.ace_error_fold {\n    background-color: #ff5d64;\n}\n.ace-cloud_editor_dark .ace_icon_svg.ace_warning,\n.ace-cloud_editor_dark .ace_icon_svg.ace_warning_fold {\n    background-color: #e0ca57;\n}\n.ace-cloud_editor_dark .ace_icon_svg.ace_info {\n    background-color: #44b9d6;\n}\n.ace-cloud_editor_dark .ace_highlight-marker {\n    background: none;\n    border: #66b2f0 1px solid;\n}\n.ace-cloud_editor_dark .ace_tooltip.ace_hover-tooltip:focus > div {\n    outline: 1px solid #44b9d6;\n}\n.ace-cloud_editor_dark .ace_snippet-marker {\n    background-color: #434650;\n    border: 0;\n}\n\n.ace-cloud_editor_dark.ace_dark.ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {\n    background-color: #272A30;\n    border: #299FBC 1.5px solid;\n}\n.ace-cloud_editor_dark.ace_dark.ace_editor.ace_autocomplete .ace_line-hover {\n    border: 1px solid #d5dbdb;\n    background: #272A30;\n}\n.ace-cloud_editor_dark.ace_dark.ace_editor.ace_autocomplete .ace_completion-meta {\n    color: #95a5a6;\n    opacity: 1;\n}\n.ace-cloud_editor_dark.ace_dark.ace_editor.ace_autocomplete .ace_completion-highlight{\n    color: #2AA0BC;\n}\n.ace-cloud_editor_dark.ace_dark.ace_editor.ace_autocomplete {\n    box-shadow: 0 1px 1px 0 #001c244d, 1px 1px 1px 0 #001c2426, -1px 1px 1px 0 #001c2426;\n    line-height: 1.5;\n    border: 1px solid #2a2e33;\n    background: #050506;\n    color: #ffffff;\n}\n\n";

});

ace.define("ace/theme/cloud_editor_dark",[], function(require, exports, module){exports.isDark = true;
exports.cssClass = "ace-cloud_editor_dark";
exports.cssText = require("./cloud_editor_dark-css");
var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass, false);

});
                (function() {
                    ace.require(["ace/theme/cloud_editor_dark"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            