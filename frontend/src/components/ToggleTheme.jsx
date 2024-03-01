import { useState } from 'react'

const ToggleTheme = () => {
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

  return (   
        <div>
            <button 
                onClick={toggleDarkMode} 
                className={` py-2 px-4 ${darkMode ? 'text-black bg-white' : 'text-white bg-black'}`}>
                Dark
            </button>   
        </div>
        
  )
}

export default ToggleTheme