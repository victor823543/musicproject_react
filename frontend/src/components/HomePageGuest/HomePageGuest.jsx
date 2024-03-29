import '../../App.css'
import image_dark_piano from '../../assets/images/dark_grand.jpeg'
import image_white_grand from '../../assets/images/white_grand.jpeg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'



const HomePageGuest = (props) => {
    const navigate = useNavigate()
    const [showLoginPage, setShowLoginPage] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [showSignup, setShowSignup] = useState(false)
    const [showStart, setShowStart] = useState(true)

    useEffect(() => {
        props.refreshAuthentication()
    }, [])
    
    useEffect(() => {

            window.scrollTo({
                top: window.scrollY + 1000,
                behavior: 'smooth',
            })
        

    }, [showLoginPage])


    const handleCreateClick = () => {
        setShowLogin(false)
        setShowSignup(true)
    }

    const handleLoginClick = () => {
        setShowSignup(false)
        setShowLogin(true)
    }

    const handleLogOrCreateClick = () => {
        setShowLoginPage(true)
        setShowSignup(true)
        
    }

    const handleGuestClick = () => {
        navigate('/music')
    }

    

    return (
        <div className='hideScrollbar h-screen '>
            <div className='flex flex-col justify-center items-center h-full'>
                <div style={{backgroundImage: `url(${image_white_grand})`}} className='dark:hidden fixed bg-cover inset-0 bg-center -z-20'></div>
                <div style={{backgroundImage: `url(${image_dark_piano})`}} className='dark:block hidden fixed bg-cover inset-0 bg-center -z-20'></div>
                <div className=' fixed bg-cover inset-0 -z-10 backdrop-blur-md'></div>
                {
                    showStart &&
                    <div className={`flex flex-col items-center text-black dark:text-slate-300 px-6 md:px-12`}>
                    <h1 className='text-center text-6xl max-md:text-5xl max-sm:text-4xl font-montserrat font-light text-shadow-lg shadow-white dark:text-shadow dark:shadow-sky-400 my-10'>Welcome to Learn Music</h1>
                    {
                        !showLoginPage &&
                         <button className='btn-h' onClick={handleLogOrCreateClick}>Log In or Create Account</button>
                    }
                    <button className='btn-h' onClick={handleGuestClick}>Continue as Guest</button>
                    </div>
                }
                

            </div>    
                
                {showLoginPage && 
                    <div  className={`flex flex-col justify-center items-center gap-4 h-full mt-16 text-black dark:text-slate-200 text-center`}>
                        <div className='bg-teal-600/10 dark:bg-slate-400/10 px-10 py-16 shadow-2xl rounded-md'>
                            {showLogin && props.children[0]}
                            {showSignup && props.children[1]}
                            {showLogin ? (
                                <>
                                <p className=' font-montserrat font-light'>Not yet an account?</p>
                                <button className='btn-w' onClick={handleCreateClick}>Create Account</button>
                                </>
                            ) : (
                                <>
                                <p className=' font-montserrat font-light'>Already have an account?</p>
                                <button className='btn-w' onClick={handleLoginClick}>Log in</button>
                                </>
                            )}
                            
                            <p className=' font-montserrat font-light'>Just want to test out the site?</p>
                            <button className='btn-w' onClick={handleGuestClick}>Continue as Guest</button>
                        </div>
                        
                    </div>
                }
                

                
            
        </div>
        
    )
}

export default HomePageGuest