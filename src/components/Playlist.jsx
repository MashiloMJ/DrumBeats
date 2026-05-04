import { useState } from "react";
import Track from "./Track";
import { Spotify } from "../spotify";

function Playlist({ tracks, onRemove }) {
  const [playlistName, setPlaylistName] = useState("My Playlist");

  const savePlaylist = () => {
    const uris = tracks.map((track) => track.uri);
    Spotify.savePlaylist(playlistName, uris);
  };

  return (
    <div>
      <input
        value={playlistName}
        onChange={(e) => setPlaylistName(e.target.value)}
      />

      <h2>Your Playlist</h2>

      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onRemove={onRemove}
          isRemoval={true}
        />
      ))}

      <button className="saveButton" onClick={savePlaylist}>
  SAVE TO SPOTIFY
</button>
    </div>
  );
}

export default Playlist;