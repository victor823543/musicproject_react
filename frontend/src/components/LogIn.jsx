import { useState } from 'react'

const LogIn = (props) => {
    const [inputData, setInputData] = useState({username: '', password: ''})


    const handleSubmit = e => {
        e.preventDefault()
        fetch('http://localhost:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputData),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return response.json()
        })
        .then((data) => {
           console.log(data) 
           setInputData({username: '', password: ''})
           props.handleAuthentication(data['token'], data['user']['username'])
        }) 
        .catch(err => console.log(err))
    }

    const handleUsernameChange = e => {
        setInputData((prev) => {
            let newData = {...prev}
            newData.username = e.target.value 
            return newData
        })
    }
    const handlePasswordChange = e => {
        setInputData((prev) => {
            let newData = {...prev}
            newData.password = e.target.value 
            return newData
        })
    }
    

    return (
        <div className='text-black'>
            <h2 className='text-2xl font-montserrat mb-6 text-center'>LOGIN</h2>
            <form className='flex flex-col gap-4 text-end'>
                <div className='login-div'>
                    <label className=' font-montserrat font-light' htmlFor="logInUsername">Username: </label>
                    <input className='text-black bg-zinc-100/30 px-1' type="text" id='logInUsername' value={inputData['username']} onChange={handleUsernameChange} />
                </div>
                <div className='login-div'>
                    <label className=' font-montserrat font-light' htmlFor="logInPassword">Password: </label>
                    <input className='text-black bg-zinc-100/30 px-1 ' type="password" id='logInPassword' value={inputData['password']} onChange={handlePasswordChange} />
                </div>
                <div className='flex justify-center'>
                    <button className=' bg-slate-200 w-fit py-2 px-4 text-black font-montserrat font-light text-sm rounded-md ring-2 ring-slate-400' type='submit' onClick={handleSubmit}>Log in</button>
                </div>
            </form>
        </div>
    )
}

export default LogIn