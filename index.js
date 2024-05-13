const express = require('express');
const puppeteer = require('puppeteer');
const cron = require('node-cron');
const app = express();
const port = 3000;

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

let latestScrapedData = {};

for (let line in stations) {
    latestScrapedData[line] = {};
}

async function scrapeData(url) {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#divStationStatusList', {timeout: 30000});
    const tableHtml = await page.$eval('#divStationStatusList', el => el.innerHTML);
    await browser.close();
    return tableHtml;
}

async function scrapeAllStations() {
    for (let line in stations) {
        for (let url of stations[line]) {
            latestScrapedData[line][url] = await scrapeData(url);
        }
    }
    console.log('All stations updated.');
}

cron.schedule('0 */2 * * * *', async () => {
    await scrapeAllStations();
});

app.use('/tracker', express.static('index.html'));

app.get('/data', (req, res) => {
  if (Object.keys(latestScrapedData).length === 0) {
    res.json({ error: "Data not yet available. Please wait." });
  } else {
    res.json(latestScrapedData);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
scrapeAllStations();