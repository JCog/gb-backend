import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'goombotio';
const client = new MongoClient(`${uri}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const findOne = async (collection, query) => {
  try {
    await client.connect();
    const colObj = await client.db().collection(collection);
    return await colObj.findOne(query);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

export const find = async collection => {
  try {
    await client.connect();
    const colObj = await client.db().collection(collection);
    return await colObj.find({}).toArray();
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};