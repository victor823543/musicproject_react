import '../../App.css'
import image_grand_piano from '../../assets/images/grand-piano-far-away-in-dark-room-upscaled.jpg'
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
        <div className='hideScrollbar h-screen'>
            <div className='flex flex-col justify-center items-center h-full'>
                <div style={{backgroundImage: `url(${image_white_grand})`}} className='fixed bg-cover inset-0 bg-center -z-20'></div>
                <div className=' fixed bg-cover inset-0 -z-10 backdrop-blur-md'></div>
                {
                    showStart &&
                    <div className={`flex flex-col items-center text-black px-6 md:px-12`}>
                    <h1 className='text-center text-6xl max-md:text-5xl max-sm:text-4xl font-montserrat font-light text-shadow-lg shadow-white my-10'>Welcome to Learn Music</h1>
                    {
                        !showLoginPage &&
                         <button className=' bg-slate-600/30 ring-2 ring-slate-900 rounded-lg py-2 px-4 w-44 mb-4 max-xs:mb-2 text-balance font-light max-xs:scale-75' onClick={handleLogOrCreateClick}>Log In or Create Account</button>
                    }
                    <button className=' bg-slate-600/30 ring-2 ring-slate-900 rounded-lg py-2 px-4 w-44 font-light max-xs:scale-75' onClick={handleGuestClick}>Continue as Guest</button>
                    </div>
                }
                

            </div>    
                
                {showLoginPage && 
                    <div  className={`flex flex-col justify-center items-center gap-4 h-full mt-16 text-black`}>
                        {showLogin && props.children[0]}
                        {showSignup && props.children[1]}
                        {showLogin ? (
                            <>
                            <p className=' font-montserrat font-light'>Not yet an account?</p>
                            <button className='bg-zinc-200 ring-2 ring-zinc-500 py-2 px-4 rounded-md text-black text-lg font-montserrat font-light' onClick={handleCreateClick}>Create Account</button>
                            </>
                        ) : (
                            <>
                            <p className=' font-montserrat font-light'>Already have an account?</p>
                            <button className='bg-zinc-200 ring-2 ring-zinc-500 py-2 px-4 rounded-md text-black text-lg font-montserrat font-light' onClick={handleLoginClick}>Log in</button>
                            </>
                        )}
                        
                        <p className=' font-montserrat font-light'>Just want to test out the site?</p>
                        <button className='bg-zinc-200 ring-2 ring-zinc-500 py-2 px-4 rounded-md text-black text-lg font-montserrat font-light' onClick={handleGuestClick}>Continue as Guest</button>
                    </div>
                }
                

                
            
        </div>
        
    )
}

export default HomePageGuest