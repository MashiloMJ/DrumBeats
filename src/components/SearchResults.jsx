import Track from "./Track";

function SearchResults({ searchResults, onAdd }) {
  return (
    <div>
      <h2>Results</h2>

      {searchResults.map((track) => (
        <Track key={track.id} track={track} onAdd={onAdd} />
      ))}
    </div>
  );
}

export default SearchResults;