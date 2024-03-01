import image_grand_piano from '../../assets/images/white_grand.jpeg'
import image_dark_piano from '../../assets/images/dark_grand.jpeg'

const MusicPageForm = (props) => {
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Db', 'Eb', 'Gb', 'Ab', 'Bb']
    return (
        <div className='h-screen w-screen flex max-lg:justify-center max-lg:items-center'>
            <div style={{backgroundImage: `url(${image_grand_piano})`}} className="dark:hidden max-lg:absolute max-lg:bg-cover max-lg:inset-0 -z-10 bg-center bg-auto w-full lg:w-1/2"></div>
            <div style={{backgroundImage: `url(${image_dark_piano})`}} className="dark:block hidden max-lg:absolute max-lg:bg-cover max-lg:inset-0 -z-10 bg-center bg-auto w-full lg:w-1/2"></div>
            <div className='absolute w-full h-full bg-zinc-200 dark:bg-gradient-to-br dark:from-black dark:to-slate-800 inset-0 -z-20'></div>
            <div className='h-full flex flex-col justify-center lg:mx-auto max-lg:bg-zinc-700/40 dark:max-lg:bg-teal-500/10 max-lg:shadow-2xl max-lg:h-fit max-lg:p-6 max-lg:rounded-md'>
                <form className='flex flex-col max-xs:items-center font-montserrat gap-4'>
                <label className='max-sm:text-2xl max-xs:text-xl text-3xl text-center font-extralight text-zinc-50 lg:text-teal-950 text-shadow-lg shadow-teal-800 dark:text-teal-600'>Pick a key</label>
                <select className="bg-slate-800 text-white dark:text-teal-200 font-light text-lg sm:text-2xl lg:text-3xl max-xs:w-fit py-2 px-4 rounded-sm shadow-sm shadow-teal-500 dark:shadow-md dark:shadow-teal-300" onChange={props.onSelectKeyChange}>
                    <option value="">Randomize</option>
                    {keys.map((key, index) => (
                        <option key={index} value={key}>{key}</option>
                    ))}
                </select>
                <label className='teal-label'>Pick a length</label>
                <select className="teal-select" onChange={props.onSelectLengthChange}>
            
                    <option value="1">1 Verse</option>
                    <option value="2">2 Verses</option>
                    <option value="3">3 Verses</option>
                    <option value="4">4 Verses</option>
                </select>
                <label className='teal-label'>Pick quality</label>
                <select className="teal-select" onChange={props.onSelectQualityChange}>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                </select>
                <div className='flex justify-center'>
                    <button type='submit' className=' bg-teal-800/30 dark:bg-teal-300/30 ring-2 rounded-md ring-teal-950 dark:ring-teal-600 dark:text-teal-100 w-fit py-2 px-4' onClick={props.onCreateClick}>Create Song</button>
                </div>
                
            </form>
            </div>
            
        
        </div>
        
    )
}

export default MusicPageForm