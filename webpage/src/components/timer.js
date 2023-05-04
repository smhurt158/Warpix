import React, {useEffect, useState} from 'react';
import useWebSocket from 'react-use-websocket'
import Tile from './tile';
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch"

const Timer = ({ 
  startTime,
  duration
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [ready, setReady] = useState(false);
  useEffect(()=>{
    const interval = setInterval(() =>{
      if(Date.now() > startTime + duration){
        setReady(true)
      }
      else{
        setReady(false)
        let time = startTime + duration - Date.now();
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
      }
    }, 1000)
    return () => clearInterval(interval)
  },[startTime]);
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
