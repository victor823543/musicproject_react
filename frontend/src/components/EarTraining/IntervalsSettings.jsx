import { useState } from 'react'

const IntervalsSettings = (props) => {
    const [clickedIntervals, setClickedIntervals] = useState({
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
        11: true, 
        12: true
    })
    const [clickedDirections, setClickedDirections] = useState({
        'Up': true,
        'Down': false,
        'Unison': false,
        'Random': false,
    })
    const [clickedScope, setClickedScope] = useState(0)
    const [clickedLength, setClickedLength] = useState('10')
    const [clickedProgression, setClickedProgression] = useState('Slow')

   
    const intervals = ['Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave']
    const octaveScopes = ['4', '3-5', '2-6']
    const sessionLengths = ['10', '20', '30', '50']
    const difProgression = ['None', 'Slow', 'Fast']
    const clickedColor = 'bg-sky-400/30 dark:bg-sky-400/40'
    const defaultColor = 'bg-amber-500/20 dark:bg-blue-500/20 hover:bg-sky-400/10 hover:dark:bg-sky-400/30'

    const handleIntervalClick = (interval) => {
        setClickedIntervals({
            ...clickedIntervals,
            [interval]: !clickedIntervals[interval],
        })
    }

    const handleDirectionClick = (dir, bool) => {
        if ((dir === 'Random') && (!bool)) {
            setClickedDirections({
                'Up': false,
                'Down': false,
                'Unison': false,
                'Random': true,
            })
        } else {
            setClickedDirections({
            ...clickedDirections,
            [dir]: !bool,
            'Random': false,
        })
        }
        
    }

    const handleScopeClick = (index) => {
        setClickedScope(index)
    }

    const handleLengthClick = (length) => {
        setClickedLength(length)
    }

    const handleProgressionClick = (progressionRate) => {
        setClickedProgression(progressionRate)
    }

    const handleStartClick = () => {
        const intervals_out = Object.keys(clickedIntervals).filter(key => clickedIntervals[key])
        const directions = Object.keys(clickedDirections).filter(key => clickedDirections[key])

        const intervalNames = Array.from(intervals_out, (n, _) => intervals[n - 1])

        const params = {
            'intervals': intervals_out,
            'directions': directions,
            'width': clickedScope,
            'length': clickedLength,
            'progression': clickedProgression,
            'interval_names': intervalNames,
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
                            {Object.entries(clickedDirections).map(([direction, bool]) => 
                                <div key={direction} onClick={() => handleDirectionClick(direction, bool)} className={`${bool ? clickedColor : defaultColor} modal-btn`}>{direction}</div>
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
                                <div key={length} onClick={() => handleLengthClick(length)} className={`${(clickedLength === length ? clickedColor : defaultColor)} modal-btn`} >{length}</div>
                            )}
                        </div>
                    </div>
                    <div className='px-10 max-xs:px-4 mt-8 max-xs:mt-4'>
                        <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Inversions</h1>
                        <div className='flex justify-center gap-4 flex-wrap'>
                            {difProgression.map((rate) => 
                                <div key={rate} onClick={() => handleProgressionClick(rate)} className={`${(clickedProgression === rate) ? clickedColor : defaultColor} modal-btn`}>{rate}</div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className='flex flex-col items-center mt-8 max-xs:mt-4 max-w-[1100px] px-10 max-xs:px-4'>
                    <h1 className='text-center text-4xl max-sm:text-3xl max-xs:text-lg font-montserrat mb-3'>Include intervals</h1>
                    <div className='flex justify-center gap-4 flex-wrap max-xs:grid max-xs:grid-cols-2'>
                        {intervals.map((interval, index) => 
                                <div onClick={() => handleIntervalClick(index + 1)} key={interval} className={`${clickedIntervals[index + 1] ? clickedColor : defaultColor} modal-btn max-xs:text-nowrap max-xs:overflow-hidden max-xs:text-ellipsis` }>
                                    {interval}
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

export default IntervalsSettings