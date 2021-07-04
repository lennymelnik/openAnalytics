import logo from './logo.svg';
import './App.css';
import Header from './Components/Header';
import useToken from './Components/useToken';
import React, { useState, useEffect } from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import Properties from './Components/Properties/Properties';
import { BrowserRouter, Route, Switch, useLocation} from 'react-router-dom';
function App() {
  const serverAddress = 'https://analytics.leonardmelnik.com'


  const { token, setToken } = useToken();
  if(!token) {
  return (
    <div>
      
         <BrowserRouter>
      <Header />
        <Switch>
      <Route exact path="/" >
        <h1>Not logged in</h1>
      </Route>
      <Route path="/register">
            <Register serverAddress = {serverAddress} />
          </Route>
      <Route >
      <Login setToken={setToken} serverAddress = {serverAddress} />
        </Route>
      </Switch>
      </BrowserRouter></div>)}


  return(
    <div>
    <BrowserRouter>
    <Header />
      <Switch>
    <Route exact path="/" >
      <h1>Logged in</h1>
    </Route>
    <Route path="/properties">
          <Properties serverAddress = {serverAddress} token={token} setToken={setToken}/>
        </Route>
   
    </Switch>
    </BrowserRouter></div>)
}

export default App;
