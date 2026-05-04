import { useState } from "react";
import { Spotify } from "./spotify";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  const search = (term) => {
    Spotify.search(term).then(setSearchResults);
  };

  const addTrack = (track) => {
    if (playlistTracks.find((t) => t.id === track.id)) return;
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrack = (track) => {
    setPlaylistTracks(
      playlistTracks.filter((t) => t.id !== track.id)
    );
  };

  return (
  <div className="App">
    <h1>DrumBeats 🎵</h1>

    <SearchBar onSearch={search} />

    <div className="lists">
      <div className="panel">
        <SearchResults searchResults={searchResults} onAdd={addTrack} />
      </div>

      <div className="panel">
        <Playlist tracks={playlistTracks} onRemove={removeTrack} />
      </div>
    </div>
  </div>
);
  
}

export default App;