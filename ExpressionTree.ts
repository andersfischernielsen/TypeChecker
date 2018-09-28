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
