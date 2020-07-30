import express from 'express';
import { findAllUsers } from '../database/minecraftUsersDb.js';

const whitelist = express.Router();

whitelist.get('/', async (req, res) => {
  const users = await findAllUsers();
  const whitelist = users.map(user => ({ name: user.mc_username, uuid: user.mc_uuid }));
  res.json(whitelist);
});

module.exports = whitelist;
