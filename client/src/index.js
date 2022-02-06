import React from 'react';
import ReactDOM from 'react-dom';
import { AuthContextProvider } from './components/context/AuthContext';
import App from './App';

ReactDOM.render(
  
  <AuthContextProvider>
  <App />
  </AuthContextProvider>
  ,
  document.getElementById('root')
);
