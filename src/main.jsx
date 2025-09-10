import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import React from "react";

console.log("ENV TEST (main.jsx):", import.meta.env.VITE_API_URL);
createRoot(document.getElementById("root")).render(

    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>

);