import { useState } from 'react'

const MelodiesSettings = (props) => {
    const [clickedMelodies, setClickedMelodies] = useState(0)
    const [clickedStart, setClickedStart] = useState(0)
    const [clickedMelodyLength, setClickedMelodyLength] = useState('4')
    const [clickedLength, setClickedLength] = useState('10')
    const [clickedDifficulty, setClickedDifficulty] = useState(0)

   
    const melodies = ['Diatonic notes', 'All notes']
    const melodyStarts = ['Start on tonic', 'Start on random']
    const melodyLengths = ['3', '4', '5', '6', '7', '8']
    const sessionLengths = ['10', '20', '30', '50']
    const difficulties = ['Easy', 'Medium', 'Hard']

    const clickedColor = 'bg-sky-400/30 dark:bg-sky-400/40'
    const defaultColor = 'bg-amber-500/20 dark:bg-blue-500/20 hover:bg-sky-400/10 hover:dark:bg-sky-400/30'

    const handleMelodyClick = (melody) => {
        setClickedMelodies(melody)
    }

    const handleStartOptionClick = (index) => {
        setClickedStart(index)
    }

    const handleMelodyLengthClick = (index) => {
        setClickedMelodyLength(index)
    }

    const handleLengthClick = (length) => {
        setClickedLength(length)
    }

    const handleDifficultyClick = (index) => {
        setClickedDifficulty(index)
    }

    const handleStartClick = () => {

        const params = {
            'melodies_included': clickedMelodies,
            'start': clickedStart,
            'melody_length': clickedMelodyLength,
            'length': clickedLength,
            'difficulty': clickedDifficulty,
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
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Start at</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {melodyStarts.map((start, index) => 
                                <div key={start} onClick={() => handleStartOptionClick(index)} className={`${(clickedStart === index) ? clickedColor : defaultColor} modal-btn`}>{start}</div>
                            )}
                        </div>
                    </div>
                    <div className='px-10 max-xs:px-4 max-md:mt-8 max-xs:mt-4'>
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Melody length</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {melodyLengths.map((length) => 
                                <div key={length} onClick={() => handleMelodyLengthClick(length)} className={`${(clickedMelodyLength === length) ? clickedColor : defaultColor} modal-btn`}>{length}</div>
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
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Difficulty</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {difficulties.map((difficulty, index) => 
                                <div key={index} onClick={() => handleDifficultyClick(index)} className={`${(clickedDifficulty === index) ? clickedColor : defaultColor} modal-btn`}>{difficulty}</div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col items-center mt-8 max-xs:mt-4 max-w-[1100px] px-10 max-xs:px-4'>
                    <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Include notes</h1>
                    <div className='flex justify-center gap-4 flex-wrap max-xs:grid max-xs:grid-cols-2'>
                        {melodies.map((notes, index) => 
                                <div onClick={() => handleMelodyClick(index)} key={notes} className={`${clickedMelodies === index ? clickedColor : defaultColor} modal-btn max-xs:text-nowrap max-xs:overflow-hidden max-xs:text-ellipsis` }>
                                    {notes}
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

export default MelodiesSettings