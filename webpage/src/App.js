import React, { useEffect, useState } from "react";
import "./styles.css";
import Grid from "./components/grid";
import googleOneTap from "google-one-tap";
const options = {
  client_id:process.env.REACT_APP_GOOGLE_CLIENT_ID,
  context:"signin"
}
export default function App() {
  const [loginData,setLoginData] = useState(
    localStorage.getItem("loginData")? JSON.parse(localStorage.getItem("loginData")): null
  );

  useEffect(()=>{
    if(!loginData){
      googleOneTap(options, async (response)=>{
        console.log(response)
        const res = await fetch("/google-login", {
          method: "POST",
          body: JSON.stringify({
            token:response.credential,
          }),
          headers: {
            "Content-Type": "application/json",
          }
        })

        const data = await res.json();
        setLoginData(data);
        console.log(data)
        localStorage.setItem("loginData", JSON.stringify(data));
      })
    }
  }, [loginData])

  const handleLogout = () =>{
    localStorage.removeItem("loginData");
    setLoginData(null);
  }


  const [grid, setGrid] = useState([[{team:"0"}]]);
  const [inputCells, setCells] = useState(grid.cells);
  const [inputRows, setRows] = useState(grid.rows);
  
  

  const handleGridSize = () => {
    const res = {
      cells: parseInt(inputCells),
      rows: parseInt(inputRows)
    };
    setGrid({ ...res });
  };

  return (
    <div className="app">
      <div>
        {loginData ? (
          <div>
          <h3>
            You "{loginData.name}" logged in as {loginData.email}
          </h3>
          <button onClick={handleLogout}>Logout </button>
          <Grid email={loginData.email}/>
          </div>
        ):(
          <div>Not logged in</div>
        )}
      </div>

    </div>
  );
}
