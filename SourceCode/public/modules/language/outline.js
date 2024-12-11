const PARSER_CONSTS = {
    VARIABLE: "variable",
    FUNCTION: "function",
    CLASS: "class",
    PROPERTY: "property",
    METHOD: "method",
    NUMBER: "number",
    STRING: "string",
    BOOLEAN: "boolean",
    MODULE: "module"
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
            if (token.type == 37) {
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

                if (previousItemIsClass || previousItemIsDefinition) {
                    indentation = prevToken.column / indentationSpaces;
                    filterExitedLevels(indentation);

                    currentItemContext.items = [];
                    currentItemContext.known = {
                        function: {

                        },
                        variable: {

                        }
                    };

                    if (previousItemIsDefinition) {
                        currentItemContext.type = PARSER_CONSTS.FUNCTION
                    } else {
                        currentItemContext.type = PARSER_CONSTS.CLASS
                    };

                } else {
                    let isPreviousItemNonlocal = prevToken.text == "nonlocal"
                    let isPreviousItemGlobal = prevToken.text == "global";
                    let isPreviousItemFor = prevToken.text == "for";
                    let isNextItemOpeningParentheses = nextToken.text == "(";

                    if (isPreviousItemNonlocal || isPreviousItemGlobal || isPreviousItemFor) {
                        indentation = prevToken.column / indentationSpaces;
                    }

                    if (isPreviousItemNonlocal || isPreviousItemGlobal || isNextItemOpeningParentheses) {
                        shouldAddToTree = false;
                    }

                    filterExitedLevels(indentation);

                    currentItemContext.type = PARSER_CONSTS.VARIABLE
                }

                currentItemContext.indentation = indentation;
                let deepestContext = contextStack[contextStack.length - 1];

                let valueType = currentItemContext.type == PARSER_CONSTS.VARIABLE ? PARSER_CONSTS.VARIABLE : PARSER_CONSTS.FUNCTION;

                if (prevToken.text == 'lambda') {
                    deepestContext.known[valueType][currentItemContext.name] = true;
                };

                let isKnown = deepestContext.known[valueType][currentItemContext.name]

                if (!isKnown && shouldAddToTree) {
                    deepestContext.items.push(currentItemContext);
                    deepestContext.known[valueType][currentItemContext.name] = true;
                }

                if (valueType == PARSER_CONSTS.FUNCTION) {
                    contextStack.push(currentItemContext);
                }
            }
        });

        return mainContext.items;
    };

    const parseJavascript = (parsedData) => {
        /** @type {EsprimaBlockStatement} */
        let mainBody = parsedData.body[0]

        const baseReducer = (items) => {
            return items.reduce((acc, subitem) => [...acc, ...walkChildrenRecursively(subitem)], []);
        };

        /**@type {(item: EsprimaBodyItem | EsprimaObjectProperty | EsprimaArrowFunctionExpression) => {}} */
        const walkChildrenRecursively = (item) => {
            // let subitems = [];
            let itemContexts = [];

            if(item.type == "VariableDeclaration") {
                
                itemContexts = item.declarations.map((declaration) => {
                    let subitems = [];

                    let itemContext = {
                        name: declaration.id.name,
                        line: declaration.loc.start.line,
                        start: declaration.range[0],
                        type: PARSER_CONSTS.VARIABLE
                    }

                    if(declaration.init && declaration.init.type == "ObjectExpression" && declaration.init.properties.length > 0) {
                        subitems = baseReducer(declaration.init.properties)
                    }
                    
                    if(declaration.init && declaration.init.type == "CallExpression") {
                        subitems = walkChildrenRecursively(declaration.init.callee);
                        itemContext.type = PARSER_CONSTS.FUNCTION;
                    }

                    if(subitems.length > 0) {
                        itemContext.items = subitems;
                    }
                    
                    return itemContext
                })
            }

            if(item.type == "ExpressionStatement") {
                let _name;
                let subitems = [];
                let _type;

                let itemContext = {
                    line: item.loc.start.line,
                    start: item.range[0]
                };

                if(item.expression.type == "AssignmentExpression") {
                    let expression = item.expression;
                    let {object: _object, property: _property} = expression.left

                    if(_object.name == "window" || _object.name == "global") {
                        _name = _property.name;
                    } else {
                        _name = `${_object.name}.${_property.name}`;
                    }

                    if(expression.right.type == "ArrowFunctionExpression") {
                        _type = PARSER_CONSTS.FUNCTION;
                        let arrowFunctionChildren = walkChildrenRecursively(expression.right);
                        subitems = (arrowFunctionChildren[0] || {}).children || []
                    };

                    if(expression.right.type == "ObjectExpression") {
                        _type = PARSER_CONSTS.VARIABLE
                        // subitems = walkChildrenRecursively(expression.right);
                        subitems = baseReducer(expression.right.properties);
                    }

                    if(subitems.length > 0 ) {
                        itemContext.items = subitems;
                    }

                    itemContext.name = _name;
                    itemContext.type = _type;
                    itemContexts.push(itemContext)
                }

                if(item.expression.type == "CallExpression") {
                    let callee = item.expression.callee
                    let subitems = [];

                    let _arguments = item.expression.arguments.map((arg) => {
                        let argValue;

                        if(arg.type== "Literal") {
                            argValue = arg.raw;
                        }

                        if(arg.type == "ArrowFunctionExpression" || arg.type == "NewExpression") {
                            let argumentSubitems = walkChildrenRecursively(arg);
                            subitems.push(...argumentSubitems);

                            argValue = `callback`
                        }

                        return argValue 
                    }).join(",")

                    itemContext.name = `${callee.object.name}.${callee.property.name}(${_arguments})`;
                    itemContext.type = PARSER_CONSTS.FUNCTION;

                    if(subitems.length > 0) {
                        itemContext.items = subitems;
                    }
                    
                    itemContexts.push(itemContext);   
                }
            }

            if(item.type == "ArrowFunctionExpression") {
                let _name = (item.id || {}).name || `<function>`;
                let _type = PARSER_CONSTS.FUNCTION;
                let subitems = [];

                let itemContext = {
                    name: _name,
                    type: _type,
                    line: item.loc.start.line,
                    start: item.range[0]
                };

                if(item.body.body && item.body.body.length>0) {
                    subitems = baseReducer(item.body.body);
                };

                if(subitems.length > 0 ) {
                    itemContext.items = subitems;
                }

                itemContexts.push(itemContext);
            }

            if(item.type == "Property") {
                let _name = item.key.name;
                let _type;
                let subitems = [];

                if(item.method) {
                    _type = PARSER_CONSTS.METHOD;
                }

                if(item.value.type == "Literal" || item.value.type == "ObjectExpression" || item.value.type == "MemberExpression" || item.value.type == "ArrayExpression" || item.value.type == "Identifier") {
                    _type = PARSER_CONSTS.PROPERTY;
                }

                if(item.value.type == "ArrowFunctionExpression") {
                    _type = PARSER_CONSTS.METHOD;
                }

                let itemContext = {
                    name: _name,
                    type: _type,
                    line: item.loc.start.line,
                    start: item.range[0]
                };

                if(item.value.type == "ObjectExpression") {
                    subitems = baseReducer(item.value.properties);
                }

                if(subitems.length > 0 ) {
                    itemContext.items = subitems;
                }

                if(!itemContext.type) {
                    console.log(itemContext.type, _type, item);
                };

                if(!itemContext.name && item.key.raw) {
                    itemContext.name = item.key.raw;
                }

                itemContexts.push(itemContext);
            }

            return itemContexts
        }

        const mainContextTokens = [];
        let outlineItems = [];


        if(parsedData.type == "Program") {
            mainContextTokens.push(...mainBody.body);
        }

        outlineItems = mainContextTokens.reduce((acc, item) => {
            let subitems = walkChildrenRecursively(item);

            return [...acc, ...subitems]
        },[])

        return outlineItems;
    }

    const parseJSON = (jsonObj) => {
        let uniqueJSONStart = 0;

        const walkChildrenRecursively = (obj) => {
            let items = [];

            uniqueJSONStart++;

            let keys = Object.keys(obj);
            keys.forEach((key) => {
                uniqueJSONStart++;

                let subItemContext = {
                    start: uniqueJSONStart,
                    name: key
                };

                let subitems = [];

                if(typeof obj[key] == "number") {
                    subItemContext.type = PARSER_CONSTS.NUMBER
                };

                if(typeof obj[key] == "string") {
                    subItemContext.type = PARSER_CONSTS.STRING
                }

                if(typeof obj[key] == "boolean") {
                    subItemContext.type = PARSER_CONSTS.BOOLEAN
                }

                if(subItemContext.type) {
                    subItemContext.value = obj[key];
                }

                if(Object.keys(obj[key]).length > 0 && !subItemContext.type) {
                    subitems = walkChildrenRecursively(obj[key]);
                }

                if(subitems.length > 0) {
                    subItemContext.items = subitems
                }

                if(!subItemContext.type) {
                    subItemContext.type = PARSER_CONSTS.MODULE
                }

                items.push(subItemContext);
            })

            return items
        };

        return  walkChildrenRecursively(jsonObj)
    }

    window.outline = (() => {
        let activeConfigs = {

        };

        let historyOfActiveConfigs = [];

        let getLanguage = (full_path) => {
            let basename = path.basename(full_path);

            let dotSeparations = basename.split('.');
            let lastExtension = dotSeparations[dotSeparations.length - 1];

            if (lastExtension.length == 0) {
                lastExtension = undefined;
            }

            return lastExtension;
        }

        const parseTokens = (language, fileContent) => {
            return new Promise((res, rej) => {
                let asyncParser = parsers[language]();
                asyncParser.then((parser) => {
                    let outlineElements = [];
                    let tokens;

                    try {
                        switch (language) {
                            case 'js':
                                try {
                                    tokens = parser.parseScript(fileContent, {
                                        loc: true,
                                        range: true,
                                    });
                                    
                                    outlineElements = parseJavascript(tokens);
                                } catch(esprimaError) {
                                    console.log(esprimaError);
                                }
                                break;
                            case 'py':
                                tokens = (new parser).getAllTokens(fileContent);
                                outlineElements = parsePython(tokens);
                            break;
                            case 'json':
                                parsedContent = parser(fileContent);

                                outlineElements = parseJSON(parsedContent)
                            break
                        }

                    } catch (err) {
                        console.error(err, outlineElements);
                    }

                    res(outlineElements);
                }).catch(err => {
                    console.error(err);
                })
            })
        }

        let getOutline = (full_path) => {
            TODO('Add option to compare versions of files (use hash) before rerendering!');
            TODO('Convert outline tokenizer to async version');

            if (!activeConfigs[full_path]) {
                activeConfigs[full_path] = {

                }

                historyOfActiveConfigs.push(full_path);

                if (historyOfActiveConfigs.length > 10) {
                    let oldestConfig = historyOfActiveConfigs.shift();
                    delete activeConfigs[oldestConfig];
                }
            }

            let language = getLanguage(full_path);

            let _outline = new Promise((res, rej) => {
                res([]);
            });

            if (parsers[language]) {
                let fileContent = fs.readFileSync(full_path, 'utf-8');
                _outline = parseTokens(language, fileContent);
            }

            return _outline;
        }

        const _hoveredItem = (() => {
            let initialHoverItem = undefined;

            return {
                get: () => initialHoverItem,
                set: (newValue) => {
                    initialHoverItem = newValue
                }
            }
        })();

        const _selectedItem = (() => {
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
            expansion: {},
            expanded: {

            }
        }
    })()
}