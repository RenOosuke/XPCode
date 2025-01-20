window.path = require('path');
window.nw = require("nw.gui");

const OS_RELEASE = require('os').release();
const OS_VERSION = parseInt(OS_RELEASE);
const SETTING_VARIABLES = {
    VARIABLES_EXPLORER_X_OFFSET: 'variables.explorer.x_offset'
}

const ACTIVE_ELEMENT_CHANGED = 'active_element_changed';
const RERENDER_OUTLINE = 'rerender_outline';

const EXECUTABLES_PATH = path.resolve('public\\modules\\executables\\');