import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import firebase from "firebase/compat/app";
import "./style.css";

console.log(firebase);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);