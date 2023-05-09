import React, { useEffect, useState } from "react";
import "./styles.css";
import Grid from "./components/grid";
import googleImage from "./google-signin.png";

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
      console.log(loginData)
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
            setTeam("blue");
          }
          else{
            setTeam("red");
          }
        })
    }  
  },[loginData])

  const handleLogout = () =>{
    localStorage.removeItem("loginData");
    setLoginData(null);
  }

  const handleLogin = async () =>{
    document.cookie = "g_state"+'=; Max-Age=-99999999;';
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
          <div id="login">
            <h1> Welcome To Warpix</h1>
            <img className="art"></img>
            <h2> Google Signin: </h2>
            <img className="google-signin" src={googleImage} onClick={handleLogin}/>
          </div>
        ):(
          <div>
            <h3>
              User: {loginData.email}
            </h3>
            
            <button onClick={handleLogout}>Logout </button>
            <h3>
              Team: <span className={"team-text team-text--" + team}>{team}</span>
            </h3>
            <Grid username={loginData.email}/>
          </div>
        )}
      </div>

    </div>
  );
}
