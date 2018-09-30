function v(name: string): Expression {
    return {
        type: "Var",
        name: name
    };
}

function i(value: number): Expression {
    return {
        type: "Int",
        value: value
    };
}

function f(param: string, body: Expression | string): Expression {
    return {
        type: "Function",
        parameter: param,
        body: typeof body === "string" ? v(body) : body
    };
}

function c(f: Expression | string, ..._args: (Expression | string)[]): Expression {
    const args = _args.map(a => typeof a === "string" ? v(a) : a);
    return args.reduce(
        (func, arg) => ({
            type: "Call",
            function: typeof func === "string" ? v(func) : func,
            argument: typeof arg === "string" ? v(arg) : arg,
        }),
        typeof f === "string" ? v(f) : f
    );
}

function tn(name: string): Type {
    return {
        type: "Named",
        name,
    };
}
function tv(name: string): Type {
    return {
        type: "Var",
        name,
    };
}
function tfunc(...types: Type[]): Type {
    return types.reduceRight((to, from) => ({
        type: "Function",
        from,
        to,
    }));
}

const initialEnv = {
    "true": tn("Bool"),
    "false": tn("Bool"),
    "!": tfunc(tn("Bool"), tn("Bool")),
    "&&": tfunc(tn("Bool"), tn("Bool"), tn("Bool")),
    "||": tfunc(tn("Bool"), tn("Bool"), tn("Bool")),
    "Int==": tfunc(tv("Int"), tv("Int"), tv("Bool")),
    "Bool==": tfunc(tv("Bool"), tv("Bool"), tv("Bool")),
    "+": tfunc(tn("Int"), tn("Int"), tn("Int"))
};

console.log(
    infer({
        next: 0,
        env: initialEnv
    },
    c("+", i(1), i(2)),
    )[0]);

// console.log(
//     infer({
//         next: 0,
//         env: initialEnv
//     },
//     c("+", "true", "false"),
//     )[0]);