
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
        <div className="w-full h-full flex flex-col gap-2 justify-center items-center mb-10">
            {verseComponents}
        </div>
    )
}

export default MusicPageChords