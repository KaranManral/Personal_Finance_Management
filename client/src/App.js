import React,{useEffect} from 'react';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from "./Home";
import Add from "./Add";
import Show from "./Show";
import Login from "./Login";
import Register from "./Register";
import Logout from './Logout';

export const checkValidString = (str) => {
  const pattern = /^[a-zA-Z0-9@.# ]+$/;
  return pattern.test(str);
};

function App() {

  useEffect(()=>{
    new Promise((resolve,reject)=>{
      resolve(fetch("/api/session"));
    }).then(async (res)=>{
      if(res.status===200){
        const data = await res.json();
        localStorage.setItem("token",data.token);
      }
      else
        localStorage.setItem("token","");
    });
  },[]);

  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/show-transactions" element={<Show />} />
          <Route path="/add-transaction" element={<Add />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
