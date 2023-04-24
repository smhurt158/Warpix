import React, {useEffect, useState} from 'react';
import useWebSocket from 'react-use-websocket'
import Tile from './tile';
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"

const Timer = ({ 
  readyTime
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [ready, setReady] = useState(false);
  useEffect(()=>{
    const interval = setInterval(() =>{
      if(Date.now() > readyTime + 1000 * 60 * .5){
        setReady(true)
      }
      else{
        setReady(false)
        let time = readyTime + 1000*60 *.5 - Date.now();
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
      }
    }, 1000)
    return () => clearInterval(interval)
  },[readyTime]);
  return (
    <main>
      {!ready ? 
        <h2>{minutes}:{seconds.toLocaleString('en-US', {minimumIntegerDigits:2})}</h2>:
        <h2>Ready</h2>
      }
    </main>
  );
};
export default Timer;
