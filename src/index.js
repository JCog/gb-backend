import express from 'express';
import Datastore from 'nedb-promises';
import cors from 'cors';

const app = express();
const port = 3000;
const datastore = Datastore.create('db.db');

app.use(cors());
app.use(express.json());

app.get('/:queryName', async (req, res) => {
  const { queryName: name } = req.params;
  const dbObject = await datastore.findOne({ name });
  if (dbObject) {
    res.json(dbObject);
    return;
  }

  const number = Math.random();
  let isSandwich = false;
  if (number > 0.16) {
    isSandwich = true;
  }
  const newDbObject = await datastore.insert({ name, isSandwich });

  res.json(newDbObject);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
