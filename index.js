// import { Mvvm } from './Mvvm.js'
function sayHi(user) {
    return `Hello, ${user}!`;
}

function Person(){
    this.Person = 'CC'
}
Person.prototype.test = function(){
    console.log(123)
}
export { sayHi, Person }