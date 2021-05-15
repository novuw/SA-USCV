const fetch = require('node-fetch');
const fs = require('fs');
const gunzip = require('gunzip-file');
const prompt = require("prompt-sync")({ sigint: true });
const notifier = require('node-notifier');
const states = ['Wisconsin'];
//pages, native, 1776-1850
//Alabama only states is a test variable, use states with all Eastern States for real run
//const states = ['Alabama', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Illinois', 'Indiana', 'Kentucky', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Mississippi', 'New+Jersey', 'New+York',
// 'North+Carolina', 'Ohio', 'Pennsylvania', 'Rhode+Island', 'South+Carolina', 'Tennessee', 'Vermont','Virginia', 'West+Virginia', 'Wisconsin'];
//FLORIDA = 0 RESULTS FOR NATIVE OR INDIAN, MASSACHUSETTS NO RESULT, INDIAN OR NATIVE, NO RESULTS NEW JERSEY, INDIAN OR NATIVE
//everything except for New Hampshire, as it isn't on the LOC website];
// , 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Illinois', 'Indiana', 'Kentucky', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Mississippi', 'New+Jersey', 'New+York', 'North+Carolina', 'Ohio', 'Pennsylvania', 'Rhode+Island', 'South+Carolina', 'Tennessee', 'Vermont','Virginia', 'West+Virginia', 'Wisconsin'

// TO ESCAPE RATE LIMITER ON SERVER, USE A VPN WHEN YOU ENCOUNTER ERROR MESSAGE SAYING THAT THE CODE DOENS'T KNOW HOW TO HANDLE RESPONSE WITH ''<''
//FOR EACH STATE, GO THROUGH SEQUENCE IN COMMENTED OUT STATE ARRAY AND REPLACE IT WITH NEXT ONE AFTER YOU GET THE DATA

//virginia, new york have most- indian had even more hits
//1776-1790: none for alabama, connecticut, Deleware, florida, georgia, Illinois, indiana, kentucky, maine, maryland, massachusetts, mississippi, new jersey, north carolina, ohio, south carolina, tennessee, vermont, virginia, west virginia, Wisconsin
//1791-1804: alabama, connecticut, florida, georgia, 'Illinois', 'Indiana', 'Kentucky','Maryland', 'Massachusetts', 'Michigan', 'Mississippi', 'New+Jersey','Rhode+Island', 'South+Carolina', 'Tennessee', 'Vermont',West+Virginia
//1805-1818: 'Alabama', 'Connecticut', florida, georgia, illinois,indiana, kentucky,Maryland, Massachusetts, Michigan, Mississippi, New+Jersey, New+York, 'North+Carolina', 'Ohio', 'Pennsylvania', 'Rhode+Island', 'South+Carolina', 'Tennessee', 'Vermont',
//virginia had more data but we couldn'ta ccess
//virginia, west virginia 1819-1832
//issue where it caps out at 500
//some sections are woefully underrepresented, such as georgia from 1833 to 1850, 0 for massachusetts, NJ, New York had 1/22 the data available --> needed to standardize somehow, 300 fro NC, 2500 ohio, 11,000 for virginia
        //taken by date, way more material at the end

