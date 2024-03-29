
const ToggleTheme = (props) => {
    
  return (   
        <div>
            <button 
                onClick={props.toggle} 
                className={` py-2 px-4 rounded-md ${props.mode ? 'text-white bg-black' : 'text-black bg-white' }`}>
                {props.mode ? 'Dark' : 'Light'}
            </button>   
        </div>
        
  )
}

export default ToggleTheme