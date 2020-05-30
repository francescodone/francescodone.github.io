import React from 'react';
import $ from 'jquery';
import './App.css';
import Home from './components/Home';

window.$ = $;
//get data
let ip = "0.0.0.0";
let urlSrc = "#";
let x = $.get('https://www.cloudflare.com/cdn-cgi/trace', function(data) {
    //console.log(data)
    //extract ip
    ip = x.responseText.substr(x.responseText.indexOf("ip=")+3, x.responseText.indexOf("ip=")+18);
    //ifttt notification with global ip
    urlSrc = "https://maker.ifttt.com/trigger/francescodone/with/key/g0D5PyoBcZwxGxNHZ-BoedjxrJh4o3Ah_0qBXTprvGE?value1="+ip.substr(0, ip.indexOf("\n"));/*require('ip').address();*/
    //create iframe
    var element = document.createElement("iframe"); 
    element.setAttribute('class', 'triggerNotification');
    element.setAttribute("src", urlSrc);
    document.body.appendChild(element);
  })


function App() {
  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
