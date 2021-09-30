import express from 'express';

const subs = express.Router();
const fs = require('fs')

subs.get('/', async (req, res) => {
  try {
    const data = fs.readFileSync('/srv/goombotio/sub_points.txt', 'utf-8');
    res.set('Content-Type', 'text/html');
    res.send(data);
  }
  catch (err) {
    console.error(err)
  }
});

module.exports = subs;
