# Type Checker in TypeScript

_An implementation of a type checker on a simple programming language._

Based on the [series of posts](https://medium.com/@dhruvrajvanshi/type-inference-for-beginners-part-1-3e0a5be98a4b) written by [Dhruv Rajvanshi](https://medium.com/@dhruvrajvanshi).

### The Language

````
EXPRESSION = INT
           | VAR
           | FUNCTION
           | CALL
           | IF
           | '(' EXPRESSION ')'
           
INT = 0 | 1 | ...
VAR = NAME
FUNCTION = '(' NAME ')' => EXPRESSION
CALL = EXPRESSION '(' EXPRESSION ')'
IF = 'if' '(' EXPRESSION ')' EXPRESSION 'else' EXPRESSION

NAME = [a-zA-Z_][a-zA-Z0-9_]*
// a string of letters, numbers and underscore starting with a letter or underscore
````

### Building & Running
Running `tsc` in the root of the repository will build the checker to `build/build.js`.

From there the code can be run with `node` which will execute a simple type check and print the result.
