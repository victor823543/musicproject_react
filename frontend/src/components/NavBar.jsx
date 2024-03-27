import { useState } from 'react'
import { Link } from 'react-router-dom'
import ToggleTheme from './ToggleTheme'
import HamburgerIcon from '../assets/icons/burger-menu.svg'
import HamburgerWhiteIcon from '../assets/icons/burger-menu-white.svg'
import CloseButton from '../assets/icons/close-button.svg'
import CloseButtonWhite from '../assets/icons/close-button-white.svg'

const SideBar = ({isOpen, closeSidebar, navObject, isAuthenticated, logout, themeComponent}) => {
    
    return (
        <div className={`fixed inset-y-0 right-0 bg-zinc-100 dark:bg-black w-64 p-4 z-40 ${isOpen ? 'block' : 'hidden'}`}>
            <ul className=' flex flex-col gap-6'>
                {Object.entries(navObject).map(([name, route], index) =>
                    <li key={index}>
                    <Link to={route} onClick={closeSidebar} className=' text-gray-700 dark:text-gray-200 hover:text-teal-800 dark:hover:text-teal-500 font-sans text-xl'>{name}</Link>
                </li>
                )}
                {isAuthenticated ? 
                    <button onClick={logout} className='bg-slate-200 px-4 py-2 text-sm font-light rounded-lg ring-1 ring-slate-400 '>Log Out</button>
                    :
                    <button className='bg-slate-200 px-4 py-2 text-sm font-light rounded-lg ring-1 ring-slate-400'>Log In</button>
                }
                <div>{themeComponent}</div>
            </ul>
            <div onClick={closeSidebar} className='absolute top-2 right-2'>
                <img src={CloseButton} alt="Close" width={50} height={50} className='dark:hidden' />
                <img src={CloseButtonWhite} alt="Close" width={50} height={50} className='hidden dark:block'/>
            </div>
            
        </div>
    )
}

const NavBar = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(() => {
        const storedDarkMode = localStorage.getItem('darkMode')
        return (storedDarkMode === 'true')
    })

    const toggleDarkMode = () => {
        localStorage.setItem('darkMode', !darkMode)
        if (darkMode) {
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
        setDarkMode(prev => !prev)
    }

    const navItems = {'Home': '/', 'Create music': '/music', 'Ear Training': '/eartraining', 'Account': '/account'}

    return (
        <header className='fixed w-full py-5 px-4 z-40 bg-zinc-100 dark:bg-black/40 '>
            <nav className='flex justify-between items-center'>
                <a href="/" className=' font-montserrat font-bold text-xl dark:text-teal-200'>LearnMusic</a>
                <ul className='flex justify-center items-center gap-12 max-lg:hidden'>
                    {Object.entries(navItems).map(([name, route], index) => 
                            <li key={index}>
                                <Link to={route} className=' text-gray-700 dark:text-gray-200 hover:text-teal-800 dark:hover:text-teal-500 font-montserrat font-light text-lg'>{name}</Link>
                            </li>
                        )}
                </ul>
                <div className='flex gap-2 items-center max-lg:hidden'>
                    <div><ToggleTheme mode={darkMode} toggle={toggleDarkMode}/></div>
                    {props.isAuthenticated ? 
                        <button onClick={props.logout} className='bg-slate-200 px-4 py-2 text-sm font-light rounded-lg ring-1 ring-slate-400 max-lg:hidden'>Log Out</button>
                        :
                        <button className='bg-slate-200 px-4 py-2 text-sm font-light rounded-lg ring-1 ring-slate-400 max-lg:hidden'>Log In</button>
                    }
                </div>
                
                
                <div onClick={() => setSidebarOpen(true)} className='lg:hidden'>
                    <img src={HamburgerIcon} alt="Icon" width={30} height={30} className='dark:hidden'/>
                    <img src={HamburgerWhiteIcon} alt="Icon" width={30} height={30} className='hidden dark:block'/>
                </div>

            </nav>
            <SideBar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} navObject={navItems} isAuthenticated={props.isAuthenticated} logout={props.logout} themeComponent={<ToggleTheme mode={darkMode} toggle={toggleDarkMode}/>} />
        </header>
    )
}

export default NavBar