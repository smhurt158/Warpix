import React, { useEffect, useState } from "react";
import "./styles.css";
import Grid from "./components/grid";
import googleImage from "./google-signin.png";
import Popup from "./components/popup";
import tutorial1 from "./tutorial-1-edited.png"
import tutorial2 from "./tutorial-2-edited.png"
import tutorial3 from "./tutorial-3-edited.png"
import tutorial4 from "./tutorial-4-edited.png"
import tutorial5 from "./tutorial-5-edited.png"
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
  const [popup, setPopup] = useState(false)

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

  const handlePopup= () =>{

  }

  return (
    <div className="app">
      <div className="header">
        {!loginData ? (
          <div className="login-header">
            <h1> Welcome To Warpix</h1>
          </div>
        ):(
          <div className="loggedin-header">
            <h3 className="user">
              {loginData.email}
            </h3>
            <button className="logout-button" onClick={handleLogout}>Logout </button>
            <h3 className="team-header">
              Team: <span className={"team-text team-text--" + team}>{team}</span>
            </h3> 
          </div>
        )}
        <button className="popup-button" onClick={()=> setPopup(true)}>How To Play</button>
      </div>
      <div className="content">
        {loginData ? (
          <Grid username={loginData.email}/>
        ):(
          <div>
            <img className="art"></img>
            <br></br>
            <img className="google-signin" src={googleImage} onClick={handleLogin}/>
          </div>
        )}
      </div>
      

      <Popup trigger={popup} onClose={() => setPopup(false)}>
        <ul className="popup-list">
          <li>
            <div>Click on a tile or the head of a trail owned by your team to select it</div>
            <img className="tutorial" src={tutorial1}></img>
          </li>
          <li>
            <div>Once selected, click an adjacent square to start or continue a trail respectively</div>
            <img className="tutorial" src={tutorial2}></img>
          </li>
          <li>
            <div>Return a trail to a tile owned by your own team to capture space</div>
            <img className="tutorial" src={tutorial3}></img>

          </li>
        </ul>
        <ul className="popup-list">
          <li>
            <div>Moving onto an trail destroys it</div>
            <img className="tutorial" src={tutorial4}></img>
          </li>
          <li>
            <div>You can destroy enemy AND friendly trails</div>
            <img className="tutorial" src={tutorial5}></img>
          </li>
        </ul>

        
        
      </Popup>

    </div>
  );
}
