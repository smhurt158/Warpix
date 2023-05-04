import React, {useEffect, useState, useRef} from 'react';

const Tile = ({
  tile,
  OnSelected,

}) => {
  const [directionClasses, setDirectionClasses] = useState([])
  useEffect(()=>{
    setDirectionClasses([])
    if(!tile.hasTrail){
      return
    }

    if(!tile.trail.head){
      let xDiff = tile.trail.next.tile[0] - tile.row
      if(xDiff == -1){
        addDirectionClass("above")
      }
      if(xDiff == 1){
        addDirectionClass("below")
      }
      let yDiff = tile.trail.next.tile[1] - tile.column
      if(yDiff == -1){
        addDirectionClass("left")

      }
      if(yDiff == 1){
        addDirectionClass("right")
      }
    }


    let xDiff = tile.trail.previous[0] - tile.row
    if(xDiff == -1){
      addDirectionClass("above")

    }
    if(xDiff == 1){
      addDirectionClass("below")

    }
    let yDiff = tile.trail.previous[1] - tile.column
    if(yDiff == -1){
      addDirectionClass("left")

    }
    if(yDiff == 1){
      addDirectionClass("right")

    }
  },[tile])

  function addDirectionClass(dClass){
    setDirectionClasses((lastValue)=>{
      lastValue.push("tile--trail--" + dClass)
      return lastValue
    })
  }

  return (
    <li className={"tile " + (tile.hasTrail ? "tile--trail tile--team" + tile.trail.team + "-trail": "tile--team" + tile.team) + (tile.selected? " source ": " ") + directionClasses.join(" ")} onClick={()=>OnSelected(tile)} />
  );
};

export default Tile;