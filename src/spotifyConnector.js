import axios from 'axios';

export default class SpotifyConnector {

  constructor() {
    this.port = 4370;
    this.headers = {
      Origin: 'https://open.spotify.com'
    }
  }

  url(path) {
    return `https://127.0.0.1:${this.port}${path}`;
  }

  encodeData(data) {
    return Object.keys(data).map(function (key) {
      return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
  }


  async getOauthToken() {
    try {
      const response = await axios.get('https://open.spotify.com/token');
      const data = response.data;
      return data.t;
    } catch (e) {
      throw new Error('Unable to retrieve OAuth token.');
    }
  }

  async getCsrfToken() {
    try {
      const url = this.url('/simplecsrf/token.json');
      const response = await axios.get(url, {
        headers: this.headers
      });
      const data = response.data;
      return data.token;
    } catch (e) {
      throw new Error('Unable to retrieve CSRF token.');
    }
  }

  async getStatus(oauthToken, csrfToken) {
    try {
      const params = {
        'oauth': oauthToken,
        'csrf': csrfToken,
      };
      const url = this.url('/remote/status.json') + '?' + this.encodeData(params);
      const response = await axios.get(url, {
        headers: this.headers
      });
      const data = response.data;
      return data;
    } catch (e) {
      throw new Error('Unable to retrieve Spotify status.');
    }
  }

  async getCurrentSong(status, oauthToken) {
    if (status.track) {
      try {
        const result = {
          playing: status.playing,
          artist: status.track.artist_resource ? status.track.artist_resource.name : 'Unknown',
          title: status.track.track_resource.name,
          album: {
            name: 'Unknown',
            images: null
          }
        };

        if (status.track.album_resource) {
          result.album.name = status.track.album_resource.name;
          const images = await this.getAlbumImages(status.track.album_resource.uri, oauthToken);
          result.album.images = images;
          return result;
        } else {
          return result;
        }
      } catch (e) {
        throw new Error('Unable to process song information.');
      }
    }
  }

  async getAlbumImages(albumUri, oauthToken) {
    try {
      const id = albumUri.split('spotify:album:')[1];
      const url = `https://api.spotify.com/v1/albums/${id}?oauth=${oauthToken}`;
      const response = await axios.get(url);
      return response.data.images;
    } catch (e) {
      throw new Error('Unable to retrieve album artwork.');
    }
  }
}