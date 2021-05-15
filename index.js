const fetch = require('node-fetch');
const fs = require('fs');
const gunzip = require('gunzip-file');
const prompt = require("prompt-sync")({ sigint: true });
const notifier = require('node-notifier');

//to keep it on eastern US, claudio's book covers
const states = ['Alabama'];
//everything except for new hampshire, as it isn't on the LOC website];
// , 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Illinois', 'Indiana', 'Kentucky', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Mississippi', 'New+Jersey', 'New+York', 'North+Carolina', 'Ohio', 'Pennsylvania', 'Rhode+Island', 'South+Carolina', 'Tennessee', 'Vermont','Virginia', 'West+Virginia', 'Wisconsin'
//, 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Illinois', 'Indiana', 'Kentucky', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Mississippi', 'New+Jersey', 'New+York', 'North+Carolina', 'Ohio', 'Pennsylvania', 'Rhode+Island', 'South+Carolina', 'Tennessee', 'Vermont','Virginia', 'West+Virginia', 'Wisconsin'
//everything except for new hampshire, as it isn't on the LOC website

//fetch('http://chroniclingamerica.loc.gov/lccn/sn83045487/1913-04-21/ed-1/seq-20/ocr.txt').then((res) => console.log(res.text())).catch((error) => console.log(error));
//https://www.reddit.com/r/learnprogramming/comments/bxdx32/using_promiseall_with_fetch_returning_pending/
//https://github.com/LibraryOfCongress/data-exploration/blob/master/ChronAm%20API%20Samples.ipynb

//https://www.npmjs.com/package/gunzip-file
function writeFile(data, name){
    //console.log(data);
    var dir = './stateData';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    //makes directory
    //data.items['ocr_eng']
    if (fs.existsSync('./stateData/' + name + '.txt')) {
        //file exists
        for(var e = 0; e < 500; e++){
            var writeMaterials =  '\n' + data.items[e]['lccn'] + '::::: ' + JSON.stringify(data.items[e]['ocr_eng']).replace(/(\r\n|\n|\r)/gm,"");
            console.log(writeMaterials);
            fs.appendFile('./stateData/' + name + '.txt', writeMaterials, function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }
    } else{
        fs.writeFile('./stateData/' + name +'.txt', '', function(err){
            if (err) throw err;
            console.log('Saved!');
        });
        for(var e = 0; e < 500; e++){
            var writeMaterials =  '\n' + data.items[e]['lccn'] + '::::: ' + JSON.stringify(data.items[e]['ocr_eng']).replace(/(\r\n|\n|\r)/gm,"");
            console.log(writeMaterials);
            fs.appendFile('./stateData/' + name + '.txt', writeMaterials, function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }
    }
}
//node index.js --max-old-space-size=51200
function pullData(pT, criteria, beginDate, endDate, item, index){
    if(pT == 'Titles'){
        console.log(' Titles!');
        fetch('http://chroniclingamerica.loc.gov/search/titles/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&terms=' + criteria.toString() +'&format=json' + '&rows=500&dateFilterType=yearRange&sort=date').then((response) => response.json()).then((data) => {
            var totalItems = data.totalItems;
            console.log(data); //
            var totalPages = Math.round(parseInt(totalItems) / 500);
            writeFile(data, 'dataReceived' + item);
            for(var i = 2; i < totalPages + 1; i++){
                fetch('http://chroniclingamerica.loc.gov/search/titles/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&terms=' + criteria.toString() +'&format=json' + '&rows=500&page=' + i.toString() +'&dateFilterType=yearRange&sort=date').then((response2) => response2.json()).then((data2) => {
                    writeFile(data2, 'dataReceived' + item);
                    console.log(data2); //
                }).catch(function(err2){
                    console.log(err2);
                });
            }

        }).catch(function() {
            console.log("error");
            });;
        console.log('Response Received, Check Files');

    } else if(pT == 'Pages'){
        console.log('Pages!');
        fetch('http://chroniclingamerica.loc.gov/search/pages/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&proxtext=' + criteria.toString() +'&format=json' + '&rows=500&dateFilterType=yearRange&sort=date').then((response) => {console.log(response); response.json();}).then((data) => {
            var totalItems = data.totalItems;
            var totalPages = Math.round(parseInt(totalItems) / 500);
            writeFile(data, 'dataReceived' + item);
            for(var i = 2; i < totalPages + 1; i++){
                fetch('http://chroniclingamerica.loc.gov/search/pages/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&proxtext=' + criteria.toString() +'&format=json' + '&rows=500&page=' + i.toString() +'&dateFilterType=yearRange&sort=date').then((response2) => {console.log(response2); response2.json();}).then((data2) => {
                    writeFile(data2, 'dataReceived' + item);
                }).catch(function(err2){
                    console.log(err2);
                });
            }

        }).catch(function(err) {
            console.log(err);
            });;
        console.log('Response Received, Check Files');
    }
}
//pages increased to 1000 to make more efficient,

function chroniclingAmerica(){
    const pT = prompt("Would you like to search Newspaper Titles or Pages? Please type your answer in as the prompt shows: ");
    const criteria = prompt("What would you like to search? One word, please: ");
    const beginDate = prompt('What year would you like you search to begin in (1776-1963)? Please enter it like "1776": ');
    const endDate = prompt('What year would you like you search to end in (1776-1963)? Please enter it like "1776": ');
    console.log('You are searching ' + pT + ' for ' + criteria + ' instances from ' + beginDate + ' to ' + endDate + ':');
    states.forEach(function(item, index) {
        console.log(item, index);
        pullData(pT, criteria, beginDate, endDate, item, index);
    });
}

chroniclingAmerica();
