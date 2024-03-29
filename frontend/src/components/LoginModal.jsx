import React from 'react'
import LogIn from './LogIn'

const LoginModal = (props) => {
  return (
    <div className='fixed inset-0 cover bg-slate-700/40 flex flex-col justify-center items-center dark:text-sky-200/80'>
        <div className='bg-zinc-200 dark:bg-slate-950 p-20 flex flex-col gap-10 items-center rounded-xl shadow-xl'>
            <LogIn handleAuthentication={props.handleAuthentication} navigate={props.navigate}/> 
        </div>
    </div>
  )
}

export default LoginModal