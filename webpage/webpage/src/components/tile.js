import React, {useState} from 'react';

const Tile = ({
  tile,
  selected,

}) => {
  const [currSource, setCurrSource] = useState(false);
  return (
    <main>
        <li key={tile.row * 6 + tile.column} className={"item" + (tile.hasTrail? tile.trail.team + "trail": tile.team) + (currSource? " source": "")} onClick={()=>selected(tile.row,tile.column,tile.team, setCurrSource)} />
    </main>
  );
};

export default Tile;