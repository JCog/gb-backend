import express from 'express';

const cheer = express.Router();
const fs = require('fs')

cheer.get('/', async (req, res) => {
  try {
    const data = fs.readFileSync('/srv/goombotio/recent_cheer.txt', 'utf-8');
    res.set('Content-Type', 'text/html');
    res.send(data);
  }
  catch (err) {
    console.error(err)
  }
});

module.exports = cheer;
