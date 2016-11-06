import React from 'react';
import HomePage from './home';
import Lyrics from './lyrics';
import axios from 'axios';
import MusixMatchConnector from '../connectors/MusixMatch';


const Error = (props) => (
  <div className="error-container">
    {props.error}
  </div>
);

export default class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      showLyrics: false
    };
  }

  async componentDidMount() {
    setInterval(async() => {
      try {
        const currentSong = await axios.get('http://localhost:3091/');
        const {title, artist, album} = currentSong.data.currentSong;

        let lyrics = this.state.lyrics;
        if (title !== this.state.title && artist !== this.state.title) {
          const musixMatchConnector = new MusixMatchConnector();
          lyrics = await musixMatchConnector.search(title, artist);
        }

        this.setState({
          title: title,
          artist: artist,
          album: album,
          lyrics: lyrics,
          showLyrics: true,
          showError: false,
          errorMessage: ''
        });
      } catch (e) {
        this.setState({
          showError: true,
          errorMessage: e.response.data.error
        })
      }
    }, 1500);
  }

  render() {
    let component;

    if (this.state.showError) {
      component = <Error error={this.state.errorMessage}/>
    } else if (this.state.showLyrics) {
      component = <Lyrics {...this.state}/>
    } else {
      component = <HomePage />
    }

    return component;
  }
}
