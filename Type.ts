type Type = TNamed | TVar | TFun;
interface TNamed { type: "Named"; name: string; }
interface TVar { type: "Var"; name: string; }
interface TFun { type: "Function"; from: Type; to: Type; }
