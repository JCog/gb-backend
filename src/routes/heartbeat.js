import express from 'express';

const heartbeat = express.Router();
const fs = require('fs');

heartbeat.get('/', async (req, res) => {
  try {
    const data = fs.readFileSync('/srv/goombotio/heartbeat.txt', 'utf-8');
    res.set('Content-Type', 'text/html');
    res.send(data);
  }
  catch (err) {
    console.error(err);
  }
});

module.exports = heartbeat;
