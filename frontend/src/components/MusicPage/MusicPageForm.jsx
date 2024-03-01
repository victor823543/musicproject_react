import image_grand_piano from '../../assets/images/white_grand.jpeg'

const MusicPageForm = (props) => {
    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Db', 'Eb', 'Gb', 'Ab', 'Bb']
    return (
        <div className='h-screen w-screen flex max-lg:justify-center max-lg:items-center'>
            <div style={{backgroundImage: `url(${image_grand_piano})`}} className="max-lg:absolute max-lg:bg-cover max-lg:inset-0 -z-10 bg-center bg-auto w-full lg:w-1/2"></div>
            <div className='absolute w-full h-full bg-zinc-200 inset-0 -z-20'></div>
            <div className='h-full flex flex-col justify-center lg:mx-auto max-lg:bg-zinc-700/40 max-lg:shadow-2xl max-lg:h-fit max-lg:p-6 max-lg:rounded-md'>
                <form className='flex flex-col max-xs:items-center font-montserrat gap-4'>
                <label className='max-sm:text-2xl max-xs:text-xl text-3xl text-center font-extralight text-zinc-50 lg:text-teal-950 text-shadow-lg shadow-teal-800'>Pick a key</label>
                <select className="bg-slate-800 text-white font-light text-lg sm:text-2xl lg:text-3xl max-xs:w-fit py-2 px-4 rounded-sm shadow-sm shadow-teal-500" onChange={props.onSelectKeyChange}>
                    <option value="">Randomize</option>
                    {keys.map((key, index) => (
                        <option key={index} value={key}>{key}</option>
                    ))}
                </select>
                <label className='max-sm:text-2xl max-xs:text-xl text-3xl text-center font-extralight text-zinc-50 lg:text-teal-950 text-shadow-lg shadow-teal-800'>Pick a length</label>
                <select className="bg-slate-800 text-white font-light text-lg sm:text-2xl lg:text-3xl max-xs:w-fit py-2 px-4 rounded-sm shadow-sm shadow-teal-500" onChange={props.onSelectLengthChange}>
            
                    <option value="1">1 Verse</option>
                    <option value="2">2 Verses</option>
                    <option value="3">3 Verses</option>
                    <option value="4">4 Verses</option>
                </select>
                <label className='max-sm:text-2xl max-xs:text-xl text-3xl text-center font-extralight text-zinc-50 lg:text-teal-950 text-shadow-lg shadow-teal-800'>Pick quality</label>
                <select className="bg-slate-800 text-white font-light text-lg sm:text-2xl lg:text-3xl max-xs:w-fit py-2 px-4 rounded-sm shadow-sm shadow-teal-500" onChange={props.onSelectQualityChange}>
                    <option value="Major">Major</option>
                    <option value="Minor">Minor</option>
                </select>
                <div className='flex justify-center'>
                    <button type='submit' className=' bg-teal-800/30 ring-2 ring-teal-950 w-fit py-2 px-4' onClick={props.onCreateClick}>Create Song</button>
                </div>
                
            </form>
            </div>
            
        
        </div>
        
    )
}

export default MusicPageForm