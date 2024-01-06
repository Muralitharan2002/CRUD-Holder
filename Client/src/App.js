import React, { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, } from 'react-router-dom';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Sidebar from './Components/Dashboard';
import Admin from './Components/Admin';
import Profile from './Components/Profile';
import EmailVerification from './Components/EmailVerification';
import ResetPassword from './Components/ResetPassword';

export const UserAuth = createContext();

function App() {

  const BrowserIsLogin = sessionStorage.getItem("isLogin") === "true"
  const BrowserIsAdmin = sessionStorage.getItem("isAdmin") === "true"
  // console.log(BrowserIsLogin)
  const [isLogin, setIsLogin] = useState(BrowserIsLogin)
  const [isAdmin, setIsAdmin] = useState(BrowserIsAdmin)

  const TrackUserLogin = () => {
    setIsLogin(true);
    sessionStorage.setItem("isLogin", "true");
  }
  const TrackAdminLogin = () => {
    setIsAdmin(true);
    sessionStorage.setItem("isAdmin", "true");
  }
  const TrackUserLogout = () => {
    setIsLogin(false);
    sessionStorage.removeItem("isLogin");
  }
  const TrackAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("isAdmin");
  }


  return (
    <>
      <UserAuth.Provider value={{ isLogin, setIsLogin, isAdmin, setIsAdmin }}>
        <Router>
          <Routes>
            <Route path='/' element={<Sidebar><Login onUserLogin={TrackUserLogin} onAdminLogin={TrackAdminLogin} /></Sidebar>} />
            <Route path='/signup' element={<Sidebar><SignUp /></Sidebar>} />
            <Route path='/profile' element={isLogin ? <Sidebar><Profile onUserLogout={TrackUserLogout} /></Sidebar> : <Navigate to={"/"} />} />
            <Route path='/Admin' element={<Sidebar><Admin onAdminLogout={TrackAdminLogout} /></Sidebar>} />
            <Route path='/EmailVerification/:Role/:_id/:token' element={<EmailVerification />} />
            <Route path='/ResetPassword/:Role/:_id/:token' element={<ResetPassword />} />
          </Routes>
        </Router>
      </UserAuth.Provider>
    </>
  );
}

export default App;
