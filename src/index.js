import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';

import authRouter from './routes/auth';
import commandsRouter from './routes/commands';
import quotesRouter from './routes/quotes';
import watchtimeRouter from './routes/watchtime';

const app = express();
const port = 3000;

const SESSION_SECRET = process.env.GB_SESSION_SECRET;

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/commands', commandsRouter);
app.use('/quotes', quotesRouter);
app.use('/watchtime', watchtimeRouter);

app.get('/', async (req, res) => {
  res.json(req.user);
});

app.get('/:queryName', async (req, res) => {
  // const { queryName: name } = req.params;
  // const dbObject = await datastore.findOne({ name });
  // if (dbObject) {
  //   res.json(dbObject);
  //   return;
  // }
  //
  // const number = Math.random();
  // let isSandwich = false;
  // if (number > 0.16) {
  //   isSandwich = true;
  // }
  // const newDbObject = await datastore.insert({ name, isSandwich });

  res.json({});
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
