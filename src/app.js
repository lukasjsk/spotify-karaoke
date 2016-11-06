import {app, BrowserWindow} from 'electron';
import express from 'express';
import SpotifyConnector from './spotifyConnector';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const api = express();
const spotifyConnector = new SpotifyConnector();

let mainWindow = null;

// cache tokens
let oauthToken = null;
let csrfToken = null;

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 760,
    // titleBarStyle: 'hidden-inset'
  });

  // mainWindow.openDevTools();

  mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
});

api.get('/', async(req, res) => {
  try {
    if (!oauthToken) {
      oauthToken = await spotifyConnector.getOauthToken();
    }
    if (!csrfToken) {
      csrfToken = await spotifyConnector.getCsrfToken();
    }
    const status = await spotifyConnector.getStatus(oauthToken, csrfToken);
    const currentSong = await spotifyConnector.getCurrentSong(status);

    if (!currentSong) {
      throw new Error('Unable to retrieve song information. Is Spotify Running?')
    }

    res.send({
      // oauthToken: oauthToken,
      // csrfToken: csrfToken,
      // status: status
      currentSong: currentSong
    });
  } catch (e) {
    // if error occurs, simply reset tokens - most probably just expired, so we will load new ones on next request
    oauthToken = null;
    csrfToken = null;

    // res.send(404, {error: e});
    console.log(e.message);

    res.status(404).send({error: e.message});
  }
});

api.listen(3091, () => {
  console.log('SpotifyConector API available on port 3091');
});

