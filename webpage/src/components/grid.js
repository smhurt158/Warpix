import React, {useEffect, useRef, useState} from 'react';
import useWebSocket from 'react-use-websocket'
import Tile from './tile';
import Timer from './timer'
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"
import Popup from './popup';

const Grid = ({ 
  username
}) => {
  const [selectedTile, setSelectedTile] = useState(null)
  const [tileStates, setTileStates] = useState([])
  const [lastMoveTime, setLastMoveTime] = useState(Date.now())
  const [errorMessage, setErrorMessage] = useState("Error: No errors")
  const [gameOver, setGameOver] = useState(false);
  const winner = useRef()
  const {sendMessage, lastMessage, readyState} = useWebSocket(window.location.origin.replace(/^http/, 'ws'),{
  //const {sendMessage, lastMessage, readyState} = useWebSocket("ws://localhost:3001",{
      onOpen: () =>{
      sendMessage(JSON.stringify({
        type:"initialize",
        username:username
      }))
    }
  })
  
  useEffect(() => {
    if(!lastMessage) return
    let info = JSON.parse(lastMessage.data);
    if(info.type === "state"){
      const data = info.data.map(tile =>{
        tile.selected = false;
        return tile;
      })
      setTileStates(data)
      document.documentElement.style.setProperty("--rowNum", data.length);
      document.documentElement.style.setProperty("--colNum", data[0].length);
    }
    if(info.type === "time"){
      setLastMoveTime(info.data)

    }
    if(info.type === "error"){
      setErrorMessage("Error: " + info.message)
    }
    if(info.type === "winner"){
      if(info.data != "0"){
        winner.current = info.data;
        console.log(winner.current)
        setGameOver(true);
      }
      
    }
  }, [lastMessage]);

  const OnSelected = (tile) => {
    setErrorMessage("Error: No errors");
    if(selectedTile == null){
      tile.selected = true;
      setSelectedTile(tile);
      return;
    }

    sendMessage(JSON.stringify({
      type:"move",
      "row": tile.row,
      "col": tile.column,
      "player":{email:username},
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
      if(selectedTile) selectedTile.selected = false;
      setSelectedTile(null);
    })
  };
  return (
    <main>
      <div id="grid">
      <TransformWrapper doubleClick={
        {disabled:true}
      }>
        <TransformComponent>
          <div id="inner-grid">
            {tileStates.map((row) => (
              <ul className="row" key={row[0].row}>
                {row.map((tile) => (
                  <Tile key={tile.row * tileStates[0].length + tile.column} tile={tile} OnSelected={OnSelected} />
                ))}
              </ul>
            ))}
          </div>

          
        </TransformComponent>  
      </TransformWrapper>
      </div>
      <h2>
        {errorMessage}
      </h2>
      <button onClick={handleReset}>Reset</button>
      <Timer key={lastMoveTime} startTime={lastMoveTime} duration={1000*30}></Timer>
      <Popup trigger={gameOver} onClose={() => setGameOver(false)}>
        <h1>GAME OVER!</h1>
        <h1>Team {winner.current == "1" ? "Blue" : "Red"} Wins</h1>
      </Popup>
    </main>
  );
};

export default Grid;
