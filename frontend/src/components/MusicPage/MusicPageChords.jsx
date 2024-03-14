
const MusicPageChords = (props) => {

    const clickedColor = '#ff8000'
    //Verse component
    const VerseComponent = (props) => {
        

        //Mapping over verse object to create multiple chord components
        const chordComponents = Object.entries(props.verse).map(([key, chord], index) => 
            {
                
                const border = 'border-l-2 border-teal-600'
                
                return (
                    <li key={key} className={`max-xs:text-lg max-xsPlus:text-2xl text-3xl font-light hover:text-teal-600 w-full ${(index > 0 && border)} text-center py-2`} onClick={() => props.handleChordClick(chord['name'])} style={(props.chordPlaying === index + (props.verseIndex * 4)) ? {color: clickedColor, fontWeight: 700, fontSize: '34px'} : {backgroundColor: null}} >
                        {chord['name']}
                    </li>
                )
            }
            
            )
        
        //Returns unordered list of chordcomponents
        return (
            <>
                <ul className='w-full flex justify-evenly py-2 px-2 bg-teal-700/10'>
                    {chordComponents}
                </ul>
            </>
        )
        
    }

    
    const verseComponents = Object.entries(props.song['song']).map(([key, verse], index) => 
                <div key={key} className='w-full'>
                    <VerseComponent verse={verse} handleChordClick={props.handleChordClick} chordPlaying={props.chordPlaying} verseIndex={index}/>
                </div>
                
            )

    return (
        <div className="relative w-full h-full flex flex-col gap-2 justify-center items-center mb-10">
            <div className="absolute top-0 right-0 sm:translate-x-1/3 -translate-y-1/3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 dark:stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>

            </div>
            {verseComponents}
        </div>
    )
}

export default MusicPageChords