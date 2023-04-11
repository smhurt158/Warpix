import React, {useEffect, useState} from 'react';
import Tile from './tile';
const Grid = ({ email
}) => {
  const [selectedTile, setSelectedTile] = useState(null)
  const [tileStates, setTileStates] = useState([])

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
        console.log(data)
      });
  }, []);

  const OnSelected = (tile) => {
    if(selectedTile == null){
      tile.selected = true;
      setSelectedTile(tile);
      return;
    }
    fetch('/move',{
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "row": tile.row,
            "col": tile.column,
            "player":{email},
            "srow":selectedTile.row,
            "scol":selectedTile.column
        })
    })
    .then(response => response.json())
    .then(data => { setTileStates(data) })
    .catch((err) => console.log(err))
    .finally(()=>{
      selectedTile.selected = false;
      setSelectedTile(null);
    })
  };
  
  return (
    <main>
      <h1>Grid</h1>

      {tileStates.map((row) => (
        <ul className="row" key={row[0].row}>
          {row.map((tile) => (
            <Tile key={tile.row * 6 + tile.column} tile={tile} OnSelected={OnSelected} />
          ))}
        </ul>
      ))}

    </main>
  );
};

export default Grid;
