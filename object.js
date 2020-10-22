console.log('OOP');
/*
const circle = {
    radius: 1,
    location: {
        x: 1,
        y: 1
    },
    draw: function() {
        console.log('draw');
    }
};
*/

// Factory function
function createCircle(radius) {
    return {
        radius,
        draw: function() {
            console.log('draw ' + radius)
        }
    }
}

circle = createCircle(1)
circle.draw();

// Constructor function
function Circle(radius) {
    this.radius = radius;
    this.draw = function() {
        console.log('draw' + this.radius);
    }
}

const another = new Circle(2);
another.draw();

Circle.call(another,3);
another.draw();

Circle.call({},4);


another.location = 4 ;
console.log(another);
delete(another.location);
console.log(another);


const keys = Object.keys(another);
console.log(keys);
for (let key in circle) {
    console.log(key);
}



if ('radius' in  circle) console.log('Yeh')

