import image_dark_piano from '../assets/images/dark_grand.jpeg'
import image_white_grand from '../assets/images/white_grand.jpeg'
import LoginModal from './LoginModal'

const LoginPage = (props) => {
  return (
    <div className='flex flex-col justify-center items-center h-full'>
        <div style={{backgroundImage: `url(${image_white_grand})`}} className='dark:hidden fixed bg-cover inset-0 bg-center -z-20'></div>
        <div style={{backgroundImage: `url(${image_dark_piano})`}} className='dark:block hidden fixed bg-cover inset-0 bg-center -z-20'></div>
        <LoginModal handleAuthentication={props.handleAuthentication} navigate='/'/>
    </div>
  )
}

export default LoginPage