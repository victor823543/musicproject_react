
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import HomePage from './components/HomePage/HomePage';
import HomePageGuest from './components/HomePageGuest/HomePageGuest';
import HomePageAuth from './components/HomePageAuth/HomePageAuth';
import NavBar from './components/NavBar';
import MusicPage from './components/MusicPage/MusicPage';
import EarTraining from './components/EarTraining/EarTraining';
import './App.css';
import {Route, Routes, useNavigate} from 'react-router-dom'
import { useState, useEffect } from 'react'

function App() {
  const navigate = useNavigate()
  const [authToken, setAuthToken] = useState(null)
  const [user, setUser] = useState({'username': localStorage.getItem('username'), 'user_id': localStorage.getItem('user_id')})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [song, setSong] = useState(null)
  
useEffect(() => {
  const storedToken = localStorage.getItem('authToken')
  const storedUsername = localStorage.getItem('username')
  const storedUserId = localStorage.getItem('user_id')
  if (storedToken) {
    setIsAuthenticated(true)
    setAuthToken(storedToken)
    setUser({'username': storedUsername, 'user_id': storedUserId})
    
  }
}, [])



  const handleAuthentication = (token, username, user_id) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('username', username)
    localStorage.setItem('user_id', user_id)
    setIsAuthenticated(true)
    setAuthToken(token)
    setUser({'username': username, 'user_id': user_id})
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username')
    localStorage.removeItem('user_id')
    setIsAuthenticated(false)
    setAuthToken(null)
    setUser({'username': '', 'user_id': null})
  }

  const handleSongClick = (song) => {
        setSong(song)
        navigate('/music')
  }

  const cancelSong = () => {
    setSong(null)
  }

  return (
    <div> 
      <NavBar username={user['username']} isAuthenticated={isAuthenticated} logout={handleLogout} />
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
                <HomePageAuth user={user} handleSongClick={handleSongClick} cancelSong={cancelSong}>
                </HomePageAuth>
              </>
            )
          }
        </HomePage>
        }/>
        <Route path='/music' element={<MusicPage token={authToken} user={user} isAuthenticated={isAuthenticated} sentSong={song}/>} />
        <Route path='/eartraining/*' element={
          <EarTraining user={user}/>
        } />
        
      </Routes>
          
    </div>
  );
}

export default App;
