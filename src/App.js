import React, { Component } from 'react';
import './App.css';
import Popup from 'react-popup';
import {HomePage} from "./components/HomePage";

class App extends Component {
  render() {
    return (
      <div className="App">
          <Popup/>
         <HomePage/>
      </div>
    );
  }
}

export default App;
