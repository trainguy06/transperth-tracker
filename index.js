// TRANSPERTH TRACKER
// Created by Sunny Haywood (@.trainguy on Discord) under trainguy industries.
// 
// Licensed under MIT License.
// This permits you to make your own private copies, and not reuse my code for monitary purposes. I also request that you personally message me if you intend on using this.

const express = require('express');
const puppeteer = require('puppeteer');
const cron = require('node-cron');

const app = express();
const port = 3000; // Change this if you hate 3000

//const commonOccurence = '0 */5 * * * *'; // Makes a full scrape every 5 minutes. (Resource Friendly)
const commonOccurence = '0 */2 * * * *'; // Makes a full scrape every 2 minutes. (Semi-Resource Friendly)
//const commonOccurence = '0 * * * * *'; // Makes a full scrape every minute. (Not Resource Friendly)

const stations = {
    'JoondalupLine': [
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Butler%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Clarkson%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Currambine%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Joondalup%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Edgewater%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Whitfords%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Greenwood%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Warwick%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Stirling%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Glendalough%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Leederville%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Perth%20Underground%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Joondalup%20Line&station=Elizabeth%20Quay%20Stn'
    ],
    'MandurahLine': [
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Perth%20Underground%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Elizabeth%20Quay%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Canning%20Bridge%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Bull%20Creek%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Murdoch%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Cockburn%20Central%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Aubin%20Grove%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Kwinana%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Wellard%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Rockingham%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Warnbro%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Lakelands%20Stn',
        'https://www.transperth.wa.gov.au/Timetables/Live-Train-Times?line=Mandurah%20Line&station=Mandurah%20Stn'
    ]
};

let scrapeData = {};

for (let l in stations) {
    scrapeData[l] = {};
}

function getNowTime() {
    var now = new Date();
    var year = now.getFullYear();
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    
    return year + month + day + ' - ' + hours + ':' + minutes + ':' + seconds;
}

async function doScrape(u) {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(u, { waitUntil: 'networkidle0' }); // This ensures that the whole page loads before scraping.
    await page.waitForSelector('#divStationStatusList', {timeout: 30000});
    const data = await page.$eval('#divStationStatusList', el => el.innerHTML);
    await browser.close();
    return data;
}

async function scrape() {
    console.log(`[${getNowTime()}] Started a full scrape.`);
    for (let l in stations) {
        for (let u of stations[l]) {
            scrapeData[l][u] = await doScrape(u);
        }
    }
    console.log(`[${getNowTime()}] Completed a full scrape.`);
}

cron.schedule(commonOccurence, async () => {
    await scrape();
}); // Starts a scrape every so often depending on the specified value at the top of file.

app.use('/home', express.static('index.html')); // Endpoint used to open the file in your browser via http://localhost:3000/

app.get('/data', (req, res) => {
  if (Object.keys(scrapeData).length === 0) {
    res.json({ error: "Data not yet available. Please wait." });
  } else {
    res.json(scrapeData);
  }
}); // Endpoint the site uses to GET data from server.

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/home`);
});

scrape(); // Initally get data when server starts.
