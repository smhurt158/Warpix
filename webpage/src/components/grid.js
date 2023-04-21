import React, {useEffect, useState} from 'react';
import useWebSocket from 'react-use-websocket'
import Tile from './tile';
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"

const Grid = ({ email
}) => {
  const [selectedTile, setSelectedTile] = useState(null)
  const [tileStates, setTileStates] = useState([])


  const {sendMessage, lastMessage, readyState} = useWebSocket(window.location.origin.replace(/^http/, 'ws'),{
    onOpen: () =>{
      console.log("websocket conncected")
    }
  })
  useEffect(() => {
    console.log(lastMessage)
    // fetch('/state',{
    //   method: 'get',
    //   dataType: 'json',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     data = data.map(tile =>{
    //       tile.selected = false;
    //       return tile;
    //     })
    //     setTileStates(data)
    //   });
    if(lastMessage.type === "state"){
      const data = lastMessage.data.map(tile =>{
        tile.selected = false;
        return tile;
      })
      setTileStates(data)
    }
  }, [lastMessage]);

  const OnSelected = (tile) => {
    if(selectedTile == null){
      tile.selected = true;
      setSelectedTile(tile);
      return;
    }
    // fetch('/move',{
    //     method: 'POST',
    //     mode: 'cors',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         "row": tile.row,
    //         "col": tile.column,
    //         "player":{email},
    //         "srow":selectedTile.row,
    //         "scol":selectedTile.column
    //     })
    // })
    // .then(response => response.json())
    // .then(data => { setTileStates(data) })
    // .catch((err) => console.log(err))
    // .finally(()=>{
    //   selectedTile.selected = false;
    //   setSelectedTile(null);
    // })
    sendMessage(JSON.stringify({
      type:"move",
      "row": tile.row,
      "col": tile.column,
      "player":{email},
      "srow":selectedTile.row,
      "scol":selectedTile.column
    }))
    selectedTile.selected = false;
    setSelectedTile(null);
  };
  
  const handleReset = async() => {
    await fetch("/reset", {
      method: "POST"
    })
    .then(response => response.json())
    .then(data => { setTileStates(data) })
    .catch((err) => console.log(err))
    .finally(()=>{
      if(!selectedTile) selectedTile.selected = false;
      setSelectedTile(null);
    })
  };
//<TransformWrapper>
//        <TransformComponent>
//</TransformComponent>
      //</TransformWrapper>
  return (
    <main>
      <h1>Grid</h1>
      
          {tileStates.map((row) => (
            <ul className="row" key={row[0].row}>
              {row.map((tile) => (
                <Tile key={tile.row * tileStates[0].length + tile.column} tile={tile} OnSelected={OnSelected} />
              ))}
            </ul>
          ))}
          
      <h2>
        {lastMessage == null? "NULL":lastMessage.data}
      </h2>
      <button onClick={handleReset}>Reset</button>
    </main>
  );
};

export default Grid;
