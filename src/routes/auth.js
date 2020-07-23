import { OAuth2Strategy } from 'passport-oauth';
import request from 'request';
import passport from 'passport';
import axios from 'axios';
import express from 'express';
import { insertUser, findUserById, updateUser } from '../database/authenticationDb';

const auth = express.Router();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const BASE_URL = process.env.GB_BASE_URL;

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
    findUserById(userData.id)
      .then(user => {
        if (user === null) {
          insertUser(obj).then(() => {
            console.log(`new twitch user "${userData.display_name}" authenticated`);
            done(null, obj);
          });
        } else {
          updateUser(obj).then(() => {
            console.log(`existing twitch user "${userData.display_name}" authenticated`);
            done(null, obj);
          });
        }
      })
      .catch(() => done(null, obj));
  },
);

passport.use('twitch', twitchStrategy);

//true means user is validated
const validateUser = async user => {
  const url = 'https://id.twitch.tv/oauth2/validate';
  const response = await axios.get(url, {
    headers: {
      Authorization: 'OAuth ' + user.accessToken,
    },
  });
  return !!response.data.client_id;
};

auth.get('/twitch', passport.authenticate('twitch', { scope: 'user_read' }));
auth.get(
  '/twitch/callback',
  passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }),
);
auth.get('/twitch/validate', async (req, res) => {
  if (req.user) {
    validateUser(req.user).then(validated => {
      if (validated) {
        console.log(`${req.user.display_name} successfully validated`);
        res.redirect('back');
      } else {
        console.log(`redirecting ${req.user.display_name} for validation`);
        res.redirect('../twitch');
      }
    });
  } else {
    console.log('no session stored, redirecting for authentication');
    res.redirect('../twitch');
  }
});

module.exports = auth;
