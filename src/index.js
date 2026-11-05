import React from 'https://esm.sh/react@18.3.1';
import ReactDOM from 'https://esm.sh/react-dom@18.3.1/client';
import App from './App.js'; // Khớp với file App của bạn

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  React.createElement(React.StrictMode, null, 
    React.createElement(App)
  )
);
