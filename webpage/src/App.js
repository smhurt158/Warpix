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
  const [team, setTeam] = useState("loading")

  useEffect(()=>{
    if(loginData){
      const res = fetch("/add-user", {
        method: "POST",
        body: JSON.stringify({
          user:loginData.email
        }),
        headers: {
          "Content-Type": "application/json",
        }
      })
        .then(res => res.json())
        .then(data =>{
          console.log(data.team)
          if(data.team == 1){
            setTeam("Blue");
          }
          else{
            setTeam("Red");
          }
        })
    }  
  },[loginData])

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


  return (
    <div className="app">
      <div>
        {!loginData ? (
          <button onClick={handleLogin}>Log In </button>
        ):(
          <div>
            <h3>
              User: {loginData.email}
            </h3>
            <h3>
              Team: {team}
            </h3>
            <button onClick={handleLogout}>Logout </button>
              <Grid username={loginData.email}/>
          </div>
        )}
      </div>

    </div>
  );
}
