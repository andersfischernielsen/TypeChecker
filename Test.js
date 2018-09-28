var _a;
// test = 2
var exampleAssignment = {
    type: "Int",
    value: 2
};
var exampleAssignmentEnvironment = (_a = {}, _a["test"] = { name: "test", type: "Var" }, _a);
// (x) => if (x) 2 else f(x)
var exampleFunction = {
    type: "Function",
    parameter: "x",
    body: {
        type: "If",
        condition: {
            type: "Var",
            name: "x"
        },
        "true": {
            type: "Int",
            value: 2
        },
        "false": {
            type: "Call",
            "function": "f",
            argument: {
                type: "Var",
                name: "x"
            }
        }
    }
};
var result = infer(exampleAssignmentEnvironment, exampleAssignment);
// tslint:disable-next-line:no-console
console.log(result);
