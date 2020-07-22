import axios from 'axios';
import express from 'express';
import passport from 'passport';
import request from 'request';
import session from 'express-session';
import { OAuth2Strategy } from 'passport-oauth';
import Datastore from 'nedb-promises';
import cors from 'cors';

const app = express();
const port = 3000;

const datastore = Datastore.create('db.db');
const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const BASE_URL = process.env.GB_BASE_URL;
const SESSION_SECRET = process.env.GB_SESSION_SECRET;

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

OAuth2Strategy.prototype.userProfile = (accessToken, done) => {
  const options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_CLIENT_ID,
      Accept: 'application/vnd.twitch.tv.v5+json',
      Authorization: 'Bearer ' + accessToken,
    },
  };

  request(options, (error, response, body) => {
    if (response && response.statusCode === 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
};

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const twitchStrategy = new OAuth2Strategy(
  {
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_CLIENT_SECRET,
    callbackURL: BASE_URL + 'auth/twitch/callback',
    state: true,
  },
  (accessToken, refreshToken, profile, done) => {
    const userData = profile.data[0];
    const obj = {
      _id: userData.id,
      display_name: userData.display_name,
      pfp: userData.profile_image_url,
      accessToken,
      refreshToken,
    };
    datastore
      .insert(obj)
      .then(() => done(null, obj))
      .catch(() => done(null, obj));
  },
);

passport.use('twitch', twitchStrategy);

app.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));
app.get(
  '/auth/twitch/callback',
  passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }),
);

app.get('/', async (req, res) => {
  if (req.session && req.session.passport && req.session.passport.user) {
    const user = req.session.passport.user;
    const validated = await validateUser(user);
    res.json({ user, validated });
  } else {
    res.json({});
  }
});

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

const validateUser = async user => {
  const url = 'https://id.twitch.tv/oauth2/validate';
  const response = await axios.get(url, {
    headers: {
      Authorization: 'OAuth ' + user.accessToken,
    },
  });
  return !!response.data.client_id;
};

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
