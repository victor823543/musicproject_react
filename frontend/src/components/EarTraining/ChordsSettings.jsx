import { useState } from 'react'

const ChordsSettings = (props) => {
    const [clickedChords, setClickedChords] = useState({
        0: true,
        1: true, 
        2: true, 
        3: true, 
        4: true,
        5: true, 
        6: true, 
        7: true, 
        8: true, 
        9: true, 
        10: true, 
    })
    const [clickedStyle, setClickedStyle] = useState(0)
    const [clickedScope, setClickedScope] = useState(0)
    const [clickedLength, setClickedLength] = useState('10')
    const [clickedInversion, setClickedInversion] = useState({
        1: false,
        2: false,
    })

   
    const chords = ['Major', 'Minor', 'Diminished', 'Augmented', 'Major seventh', 'Minor seventh', 'Dominant seventh', 'Major sixth', 'Minor sixth', 'Suspended second', 'Suspended fourth']
    const chordStyles = ['Unison', 'Arpeggio']
    const octaveScopes = ['4', '3-5', '2-6']
    const sessionLengths = ['10', '20', '30', '50']
    const inversions = ['First inversion', 'Second inversion']
    const clickedColor = 'bg-sky-400/30 dark:bg-sky-400/40'
    const defaultColor = 'bg-amber-500/20 dark:bg-blue-500/20 hover:bg-sky-400/10 hover:dark:bg-sky-400/30'

    const handleChordClick = (chord) => {
        setClickedChords({
            ...clickedChords,
            [chord]: !clickedChords[chord],
        })
    }

    const handleStyleClick = (index) => {
        setClickedStyle(index)
    }

    const handleScopeClick = (index) => {
        setClickedScope(index)
    }

    const handleLengthClick = (length) => {
        setClickedLength(length)
    }

    const handleInversionClick = (index) => {
        setClickedInversion({
            ...clickedInversion,
            [index]: !clickedInversion[index],
        })
    }

    const handleStartClick = () => {
        const chords_out = Object.keys(clickedChords).filter(key => clickedChords[key])
        const inversions_out = Object.keys(clickedInversion).filter(key => clickedInversion[key])
        const chordNames = Array.from(chords_out, (n, _) => chords[n])

        const params = {
            'chords_included': chords_out,
            'style': clickedStyle,
            'width': clickedScope,
            'length': clickedLength,
            'inversions': inversions_out,
            'chord_names': chordNames,
        }
        
        props.handleStartClick(params)
    }

  return (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-800 bg-opacity-50 z-10 pt-20 pb-4 '>
            <div className='modal-et hideScrollbar'>
                <div className='mb-6 max-xs:mb-3 px-4'>
                    <h1 className='text-center text-5xl max-sm:text-3xl max-xs:text-2xl font-montserrat mb-3'>Custom Settings</h1>
                    <h3 className='text-center text-xl max-sm:text-lg max-xs:text-sm font-montserrat font-light'>Create your own custiomizable session</h3>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2'>
                    <div className='px-10 max-xs:px-4 md:border-r-2 md:border-sky-600 dark:md:border-blue-900'>
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Directions</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {chordStyles.map((style, index) => 
                                <div key={style} onClick={() => handleStyleClick(index)} className={`${(clickedStyle === index) ? clickedColor : defaultColor} modal-btn`}>{style}</div>
                            )}
                        </div>
                    </div>
                    <div className='px-10 max-xs:px-4 max-md:mt-8 max-xs:mt-4'>
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Octave scope</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {octaveScopes.map((scope, index) => 
                                <div key={index} onClick={() => handleScopeClick(index)} className={`${(clickedScope === index) ? clickedColor : defaultColor} modal-btn`}>{scope}</div>
                            )}
                        </div>
                    </div>
                    <div className='px-10 max-xs:px-4 md:border-r-2 md:border-sky-600 dark:md:border-blue-900 mt-8 max-xs:mt-4'>
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Session length</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {sessionLengths.map((length) => 
                                <div key={length} onClick={() => handleLengthClick(length)} className={`${(clickedLength === length) ? clickedColor : defaultColor} modal-btn`} >{length}</div>
                            )}
                        </div>
                    </div>
                    <div className='px-10 max-xs:px-4 mt-8 max-xs:mt-4'>
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Difficulty progression</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {inversions.map((inversion, index) => 
                                <div key={inversion} onClick={() => handleInversionClick(index)} className={`${(clickedInversion === index) ? clickedColor : defaultColor} modal-btn`}>{inversion}</div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col items-center mt-8 max-xs:mt-4 max-w-[1100px] px-10 max-xs:px-4'>
                    <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Include chords</h1>
                    <div className='flex justify-center gap-4 flex-wrap max-xs:grid max-xs:grid-cols-2'>
                        {chords.map((chord, index) => 
                                <div onClick={() => handleChordClick(index)} key={chord} className={`${clickedChords[index] ? clickedColor : defaultColor} modal-btn max-xs:text-nowrap max-xs:overflow-hidden max-xs:text-ellipsis` }>
                                    {chord}
                                </div>
                        )}

                    </div>
                </div>

                <div className='flex justify-center mt-6'>
                    <button onClick={handleStartClick} className='py-2 px-4 font-montserrat dark:text-emerald-100 bg-green-500/30 ring-2 ring-green-600 rounded-md shadow-lg'>Start session</button>
                </div>
                

            </div> 
                
        </div>
  )
}

export default ChordsSettings