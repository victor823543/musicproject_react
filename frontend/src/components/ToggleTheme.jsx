import { useState, useEffect } from 'react'

const ToggleTheme = (props) => {
    
  return (   
        <div>
            <button 
                onClick={props.toggle} 
                className={` py-2 px-4 rounded-md ${props.mode ? 'text-black bg-white' : 'text-white bg-black'}`}>
                {props.mode ? 'Light' : 'Dark'}
            </button>   
        </div>
        
  )
}

export default ToggleTheme