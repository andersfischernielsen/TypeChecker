interface Environment {
    [name: string]: Type;
}

function infer(environment: Environment, e: Expression): Type {
    switch (e.type) {
        case "Int": return { type: "Named", name: "Int" };
        case "Var": if (environment[e.type]) {
                return environment[e.type];
            } else {
            throw Error(`Variable ${e.name} is unbound`);
        }
        default: throw Error("Unimplemented");
    }
}
