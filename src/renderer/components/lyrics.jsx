import React from 'react';

const Header = (props) => (
  <div className="album-header">
    <img src={props.album.images[0].url} />
    <div className="song-info">
      <div className="title">{props.title}</div>
      <div className="artist">{props.artist}</div>
      <div className="album">{props.album.name}</div>
    </div>
  </div>
);


export default class Lyrics extends React.Component {
  constructor() {
    super();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.artist !== nextProps.artist && this.props.title !== nextProps.title;
  }

  render() {
    return (
      <div className="lyrics-container">
        <Header {...this.props}/>
        <div className="lyrics">
          {this.props.lyrics}
        </div>
      </div>
    );
  }
}
