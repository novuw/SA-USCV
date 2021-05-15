const fs = require('fs');
const prompt = require("prompt-sync")({ sigint: true });
//This will get rid of any duplicates
/*
fs.readFile('./stateData1776.1790/1776.1790.dataReceivedPennsylvania.txt', function (err, data) {
    var dataSet = data + '';
    var duplicatesRemoved = [...new Set(dataSet.split('}'))].join('}');
    fs.writeFile('./stateData1776.1790/1776.1790.dataReceivedPennsylvaniaNEW.txt', duplicatesRemoved, function (err) {
        if (err) throw err;
        console.log('It\'s saved!');
    });
});
*/
