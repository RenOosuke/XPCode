const PARSER_CONSTS = {
    VARIABLE: "variable",
    FUNCTION: "function",
    CLASS: "class"
};

{

/** @type {(tokens: PythonLanguageToken[]) => object} */
const parsePython = (tokens, indentationSpaces = 4) => {
    tokens = tokens.filter(token => !(token.type == 49 && token.type == 50));
    
    let mainContext = {
        items: [],
        known: {
            variable: {},
            function: {},
        },
        indentation: -1,
    };

    let contextStack = [mainContext];

    const filterExitedLevels = (indentation) => {
        while (contextStack.length && contextStack[contextStack.length - 1].indentation >= indentation) {
            contextStack.pop();
        }
    };

    tokens.forEach((token, i) => {
        const prevToken = tokens[i - 1] || {};
        const nextToken = tokens[i + 1] || {};
        //Is Identifier
        if(token.type == 37) {
            // It's a function
            let currentItemContext = {
                line: token.line,
                name: token.text,
                start: token.start
            };

            let indentation = token.column / indentationSpaces;
            let previousItemIsClass = prevToken.text == "class";
            let previousItemIsDefinition = prevToken.text == "def"
            let shouldAddToTree = true;

            if(previousItemIsClass || previousItemIsDefinition) {
                indentation = prevToken.column / indentationSpaces;
                filterExitedLevels(indentation);

                currentItemContext.items = [];
                currentItemContext.known = {
                    function: {

                    },
                    variable: {

                    }
                };

                if(previousItemIsDefinition) {
                    currentItemContext.type = PARSER_CONSTS.FUNCTION
                } else {
                    currentItemContext.type = PARSER_CONSTS.CLASS
                };

            } else {
                let isPreviousItemNonlocal = prevToken.text == "nonlocal"
                let isPreviousItemGlobal = prevToken.text == "global";
                let isPreviousItemFor = prevToken.text == "for";
                let isNextItemOpeningParentheses = nextToken.text == "(";

                if(isPreviousItemNonlocal || isPreviousItemGlobal || isPreviousItemFor) {
                    indentation = prevToken.column / indentationSpaces;
                }

                if(isPreviousItemNonlocal || isPreviousItemGlobal || isNextItemOpeningParentheses) {
                    shouldAddToTree = false;
                }

                filterExitedLevels(indentation);

                currentItemContext.type = PARSER_CONSTS.VARIABLE
            }

            currentItemContext.indentation = indentation;
            let deepestContext = contextStack[contextStack.length-1];

            let valueType = currentItemContext.type == PARSER_CONSTS.VARIABLE ? PARSER_CONSTS.VARIABLE : PARSER_CONSTS.FUNCTION;

            if(prevToken.text == 'lambda') {
                deepestContext.known[valueType][currentItemContext.name] = true;
            };

            let isKnown = deepestContext.known[valueType][currentItemContext.name]
            
            if(!isKnown && shouldAddToTree) {
                deepestContext.items.push(currentItemContext);
                deepestContext.known[valueType][currentItemContext.name] = true;
            }

            if(valueType ==  PARSER_CONSTS.FUNCTION) {
                contextStack.push(currentItemContext);
            }
        }
    });

    return mainContext.items;
};


    window.outline = (() => {
        let activeConfigs = {
    
        };
    
        let historyOfActiveConfigs = [];
    
        let getLanguage = (full_path) => {
            let basename = path.basename(full_path);
            
            let dotSeparations = basename.split('.');
            let lastExtension = dotSeparations[dotSeparations.length-1];
    
            if(lastExtension.length == 0) {
                lastExtension = undefined;
            }
    
            return lastExtension;
        }
    
        const parseTokens = (language, fileContent) => {
            let parser = parsers[language]();

            switch(language) {
                case 'js':
                    break;
                case 'py':
                    let tokens = (new parser).getAllTokens(fileContent);
                    
                    return parsePython(tokens);
            }
        }
    
        let getOutline = (full_path) => {
            TODO('Add option to compare versions of files (use hash) before rerendering!');
            TODO('Convert outline tokenizer to async version');

            if(!activeConfigs[full_path]) {
                activeConfigs[full_path] = {
    
                }
    
                historyOfActiveConfigs.push(full_path);
    
                if(historyOfActiveConfigs.length > 10) {
                    let oldestConfig = historyOfActiveConfigs.shift();
                    delete activeConfigs[oldestConfig];
                }
            }
    
            let language = getLanguage(full_path);
    
            let _outline = undefined;
    
            if(parsers[language]) {
                let fileContent = fs.readFileSync(full_path, 'utf-8');
                _outline = parseTokens(language, fileContent);
            }
    
            return _outline;
        }

        const _hoveredItem = (()=> {
            let initialHoverItem = undefined;

            return {
                get: () => initialHoverItem,
                set: (newValue) => {
                    initialHoverItem = newValue
                }
            }
        })();

        const _selectedItem = (()=> {
            let initialSelectItem = undefined;

            return {
                get: () => initialSelectItem,
                set: (newValue) => {
                    initialSelectItem = newValue
                }
            }
        })();
    
        return {
            getOutline,
            hoveredItem: _hoveredItem,
            grayedOut: true,
            selectedItem: _selectedItem,
            itemEvents: {},
            expansion: {}
        }
    })()
}