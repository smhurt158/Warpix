import React, {useState} from 'react';

const Tile = ({
  tile,
  OnSelected,

}) => {
  return (
    <li className={"tile " + (tile.hasTrail ? " tile--team" + tile.trail.team + "-trail": "tile--team" + tile.team) + (tile.selected? " source": "")} onClick={()=>OnSelected(tile)} />
  );
};

export default Tile;