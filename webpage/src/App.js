import React, { useEffect, useState } from "react";
import "./styles.css";
import Grid from "./components/grid";

//import googleOneTap from "google-one-tap";
const options = {
  client_id:process.env.REACT_APP_GOOGLE_CLIENT_ID,
  context:"signin",
  auto_select: false
}
export default function App() {
  const [loginData,setLoginData] = useState(
    localStorage.getItem("loginData")? JSON.parse(localStorage.getItem("loginData")): null
  );

  useEffect(()=>{
    
    
   
      
    
  })

  const handleLogout = () =>{
    localStorage.removeItem("loginData");
    setLoginData(null);
  }

  const handleLogin = async () =>{
    window.google.accounts.id.initialize({
      client_id: options.client_id,
      callback: async (response)=>{
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
        localStorage.setItem("loginData", JSON.stringify(data));
      },
      auto_select: false,
      cancel_on_tap_outside: false,
      context: "signin"
    });
    window.google.accounts.id.prompt();
    
    
  }


  const [grid, setGrid] = useState([[{team:"0"}]]);
  const [inputCells, setCells] = useState(grid.cells);
  const [inputRows, setRows] = useState(grid.rows);
  
  

  

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
          <button onClick={handleLogin}>Log In </button>
        )}
      </div>

    </div>
  );
}
