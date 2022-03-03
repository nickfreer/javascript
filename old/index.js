// Comment
console.log('Hello World');

const valThing = 3
let name = 'ndf';
console.log(name);

let person = {
    name: 'Nick',
    age: 55
};

// Objects
// Dot notation
 person.name = 'Fred';

 // Braket notation
let selection = 'name';
 person[selection] = 'Harry';
 console.log(person);

// Arrays
let selectedColours = ['red', 'blue'];
console.log(selectedColours[0]);
selectedColours[2] = 1;
console.log(selectedColours);
console.log(selectedColours.length);

// Functions
//task
function greet(name, lastname) {
    console.log('Hello ' + name + ' ' + lastname);
}

greet('Fred','Blogs');
greet('Mary','Mary');

// calculate a value
function square(number) {
    return number * number;
}

console.log(square(2))

