import React from 'react';
import './App.css';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <iframe class="triggerNotification" src="https://maker.ifttt.com/trigger/francescodone/with/key/g0D5PyoBcZwxGxNHZ-BoedjxrJh4o3Ah_0qBXTprvGE" />
      <Home />
    </div>
  );
}

export default App;
