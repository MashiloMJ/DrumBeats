import { useState } from "react";

function SearchBar({ onSearch }) {
  const [term, setTerm] = useState("");

  return (
    <div className="searchBar">
      <input
        placeholder="Enter a song title"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <button onClick={() => onSearch(term)}>SEARCH</button>
    </div>
  );
}

export default SearchBar;