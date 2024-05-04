// quick and dirty json extracter cause I'm lazy

const data = require('./damage.json');
const { writeFileSync } = require('fs');

let to_save = data.map((hero) => `'${hero.key}'`);
to_save = to_save.join(', ');

writeFileSync('./output.txt', to_save);
console.log('File written successfully.');
