import express from 'express';
import { findAllCommands, findCommandById } from '../database/commands.js';

const quotes = express.Router();

quotes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const quote = await findCommandById(id);
  res.json(quote);
});

quotes.get('/', async (req, res) => {
  const commandList = await findAllCommands();
  res.json({ count: commandList.length, commandList });
});

module.exports = quotes;
