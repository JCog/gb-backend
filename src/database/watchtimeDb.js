import { findOne } from './dbBase';
const collection = 'watchtime';

export const findUserById = async id => await findOne(collection, { _id: id });

export const findUserByName = async name => await findOne(collection, { name: name });