//1833.1850
function writeFile(data, name, pageData){
    //makes directory
    var dir = './stateData1833.1850'
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    //data.items['ocr_eng']
    //If file exists, keep writing to it
    if (fs.existsSync('./stateData1833.1850/1833.1850.' + name + '.txt')) {
        console.log('file exists');
        //file exists
        //parseInt(pageData.lastPageRows)
        for(var e = 0; e < 500; e++){
            //var writeMaterials =  '\n' + data.items[e]['lccn'] + ' :.: ' + data.items[e]['date'] + ' :.: ' + JSON.stringify(data.items[e]['ocr_eng']).replace(/(\r\n|\n|\r)/gm,"");
            var ocr = data.items[e]['ocr_eng'].replace(/(\r\n|\n|\r)/gm,"");
            var writeMaterials = {
                'lccn':  data.items[e]['lccn'],
                'date': data.items[e]['date'],
                'ocr': ocr
            };

            //console.log(writeMaterials);
            //console.log(writeMaterials);
            fs.appendFile('./stateData1833.1850/1833.1850.' + name + '.txt', JSON.stringify(writeMaterials), function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }
        //If file does not exist, make it
    } else{
        console.log("file doesn't exist?");
        fs.writeFile('./stateData1833.1850/1833.1850.' + name +'.txt', '', function(err){ //this i think is the problematic line
            if (err) throw err;
            console.log('Saved!');
        });
        //then keep writing to it
        //parseInt(pageData.lastPageRows)
        for(var e = 0; e < 500; e++){
            //var writeMaterials =  '\n' + data.items[e]['lccn'] + '::::: ' + JSON.stringify(data.items[e]['ocr_eng']).replace(/(\r\n|\n|\r)/gm,"");
            var ocr = data.items[e]['ocr_eng'].replace(/(\r\n|\n|\r)/gm,"");
            var writeMaterials = {
                'lccn':  data.items[e]['lccn'],
                'date': data.items[e]['date'],
                'ocr': ocr
            };
            //console.log(writeMaterials);
            //console.log(writeMaterials);
            fs.appendFile('./stateData1833.1850/1833.1850.' + name + '.txt', JSON.stringify(writeMaterials), function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }
    }
//REDO BECAUSE THE MAX NUMBER NEEDS TO BE 500---> LASTPAGEROWS SHOULD ONLY COUNT FOR LAST PAGE...
}

//1791.1804

async function pullData(pT, criteria, beginDate, endDate, item, index){
                if(pT == 'Titles'){
                    console.log(' Titles!');
                            try {
                                //1st call
                                const response = await fetch('http://chroniclingamerica.loc.gov/search/titles/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&terms=' + criteria.toString() +'&format=json' + '&rows=500&dateFilterType=yearRange&sort=date');
                                //const response = await fetch('http://chroniclingamerica.loc.gov/search/pages/results/?&state=Alabama&date1=1776&date2=1850&proxtext=native&format=json&rows=500&dateFilterType=yearRange&sort=date');
                                const responseJSON = await response.json();
                                const responseJSONPages = {
                                        itemsPerPage: responseJSON.itemsPerPage,
                                        totalItems: responseJSON.totalItems,
                                        totalPages: Math.ceil(parseInt(responseJSON.totalItems) / 500),
                                        requestRows: '500',
                                        lastPageRows: responseJSON.totalItems % 500
                                };
                                console.log(responseJSONPages.totalItems + ' ' + responseJSONPages.totalPages);
                                writeFile(responseJSON, 'dataReceived' + item, responseJSONPages);
                                //2nd call
                                try{
                                    for(var i = 2; i < responseJSONPages.totalPages + 1; i++){
                                        console.log('Page ' + i.toString());
                                        const response2 = await fetch('http://chroniclingamerica.loc.gov/search/titles/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&terms=' + criteria.toString() +'&format=json' + '&rows=500&dateFilterType=yearRange&sort=date');
                                        const responseJSON2 = await response.json();
                                        const responseJSONPages2 = {
                                                itemsPerPage: responseJSON.itemsPerPage,
                                                totalItems: responseJSON.totalItems,
                                                totalPages: Math.ceil(parseInt(responseJSON.totalItems) / 500),
                                                requestRows: '500',
                                                lastPageRows: responseJSON.totalItems % 500
                                        };
                                        writeFile(responseJSON2, 'dataReceived' + item, responseJSONPages2);
                                    }
                                } catch (error2){
                                    writeFile('./ERROR2.' + item  + '.txt', error2, (error2) => {
                                            notifier.notify(error2.toString());
                                            });
                                }

                            } catch (error) {
                                writeFile('./ERROR.' + item  + '.txt', error, (error) => {
                                        notifier.notify(error.toString());
                                        });
                                    }

                }else if(pT == 'Pages'){
                            console.log('Pages!');
                            try {
                                //1st call
                                const response = await fetch('http://chroniclingamerica.loc.gov/search/pages/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&proxtext=' + criteria.toString() +'&format=json' + '&rows=500&dateFilterType=yearRange&sort=date');
                                //const response = await fetch('http://chroniclingamerica.loc.gov/search/pages/results/?&state=Alabama&date1=1776&date2=1850&proxtext=native&format=json&rows=500&dateFilterType=yearRange&sort=date');
                                const responseJSON = await response.json();
                                const responseJSONPages = {
                                        itemsPerPage: responseJSON.itemsPerPage,
                                        totalItems: responseJSON.totalItems,
                                        totalPages: Math.round(parseInt(responseJSON.totalItems) / 500),
                                        requestRows: '500',
                                        lastPageRows: responseJSON.totalItems % 500
                                };
                                console.log(responseJSONPages.totalItems + ' ' + responseJSONPages.totalPages);
                                writeFile(responseJSON, 'dataReceived' + item, responseJSONPages);
                                //2nd call
                                try{
                                    for(var i = 2; i < responseJSONPages.totalPages + 1; i++){
                                        const response2 = await fetch('http://chroniclingamerica.loc.gov/search/pages/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&proxtext=' + criteria.toString() +'&format=json' + '&rows=500&page=' + i.toString() +'&dateFilterType=yearRange&sort=date');
                                        const responseJSON2 = await response.json();
                                        const responseJSONPages2 = {
                                                itemsPerPage: responseJSON.itemsPerPage,
                                                totalItems: responseJSON.totalItems,
                                                totalPages: Math.round(parseInt(responseJSON.totalItems) / 500),
                                                requestRows: '500',
                                                lastPageRows: responseJSON.totalItems % 500
                                        };
                                        writeFile(responseJSON2, 'dataReceived' + item, responseJSONPages2);
                                    }
                                } catch (error2){
                                    writeFile('./ERROR2.' + item  + '.txt', error2, (error2) => {
                                            notifier.notify(error2.toString());
                                            });
                                }

                            } catch (error) {
                                writeFile('./ERROR.' + item  + '.txt', error, (error) => {
                                        notifier.notify(error.toString());
                                        });
                                    }
                    }

}


function chroniclingAmerica(){
                //const pT = prompt("Would you like to search Newspaper Titles or Pages? Please type your answer in as the prompt shows: ");
                //const criteria = prompt("What would you like to search? One word, please: ");
                //const beginDate = prompt('What year would you like you search to begin in (1776-1963)? Please enter it like "1776": ');
                //const endDate = prompt('What year would you like you search to end in (1776-1963)? Please enter it like "1776": ');
                //console.log('You are searching ' + pT + ' for ' + criteria + ' instances from ' + beginDate + ' to ' + endDate + ':');
                states.forEach(function(item, index) {
                    console.log(item, index);
                    //pullData(pT, criteria, beginDate, endDate, item, index);
                    pullData("Pages", "native", "1833", "1850", item, index)
                    //setTimeout(()=>{console.log('Waiting for one minute between states to not overload the Chronicling America server.')}, 60000);
                });
}

chroniclingAmerica();
