import React, {useEffect, useState} from 'react';
import useWebSocket from 'react-use-websocket'
import Tile from './tile';
import Timer from './timer'
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"

const Grid = ({ 
  username
}) => {
  const [selectedTile, setSelectedTile] = useState(null)
  const [tileStates, setTileStates] = useState([])
  const [readyTime, setReadyTime] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    fetch('/state',{
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        data = data.map(tile =>{
          tile.selected = false;
          return tile;
        })
        setTileStates(data)
      })
      .catch(() =>{
        console.log("state error")
      })
    fetch('/time?user='+username,{
      method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log("time data:",data[0])

        setReadyTime(data[0])
      })
      .catch(() =>{
        console.log("time error")
      })
  }, []);


  const {sendMessage, lastMessage, readyState} = useWebSocket(window.location.origin.replace(/^http/, 'ws'),{
    onOpen: () =>{
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
    }
    if(info.type === "time"){
      console.log("ws time update")
      setReadyTime(info.data)
      console.log(info.data)

    }
    if(info.type === "error"){
      setErrorMessage(info.message)
    }
  }, [lastMessage]);

  const OnSelected = (tile) => {
    setErrorMessage("");
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
        {errorMessage}
      </h2>
      <button onClick={handleReset}>Reset</button>
      <Timer key={readyTime} readyTime={readyTime}></Timer>
    </main>
  );
};

export default Grid;
