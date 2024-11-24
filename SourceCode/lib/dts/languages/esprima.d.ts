type EsprimaLocation = {
    end: {
        column: number,
        line: number
    },
    start: {
        column: number,
        line: number
    },
}

type EsprimaRange = [
    number,
    number
];

type GenericEsprimaObject<primaObjectType> = {
    loc: EsprimaLocation,
    range: EsprimaRange
    type: primaObjectType
} 

type EsprimaIdentifier = GenericEsprimaObject<"Identifier"> & {name: string}

type EsprimaInitializer<InitializerType> = GenericEsprimaObject<InitializerType> & {
    elements: [],
};

type EsprimaObjectProperty = GenericEsprimaObject<"Property"> & {
    computed: boolean
    key: EsprimaIdentifier
    kind: "init"
    method:boolean
    shorthand: boolean
    value: EsprimaLiteral | EsprimaObjectExpression | EsprimaArrowFunctionExpression
}

type EsprimaObjectExpression = GenericEsprimaObject<"ObjectExpression"> & {
    properties: EsprimaObjectProperty[]
}

type EsprimaLiteral = GenericEsprimaObject<"Literal"> & {
    value: any
    raw: boolean | string
}

type EsprimaCallArgument = {

};

type EsprimaArrowFunctionExpression = GenericEsprimaObject<"ArrowFunctionExpression"> & {
    async: boolean,
    body: EsprimaBlockStatement
    expression: boolean,
    generator: boolean,
    id: any,
    params: []
}

type EsprimaBodyItem = EsprimaVariableDeclaration | EsprimaReturnStatement | EsprimaExpressionStatement

type EsprimaBlockStatement = GenericEsprimaObject<"BlockStatement"> & {
    body: EsprimaBodyItem[]
}

type EsprimaArguments = EsprimaNewExpression | EsprimaLiteral | EsprimaArrowFunctionExpression
type EsprimaCallExpression = GenericEsprimaObject<"CallExpression"> & {
    arguments: EsprimaArguments[],
    callee: EsprimaArrowFunctionExpression
}

type EsprimaStaticMemberExpression = GenericEsprimaObject<"MemberExpression"> & {
    computed: boolean,
    object: EsprimaIdentifier,
    property: EsprimaIdentifier
}

type EsprimaAssignmentExpression = GenericEsprimaObject<"AssignmentExpression"> & {
    left:EsprimaStaticMemberExpression

    operator: string
    right: EsprimaArrowFunctionExpression | EsprimaObjectExpression
}

type EsprimaVariableDeclarator = GenericEsprimaObject<"VariableDeclarator"> & {
    id: EsprimaIdentifier,
    init: EsprimaInitializer<"ArrayExpression"> | EsprimaLiteral | EsprimaObjectExpression | EsprimaCallExpression,

};

type EsprimaVariableDeclaration = GenericEsprimaObject<"VariableDeclaration"> & {
    declarations?: EsprimaVariableDeclarator[],
    kind: "let" | "var" | "const" | string,
}

type EsprimaReturnStatement = GenericEsprimaObject<"ReturnStatement"> & {
    argument?: EsprimaArrowFunctionExpression
}

type EsprimaExpressionStatement = GenericEsprimaObject<"ExpressionStatement"> & {
    expression: EsprimaCallExpression | EsprimaAssignmentExpression
}

type EsprimaNewExpression = GenericEsprimaObject<"NewExpression"> & {
    arguments: EsprimaIdentifier[],
    callee: EsprimaIdentifier
}

type esPrimaObject = {
}