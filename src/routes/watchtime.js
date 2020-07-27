import express from 'express';
import { findUserByName } from '../database/watchtimeDb';

const adminId = process.env.GB_ADMIN_ID;
const watchtime = express.Router();

watchtime.get('/:name', async (req, res) => {
  if (req.user && req.user._id === adminId) {
    const { name } = req.params;
    const watchtime = await findUserByName(name);
    console.log(`user "${req.user.display_name}" retrieved watchtime for "${name}"`);
    res.json(watchtime);
  } else {
    res.json({});
  }
});

module.exports = watchtime;
