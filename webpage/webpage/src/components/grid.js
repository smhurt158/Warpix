import React, {useEffect, useState} from 'react';
import Tile from './tile';
const Grid = ({ email
}) => {
  const [startTile, setStartTile] = useState(null)
  const [tileStates, setTileStates] = useState([])
  const [unselect, setUnselect] = useState({function: ()=> {}})
//   useEffect(()=>{
//     {tileStates.map((row) => (
//         <ul className="row" key={row[0].row}>
//           {row.map((tile) => (
//             <Tile row={tile.row} column={tile.col} team={tile.team} selected={selected} />
//           ))}
//         </ul>
//     ))}
//   })
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
        setTileStates(data)
        console.log(data)
      });
  }, []);
  const selected = (row, column, team, setCurrSource) => {
    const item = {row:row, column:column, team:team};
    if(startTile == null){
        setStartTile(item)
        setCurrSource(true)
        setUnselect({function:()=>setCurrSource(false)})
    }
    else{
        console.log(tileStates)
        let t;
        if(tileStates[startTile.row][startTile.column].hasTrail){
            console.log("has trail")
            t = tileStates[startTile.row][startTile.column].trail.team
        }
        else{
            t = startTile.team
        }
        fetch('/move',{
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "row": item.row,
                "col": item.column,
                "player":{email},
                "srow":startTile.row,
                "scol":startTile.column
            })
        })
        .then(response => response.json())
        .then(data => {
          setTileStates(data)
          console.log(data)
        })
        .catch((err) => {
            console.log(err)
        })
        unselect.function();
        setUnselect({function:()=>{}})
        setStartTile(null);
    }
  };
  
  return (
    <main>
      <h1>Grid</h1>

      {tileStates.map((row) => (
        <ul className="row" key={row[0].row}>
          {row.map((tile) => (
            <Tile tile={tile} selected={selected} />
          ))}
        </ul>
      ))}

    </main>
  );
};

export default Grid;
