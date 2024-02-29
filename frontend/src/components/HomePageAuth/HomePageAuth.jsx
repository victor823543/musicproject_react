import image_grand_piano from '../../assets/images/grand-piano-far-away-in-dark-room-upscaled.jpg'
import image_white_grand from '../../assets/images/white_grand.jpeg'

const HomePageAuth = (props) => {


    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
            <div style={{backgroundImage: `url(${image_white_grand})`}} className='fixed bg-cover inset-0 bg-center -z-20 '></div>
            <div className=' fixed bg-cover inset-0 -z-10 backdrop-blur-md'></div>
            <h1 className='text-center text-3xl xs:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-light text-shadow-lg shadow-teal-800/60'>Welcome {props.username}</h1>
        </div>
    )
}

export default HomePageAuth