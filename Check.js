function infer(environment, e) {
    switch (e.type) {
        case "Int": return { type: "Named", name: "Int" };
        case "Var": if (environment[e.type]) {
            return environment[e.type];
        }
        else {
            throw Error("Variable " + e.name + " is unbound");
        }
        default: throw Error("Unimplemented");
    }
}
