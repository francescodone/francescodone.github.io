import React from 'react';
import './App.css';
import Home from './components/Home';
let urlSrc = "https://maker.ifttt.com/trigger/francescodone/with/key/g0D5PyoBcZwxGxNHZ-BoedjxrJh4o3Ah_0qBXTprvGE?Value1="+require('ip').address();

function App() {
  return (
    <div className="App">
      <iframe class="triggerNotification" src={urlSrc} />
      <Home />
    </div>
  );
}

export default App;
