interface Environment {
    [name: string]: Type;
}

interface Context {
    next: number; // next type variable to be generated
    env: Environment; // mapping of variables in scope to types
}

// a map of type variable names to types assigned to them
interface Substitution {
    [key: string]: Type;
}

// replace the type variables in a type that are
// present in the given substitution and return the
// type with those variables with their substituted values
// eg. Applying the substitution {"a": Bool, "b": Int}
// to a type (a -> b) will give type (Bool -> Int)
function applySubstitutionToType(subst: Substitution, type: Type): Type {
    switch (type.type) {
    case "Named": return type;
    case "Var":
        if (subst[type.name]) {
            return subst[type.name];
        } else {
            return type;
        }
    case "Function":
        return {
            type: "Function",
            from: applySubstitutionToType(subst, type.from),
            to: applySubstitutionToType(subst, type.to),
        };
    }
}

/**
 * Add a new binding to the context's environment
 */
function addToContext(ctx: Context, name: string, type: Type): Context {
    const newEnv = Object.assign({}, ctx, {
        env: Object.assign({}, ctx.env),
    });
    newEnv.env[name] = type;
    return newEnv;
}

function newTVar(ctx: Context): Type {
    const newVarNum = ctx.next;
    ctx.next++;
    return {
        type: "Var",
        name: `T${newVarNum}`,
    };
}

function unify(t1: Type, t2: Type): Substitution {
    if (t1.type === "Named"
        && t2.type === "Named"
        && t2.name === t1.name) {
        return {};
    } else if (t1.type === "Var") {
        return varBind(t1.name, t2);
    } else if (t2.type === "Var") {
        return varBind(t2.name, t1);
    } else if (t1.type === "Function" && t2.type === "Function") {
        const s1 = unify(t1.from, t2.from);
        const s2 = unify(
            applySubstitutionToType(s1, t1.to),
            applySubstitutionToType(s1, t2.to),
        );
        return composeSubstitution(s1, s2);
    } else {
        throw new Error(`Type mismatch:\n    Expected ${t1}\n    Found ${t2}`);
    }
}

function composeSubstitution(s1: Substitution, s2: Substitution): Substitution {
    const result: Substitution = {};
    for (const k in s2) {
        const type = s2[k];
        result[k] = applySubstitutionToType(s1, type);
    }
    return { ...s1, ...result };
}

function varBind(name: string, t: Type): Substitution {
    if (t.type === "Var" && t.name === name)  {
        return {};
    } else if (contains(t, name)) {
        throw new Error(`Type ${t} contains a reference to itself`);
    } else {
        const subst: Substitution = {};
        subst[name] = t;
        return subst;
    }
}

function contains(t: Type, name: string): boolean {
    switch (t.type) {
    case "Named": return false;
    case "Var": return t.name === name;
    case "Function": return contains(t.from, name) || contains(t.to, name);
    }
}

// apply given substitution to each type in the context's environment
// Doesn't change the input context, but returns a new one
function applySubstitutionToContext(subst: Substitution, ctx: Context): Context {
    const newContext = {
        ...ctx,
        env: {
            ...ctx.env,
        },
    };
    for (const name in newContext.env) {
        const t = newContext.env[name];
        newContext.env[name] = applySubstitutionToType(subst, t);
    }
    return newContext;
}

function infer(ctx: Context, e: Expression): [Type, Substitution] {
    const env = ctx.env;
    switch (e.type) {
        case "Int": return [{ type: "Named", name: "Int" }, {}];
        case "Var":
            if (env[e.name]) {
                return [env[e.name], {}];
            } else {
                throw Error(`Unbound var ${e.name}`);
            }
        case "Function":
            {
                const newType = newTVar(ctx);
                const newCtx = addToContext(ctx, e.parameter, newType);
                const [bodyType, subst] = infer(newCtx, e.body);
                const inferredType: Type = {
                    type: "Function",
                    from: applySubstitutionToType(subst, newType),
                    to: bodyType,
                };
                return [inferredType, subst];
            }
        case "Call":
            {
                const [funcType, s1] = infer(ctx, e.function);
                const [argType, s2] = infer(applySubstitutionToContext(s1, ctx), e.argument);
                const newVar = newTVar(ctx);
                const s3 = composeSubstitution(s1, s2);
                const s4 = unify({
                    type: "Function",
                    from: argType,
                    to: newVar,
                }, funcType);
                const funcType1 = applySubstitutionToType(s4, funcType);
                const s5 = composeSubstitution(s3, s4);
                const s6 = unify(applySubstitutionToType(s5, (funcType1 as TFun).from), argType);
                const resultSubst = composeSubstitution(s5, s6);
                return [applySubstitutionToType(resultSubst, (funcType1 as TFun).to), resultSubst];
            }
        case "If": {
            const [condType, s0] = infer(ctx, e.condition);
            const s1 = unify(condType, {
                type: "Named",
                name: "Bool",
            });
            const ctx1 = applySubstitutionToContext(composeSubstitution(s0, s1), ctx);
            const [initialTrueBranchType, s2] = infer(ctx1, e.true);
            const s3 = composeSubstitution(s1, s2);
            const ctx2 = applySubstitutionToContext(s2, ctx1);
            const [initialFalseBranch, s4] = infer(ctx2, e.false);
            const s5 = composeSubstitution(s3, s4);
            const trueBranchType = applySubstitutionToType(s5, initialTrueBranchType);
            const falseBranchType = applySubstitutionToType(s5, initialFalseBranch);
            const s6 = unify(trueBranchType, falseBranchType);
            const resultSubst = composeSubstitution(s5, s6);
            return [
                applySubstitutionToType(s6, trueBranchType),
                resultSubst,
            ];
        }
    }
}
