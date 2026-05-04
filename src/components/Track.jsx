function Track({ track, onAdd, onRemove, isRemoval }) {
  return (
    <div className="track">
      <div>
        <h4>{track.name}</h4>
        <p>{track.artist} | {track.album}</p>
      </div>

      <button onClick={() => (isRemoval ? onRemove(track) : onAdd(track))}>
        {isRemoval ? "-" : "+"}
      </button>
    </div>
  );
}

export default Track;