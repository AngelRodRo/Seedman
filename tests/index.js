const fs = require("fs");
const testFiles = fs.readdirSync(__dirname + '/specs');


testFiles.forEach(function (file) {
    require('./specs/' + file);
});