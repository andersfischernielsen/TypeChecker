// test = 2
const exampleAssignment: Expression = {
    type: "Int",
    value: 2,
};

const exampleAssignmentEnvironment: Environment = {["test"]: { name: "test", type: "Var" }};

// (x) => if (x) 2 else f(x)
const exampleFunction = {
    type: "Function",
    parameter: "x",
    body: {
        type: "If",
        condition: {
            type: "Var",
            name: "x",
        },
        true: {
            type: "Int",
            value: 2,
        },
        false: {
            type: "Call",
            function: "f",
            argument: {
                type: "Var",
                name: "x",
            },
        },
    },
};

const result = infer(exampleAssignmentEnvironment, exampleAssignment);
// tslint:disable-next-line:no-console
console.log(result);
