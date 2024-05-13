// TRANSPERTH TRACKER
// Created by Sunny Haywood (@.trainguy on Discord) under trainguy industries.
// 
// Licensed under MIT License.
// This permits you to make your own private copies, and not reuse my code for monitary purposes. I also request that you personally message me if you intend on using this.

// npm i axios express node-cron

const express = require('express');
const axios = require('axios');
const http = require('http');
const path = require('path');
const cron = require('node-cron');

const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let xmlData = '';

const fetchTrainData = async () => {
    const url = "https://livetimes.transperth.wa.gov.au/LiveTimes.asmx/GetTimesForLine?line=Mandurah%20Line";
    try {
        const response = await axios.get(url);
        xmlData = response.data;
        console.log('Got Data.');
    } catch (error) {
        console.error('Error fetching train data:', error);
    }
};

fetchTrainData();
cron.schedule('*/15 * * * * *', fetchTrainData);

app.get('/data', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(xmlData);
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
