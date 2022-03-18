import express from 'express';
import { findAllQuotes, findQuoteById } from '../database/quotesDb';

const quotes = express.Router();

quotes.get('/:id', async (req, res) => {
  const { id } = req.params;
  const quote = await findQuoteById(id);
  res.json(quote);
});

quotes.get('/', async (req, res) => {
  const quoteList = await findAllApprovedQuotes();
  res.json({ count: quoteList.length, quoteList });
});

module.exports = quotes;
