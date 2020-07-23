import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'goombotio';
const client = new MongoClient(`${uri}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect();

export const findOne = async (collection, query) => {
  try {
    const colObj = await client.db().collection(collection);
    return await colObj.findOne(query);
  } catch (e) {
    console.error(e);
  }
};

export const find = async (collection, query) => {
  try {
    const colObj = await client.db().collection(collection);
    return await colObj.find(query).toArray();
  } catch (e) {
    console.error(e);
  }
};

export const insertOne = async (collection, obj) => {
  try {
    const colObj = await client.db().collection(collection);
    await colObj.insertOne(obj);
  } catch (e) {
    console.error(e);
  }
};

export const updateOne = async (collection, query, newValues) => {
  try {
    const colObj = await client.db().collection(collection);
    await colObj.updateOne(query, { $set: newValues });
  } catch (e) {
    console.error(e);
  }
};
