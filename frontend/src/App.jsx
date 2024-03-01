
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import HomePage from './components/HomePage/HomePage';
import HomePageGuest from './components/HomePageGuest/HomePageGuest';
import HomePageAuth from './components/HomePageAuth/HomePageAuth';
import NavBar from './components/NavBar';
import MusicPage from './components/MusicPage/MusicPage';
import './App.css';
import {Route, Routes} from 'react-router-dom';
import { useState, useEffect } from 'react'

function App() {
  const [authToken, setAuthToken] = useState(null)
  const [userName, setUserName] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
useEffect(() => {
  const storedToken = localStorage.getItem('authToken')
  const storedName = localStorage.getItem('username')
  if (storedToken) {
    setIsAuthenticated(true)
    setAuthToken(storedToken)
    setUserName(storedName)
  }
}, [])



  const handleAuthentication = (token, username) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('username', username)
    setIsAuthenticated(true)
    setAuthToken(token)
    setUserName(username)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    setIsAuthenticated(false)
    setAuthToken(null)
    setUserName('')
  }

  return (
    <div> 
      <NavBar username={userName} isAuthenticated={isAuthenticated} logout={handleLogout} />
      <Routes>
        <Route path='/' element={
        <HomePage>
          {
            !isAuthenticated ? (
              <>
                <HomePageGuest>
                  <LogIn handleAuthentication={handleAuthentication} />
                  <SignUp handleAuthentication={handleAuthentication}/>
                </HomePageGuest>
              </>
            ) : (
              <>
                <HomePageAuth username={userName}>
                </HomePageAuth>
              </>
            )
          }
        </HomePage>
        }/>
        <Route path='/music' element={<MusicPage token={authToken} username={userName} isAuthenticated={isAuthenticated} />} />
      </Routes>
          
    </div>
  );
}

export default App;
