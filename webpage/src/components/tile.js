import React, {useState} from 'react';

const Tile = ({
  tile,
  OnSelected,

}) => {
  return (
    <main>
        <li key={tile.row * 6 + tile.column} className={"item" + (tile.hasTrail? tile.trail.team + "trail": tile.team) + (tile.selected? " source": "")} onClick={()=>OnSelected(tile)} />
    </main>
  );
};

export default Tile;