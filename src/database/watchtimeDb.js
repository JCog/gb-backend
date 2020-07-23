import { findOne } from './dbBase';
const collection = 'watchtime';

export const findUserById = async id => {
  return await findOne(collection, { _id: id });
};

export const findUserByName = async name => {
  return await findOne(collection, { name: name });
};
