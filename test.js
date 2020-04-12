var figlet = require('figlet');
 
// figlet('Hello World!!', function(err, data) {
//     if (err) {
//         console.log('Something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.log(data)
// });

// figlet.fonts(function(err, fonts) {
//     if (err) {
//         console.log('something went wrong...');
//         console.dir(err);
//         return;
//     }
//     console.dir(fonts);
// });

console.log(figlet.textSync('<---Employee\nManager--->', {
    font: 'Standard',
    horizontalLayout: 'fitted',
    verticalLayout: 'default'
}));


