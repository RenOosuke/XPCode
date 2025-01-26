const path = require('path');
const nw = require("nw.gui");

const OS_RELEASE = require('os').release();
const OS_VERSION = parseInt(OS_RELEASE);
const SETTING_VARIABLES = {
    VARIABLES_EXPLORER_X_OFFSET: 'variables.explorer.x_offset'
}

const ACTIVE_ELEMENT_CHANGED = 'active_element_changed';
const RERENDER_OUTLINE = 'rerender_outline';

const EXECUTABLES_PATH = path.resolve('public\\modules\\executables\\');

const KEYS_MAP = {
    "8": "Backspace",
    "9": "Tab",
    "13": "Enter",
    "16": "Shift",
    "17": "Control",
    "19": "Pause/Break",
    "20": "Caps Lock",
    "27": "Escape",
    "32": "Spacebar",
    "33": "Page Up",
    "34": "Page Down",
    "35": "End",
    "36": "Home",
    "37": "ArrowLeft",
    "38": "ArrowUp",
    "39": "ArrowRight",
    "40": "ArrowDown",
    "45": "Insert",
    "46": "Delete",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "65": "a",
    "66": "b",
    "67": "c",
    "68": "d",
    "69": "e",
    "70": "f",
    "71": "g",
    "72": "h",
    "73": "i",
    "74": "j",
    "75": "k",
    "76": "l",
    "77": "m",
    "78": "n",
    "79": "o",
    "80": "p",
    "81": "q",
    "82": "r",
    "83": "s",
    "84": "t",
    "85": "u",
    "86": "v",
    "87": "w",
    "88": "x",
    "89": "y",
    "90": "z",
    "96": "Numpad 0",
    "97": "Numpad 1",
    "98": "Numpad 2",
    "99": "Numpad 3",
    "100": "Numpad 4",
    "101": "Numpad 5",
    "102": "Numpad 6",
    "103": "Numpad 7",
    "104": "Numpad 8",
    "105": "Numpad 9",
    "106": "Multiply",
    "107": "Add",
    "109": "Subtract",
    "110": "Decimal",
    "111": "Divide",
    "112": "F1",
    "113": "F2",
    "114": "F3",
    "115": "F4",
    "116": "F5",
    "117": "F6",
    "118": "F7",
    "119": "F8",
    "120": "F9",
    "122": "F11",
    "123": "F12",
    "124": "F13",
    "125": "F14",
    "126": "F15",
    "144": "Num Lock",
    "145": "ScrLk",
    "186": "; :",
    "187": "= +",
    "188": ",",
    "189": "- _",
    "190": ".",
    "191": "/",
    "192": "` ~",
    "219": "[ {",
    "220": " |",
    "221": "] }",
    "222": "\" '"
}