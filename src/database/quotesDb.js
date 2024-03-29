import { findOne, find } from './dbBase';
const collection = 'quotes';

export const findAllQuotes = async () => await find(collection, {});

export const findAllApprovedQuotes = async () => await find(collection, { approved: true });

export const findQuoteById = async id => await findOne(collection, { _id: parseInt(id, 10), approved: true });
