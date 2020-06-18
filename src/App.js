import React from 'react';
import logo from './logo.svg';
import './App.css';
import TextEditor from './components/TextEditor/TextEditor';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TextEditor />
      </header>
    </div>
  );
}

export default App;
