import { findOne, find } from './dbBase';
const collection = 'quotes';

export const findAllQuotes = async () =>
  await find(collection, {}).then(quotes => {
    return {
      count: quotes.length,
      quotes,
    };
  });

export const findQuoteById = async id => findOne(collection, { _id: id });
