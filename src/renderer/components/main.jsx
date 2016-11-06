import React from 'react';
import HomePage from './home';
import Lyrics from './lyrics';
import axios from 'axios';


const Error = (props) => (
  <div className="error-container">
    {props.error.message}
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
        this.setState({
          currentSong: currentSong.data.currentSong,
          showLyrics: true,
          showError: false,
          errorMessage: ''
        });
      } catch (e) {
        this.setState({
          showError: true,
          errorMessage: e
        })
      }
    }, 5000);
  }

  render() {
    let component;

    if (this.state.showError) {
      component = <Error error={this.state.errorMessage}/>
    } else if (this.state.showLyrics) {
      component = <Lyrics currentSong={this.state.currentSong}/>
    } else {
      component = <HomePage />
    }

    return component;
  }
}
