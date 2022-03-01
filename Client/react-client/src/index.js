import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import NavBar from './components/NavBar/NavBar';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <NavBar userName="Нечаев Илья" items={
      [
        {
          title: "Главная",
          href: "/home"
        },
        {
          title: "Настройки",
          href: "/settings"
        }
      ]
    } />
  </React.StrictMode>,
  document.querySelector('.main')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
