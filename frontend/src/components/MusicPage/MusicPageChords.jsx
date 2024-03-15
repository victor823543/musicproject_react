import { useState } from 'react'

const MusicPageChords = (props) => {
    const [selectedChord, setSelectedChord] = useState({'verseIndex': null, 'chordIndex': null})
    const clickedColor = '#ff8000'
    //Verse component
    const VerseComponent = (props) => {
        
        const handleChordClick = (chordName, chordIndex, verseIndex) => {
            console.log(chordName)
            props.handleChordClick(chordName)
            setSelectedChord(
                {'verseIndex': verseIndex, 'chordIndex': chordIndex}
            )
        }   

        //Mapping over verse object to create multiple chord components
        const chordComponents = Object.entries(props.verse).map(([key, chord], index) => 
            {
                
                const border = 'border-l-2 border-teal-600'
                
                return (
                    <li key={key} className={`max-xs:text-lg max-xsPlus:text-2xl text-3xl font-light hover:text-teal-600 w-full ${(index > 0 && border)} text-center py-2`} onClick={() => handleChordClick(chord['name'], index, props.verseIndex)} style={(props.chordPlaying === index + (props.verseIndex * 4)) ? {color: clickedColor, fontWeight: 700, fontSize: '34px'} : {backgroundColor: null}} >
                        {chord['name']}
                    </li>
                )
            }
            
            )
        
        //Returns unordered list of chordcomponents
        return (
            <>
                <ul className={`w-full flex justify-evenly py-2 px-2 bg-teal-700/10 ${props.editMode && 'bg-teal-700/30'}`}>
                    {chordComponents}
                </ul>
            </>
        )
        
    }

    
    const verseComponents = Object.entries(props.song['song']).map(([key, verse], index) => 
                <div key={key} className='w-full'>
                    <VerseComponent verse={verse} handleChordClick={props.handleChordClick} chordPlaying={props.chordPlaying} verseIndex={index} editMode={props.editMode}/>
                </div>
                
            )

    return (
        <div>
            {(props.editMode && props.chordReplacements) && 
                <div className='w-full flex justify-center'>
                    <div className='px-6 py-2 bg-slate-700/40 flex gap-2'>
                        {props.chordReplacements.map((chordObj, index) => {
                            if (chordObj) {
                                return <div key={chordObj['name'][0]} onClick={() => props.changeChord(selectedChord['verseIndex'], selectedChord['chordIndex'], index)} className='z-30 p-2 bg-teal-600/30 hover:bg-teal-400/50 font-montserrat text-lg'>
                                {chordObj['name'][0]}
                                    </div>
                            } else {
                                return <div key={index} className='hidden'></div>
                            }
                        }
                            
                        )}
                    </div>
                </div>
            }
            <div className={`relative w-full h-full flex flex-col gap-2 justify-center items-center mb-10 ${props.editMode && 'z-30 brightness-150'}`}>
                <div onClick={props.handleEditClick} className="absolute top-0 right-0 sm:translate-x-1/3 -translate-y-1/3 cursor-pointer bg-slate-600/30 p-2 rounded-full z-20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 dark:stroke-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>

                </div>
                {verseComponents}
            </div>
        </div>
        
    )
}

export default MusicPageChords