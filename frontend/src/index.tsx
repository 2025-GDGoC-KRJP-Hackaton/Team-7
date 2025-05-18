import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Main from './main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import Layout from './layout';
import ProtectedRoute from './protectedroute';
import Signup from './signup';
import Recommendation from './recommendation';
import Setting from './settings';
import Mylist from './mylist';
import { getAuth, onIdTokenChanged } from "firebase/auth";
import { firebaseApp } from "./firebase";

const auth = getAuth(firebaseApp);
onIdTokenChanged(auth, async (user) => {
  if (user) {
    const newToken = await user.getIdToken();
    localStorage.setItem("token", newToken);
    localStorage.setItem("currentUser", user.email || "");
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  }
});


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/' element={<ProtectedRoute><Layout><Main/></Layout></ProtectedRoute>}/>
        <Route path='/recommendation' element={<Layout><Recommendation/></Layout>}/>
        <Route path='/settings' element={<Layout><Setting/></Layout>}/>
        <Route path='/mylist' element={<Layout><Mylist/></Layout>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
