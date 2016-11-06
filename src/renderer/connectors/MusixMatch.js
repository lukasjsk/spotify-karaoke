import axios from 'axios';

export default class MusixMatch {

  constructor() {}

  async search(title, artist) {
    let url = `https://www.musixmatch.com/search/${encodeURIComponent(artist)} ${encodeURIComponent(title)}`;
    const response = await axios.get(url);
    const firstUrl = /"track_share_url":"([^"]+)"/.exec(response.data)[1];
    return this.getSong(firstUrl);
  }

  async getSong(url) {
    const response = await axios.get(url);
    const result = this.parseContent(response.data);
    return result;
  }

  parseContent(body) {
    let str = body.split('"body":"')[1].replace(/\\n/g, "\n");
    let result = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      if (str[i] === '"' && (i === 0 || str[i - 1] !== '\\')) {
        return result.join('');
      } else if (str[i] === '"') {
        result.pop();
      }
      result.push(str[i]);
    }
    return result.join('');
  }
}