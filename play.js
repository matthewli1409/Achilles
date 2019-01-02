var DataFrame = require('pandas-js').DataFrame;
var Series = require('pandas-js').Series;
const fs = require('fs');
const Immutable = require('immutable');

const df = new DataFrame([{
    x: 1,
    y: 2
}, {
    x: 2,
    y: 3
}, {
    x: 3,
    y: 4
}])

// Returns:
//    x  |  y
// 0  1  |  2
// 1  2  |  3
// 2  3  |  4

console.log(df.toString());
// console.log(df.toString());
// console.log(df.get('x'));
// console.log(df.get('x').values)

let x = df.get('x').mul(10).values
// console.log(x.toJS());
// // x.forEach(e => { console.log(e)});
console.log(x);
console.log(df.set('x2', x).toString())

df.index = df.get('y').values;
console.log(df.toString());

// df2 = new DataFrame(([x.toJS(), df.get('y').values.toJS(), df.get('y').values.toJS()])).transpose();
// // console.log(df2.transpose().toString());
// console.log(df2.toString());
// console.log(df2)

// console.log(df.toString());

// df3 = new DataFrame([x.toJS()]);
// console.log(df3.values.toJS().toString())
// df3 = df3.transpose()

// df5 = new DataFrame([x.toJS()]);
// console.log(df5.toString())
// console.log(df5)