import React, {useState} from 'react';
import logo from './logo.svg';
import './App.scss';


import AITEditor from './AITEditor/TextEditor'

function App() {

  return (
    <div className="App">
        <p className="AITEditor__wrapper__label">developing version of AITEditor: 0.03v</p>
        <div className="AITEditor__wrapper">
          <AITEditor />
        </div>
    </div>
  );
}

export default App;
