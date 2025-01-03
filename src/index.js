import express from 'express';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import apicache from 'apicache'
import redis from 'redis';

import authRouter from './routes/auth';
import commandsRouter from './routes/commands';
import heartbeatRouter from './routes/heartbeat';
import minecraftRouter from './routes/minecraft-whitelist';
import quotesRouter from './routes/quotes';
import recentCheerRouter from './routes/recent-cheer';
import recentSubRouter from './routes/recent-sub';
import subsRouter from './routes/subs';
import watchtimeRouter from './routes/watchtime';

const app = express();
const port = 3000;
const path = require('path');
const cacheWithRedis = apicache.options({ redisClient: redis.createClient() }).middleware;

const SESSION_SECRET = process.env.GB_SESSION_SECRET;

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/commands', cacheWithRedis('5 seconds'), commandsRouter);
app.use('/gb-heartbeat', cacheWithRedis('5 seconds'), heartbeatRouter);
app.use('/minecraft-whitelist', cacheWithRedis('5 seconds'), minecraftRouter);
app.use('/quotes', cacheWithRedis('5 seconds'), quotesRouter);
app.use('/recent-cheer', cacheWithRedis('5 seconds'), recentCheerRouter);
app.use('/recent-sub', cacheWithRedis('5 seconds'), recentSubRouter);
app.use('/subs', cacheWithRedis('5 seconds'), subsRouter);
app.use('/watchtime', cacheWithRedis('5 seconds'), watchtimeRouter);

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
