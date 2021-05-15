const fetch = require('node-fetch');
const fs = require('fs');
const gunzip = require('gunzip-file');
const prompt = require("prompt-sync")({ sigint: true });
const notifier = require('node-notifier');
const states = ['Alabama', 'Connecticut'];


async function pullData(pT, criteria, beginDate, endDate, item, index){
    const response = await fetch('http://chroniclingamerica.loc.gov/search/pages/results/?' + '&state=' + item + '&date1=' + beginDate + '&date2=' + endDate + '&proxtext=' + criteria.toString() +'&format=json' + '&rows=1&dateFilterType=yearRange&sort=date');
    //const response = await fetch('http://chroniclingamerica.loc.gov/search/pages/results/?&state=Alabama&date1=1776&date2=1850&proxtext=native&format=json&rows=500&dateFilterType=yearRange&sort=date');
    const responseJSON = await response.json();
    console.log(responseJSON);
    const responseJSONPages = {
            itemsPerPage: responseJSON.itemsPerPage,
            totalItems: responseJSON.totalItems,
            totalPages: Math.round(parseInt(responseJSON.totalItems) / 500),
            requestRows: '500',
            lastPageRows: responseJSON.totalItems % 500
    };
    //if lastPageRows != itemsPerPage, then we need to make it so that the for function realizes this
    console.log(JSON.stringify(responseJSONPages));
    //if 500 items per page, but only 465 items, you know that the last one will be called on 464. That means that you should pass an object to your write function to say to stop right before 465 on page (totalItems/500 round up)
    //console.log(responseJSON.totalItems);

}
pullData('Pages', 'native', '1776', '1850', 'Georgia', 0);
