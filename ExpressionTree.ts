type Expression = EInt | EVar | EFunc | ECall | EIf;
interface EInt {
        type: "Int";
        value: number;
    }
interface EVar {
        type: "Var";
        name: string;
    }
interface EFunc {
        type: "Function";
        parameter: string;
        body: Expression;
    }
interface ECall {
        type: "Call";
        function: Expression;
        argument: Expression;
    }
interface EIf {
        type: "If";
        condition: Expression;
        true: Expression;
        false: Expression;
    }

// (x) => if (x) 2 else f(x)
const example = {
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
