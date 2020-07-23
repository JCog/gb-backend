import { findOne, insertOne, updateOne } from './dbBase';
const collection = 'authentication';

export const insertUser = async user => await insertOne(collection, user);

export const updateUser = async user =>
  updateOne(
    collection,
    { _id: user.id },
    {
      display_name: user.display_name,
      pfp: user.pfp,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    },
  );

export const findUserById = async id => await findOne(collection, { _id: id });

export const updateRefreshToken = async (id, refreshToken) =>
  updateOne(collection, { _id: id }, { refreshToken });
