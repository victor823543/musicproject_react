import { useRef, useState, useEffect } from 'react'
import MIDISounds from 'midi-sounds-react'
import IntervalsSettings from './IntervalsSettings'
import dark_music_image from '../../assets/images/dark-music-bg.jpeg'
import light_music_image from '../../assets/images/light-music-bg.jpeg'
import { ACCESS_TOKEN } from '../../constants'

const Intervals = (props) => {
    const refMidi = useRef()
    const [currentSettings, setCurrentSettings] = useState({})
    const [showStart, setShowStart] = useState(true)
    const [showMain, setShowMain] = useState(false)
    const [intervalSession, setIntervalSession] = useState(null)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState({0: 0})
    const [intervalNames, setIntervalNames] = useState([])
    const [guess, setGuess] = useState('')
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [stats, setStats] = useState({})
    const [storedStats, setStoredStats] = useState(null)
    const [totalCompleted, setTotalCompleted] = useState(0)
    const [passedInterval, setPassedInterval] = useState({'name': '', 'correct': true, 'visible': false, 'triggered': true})
    const [textVisible, setTextVisible] = useState(false)

    useEffect(() => {
        if (!passedInterval['triggered']) {
            const timeout = setTimeout(() => {
            setPassedInterval(prev => {
                return {...prev, 'visible': !prev['visible'], 'triggered': true}
            })
        }, 1500)

        return () => clearTimeout(timeout)
        }
        
    }, [passedInterval])

    
    const defaultColor = 'bg-slate-200/40 dark:bg-slate-500/20'
    const clickedColor = 'bg-blue-500/30 dark:bg-sky-400/30'


    const fetchIntervalSession = (paramsOut) => {
        setCurrentSettings(paramsOut)
        setIntervalNames(paramsOut['interval_names'])

        const resObj = Object.fromEntries(
                Array.from({ length: parseInt(paramsOut['length']) }, (_, index) => [index, 0])
                )
        setResult(resObj)

        const url = new URL('http://localhost:8000/api/interval/')

        const headers = new Headers({
            'Content-Type': 'application/json',
        })

        const dataToSend = {
            'intervals': paramsOut['intervals'],
            'directions': paramsOut['directions'],
            'width': paramsOut['width'],
            'length': paramsOut['length'],
            'progression': paramsOut['progression'],
        }

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dataToSend)
        }

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                
                setIntervalSession(data)
                
            })
            .catch(error => console.error('Error:', error))

    }

    const fetchUpdateStats = (intervalStats) => {
        const interval_length = Object.keys(intervalSession['intervals']).length
        const paramsOut = {}
        intervalNames.forEach(interval => {
            paramsOut[interval] = {'correct': 0, 'total': 0} 
        })
        for (let i=0; i<interval_length; i++) {
            paramsOut[intervalSession['intervals'][i]['name']]['total'] += 1
            if (intervalStats[i] === 1) {
                paramsOut[intervalSession['intervals'][i]['name']]['correct'] += 1
            }
            
        }

        const url = new URL(`http://localhost:8000/api/update/stats/`)
        const token = localStorage.getItem(ACCESS_TOKEN)
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        })

        const dataToSend = {
            'type': 'interval',
            'sessionStats': paramsOut,
            'progressStats': null,
        }

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dataToSend)
        }

        fetch(url, options)
            .then(response => console.log(response))
            .catch(error => console.error('Error:', error))

    }

    const handleStartClick = (params) => {
        fetchIntervalSession(params)
        setShowStart(false)
        setShowMain(true)
    }

    const handleContinueClick = () => {
        if (progress === Object.keys(result).length) {
            
            console.log('finished')
            atFinish()
        } 

        if (progress) {
            const current = progress - 1

            const passed = {
                'name': intervalSession['intervals'][current]['name'],
                'visible': true,
                'triggered': false,
            }
            
            if (guess === intervalSession['intervals'][current]['name']) {
                passed['correct'] = true
                setResult(prev => {
                    return {
                        ...prev,
                        [current]: 1
                    }
                })
                setScore(prev => prev + 1)
            } else {
                passed['correct'] = false
                setResult(prev => {
                    return {
                        ...prev,
                        [current]: 2
                    }
                })
            }
            setPassedInterval(passed)
        } else {
            refMidi.current.setMasterVolume(0.5)
        }
        if (!(progress === Object.keys(result).length)) {
            playInterval(intervalSession['intervals'][progress]['numbers'])
            setGuess('')
            setProgress(prev => prev + 1)    
        }
        
        
        
    }

        
    const atFinish = () => {
        const current = progress - 1
        if (guess === intervalSession['intervals'][current]['name']) {
            var finalResult = {
                ...result,
                [current]: 1,
            }
            var finalScore = score + 1
        } else {
            var finalResult = {
                ...result,
                [current]: 2,
            }
            var finalScore = score
        }
        fetchUpdateStats(finalResult)
        getStats(finalScore, finalResult)
        setProgress(0)
        setGuess('')
        setIsFinished(true)

    }

    const handleAgainClick = () => {
        playInterval(intervalSession['intervals'][progress - 1]['numbers'])
    }

    const handleGuessClick = (interval) => {
        setGuess(interval)
    }

    const getStats = (finalScore, finalResult) => {
        if (storedStats) {
            var intervalStats = storedStats
        } else {
            var intervalStats = {}
        }
        
        intervalNames.forEach(interval => {
            if (!(intervalStats.hasOwnProperty(interval))) {
                intervalStats[interval] = {'correct': 0, 'total': 0} 
            }
        })
        const interval_length = Object.keys(intervalSession['intervals']).length
        for (let i = 0; i < interval_length; i++) {
            intervalStats[intervalSession['intervals'][i]['name']]['total'] += 1
            if (finalResult[i] === 1) {
                intervalStats[intervalSession['intervals'][i]['name']]['correct'] += 1
            }            
        }
        
        const sessionStats = {
            'correct': finalScore,
            'total': interval_length + totalCompleted,
        }

        setStats({
            'intervalStats': intervalStats,
            'sessionStats': sessionStats,
        })

        setStoredStats(intervalStats)

        setTotalCompleted(sessionStats['total'])
    }

    const handleExtendClick = (newSettings) => {
        if (newSettings) {
            setShowMain(false)
            setShowStart(true)
            setIsFinished(false)
        } else {
            fetchIntervalSession(currentSettings)
            setIsFinished(false)
        }
    }

    const handleRestartClick = (newSettings) => {
        if (newSettings) {
            setScore(0)
            setStoredStats(null) 
            setTotalCompleted(0)
            setShowMain(false)
            setShowStart(true)
            setIsFinished(false)
        } else {
            setScore(0)
            setStoredStats(null)
            fetchIntervalSession(currentSettings)
            setIsFinished(false)
        }
    }


    const playIntervalPart = (interval, index) => {
        console.log(interval)
        console.log(index)
        const time =  refMidi.current.contextTime()
        for (let i=0; i<interval.length; i++) {
            refMidi.current.playChordAt(time + index, 0, [interval[i]], 1) 
        }
             
        
        console.log(time)
    }
    const playInterval = (interval) => {
        console.log(interval)
        for (let i=0; i<interval.length; i++) {
            playIntervalPart(interval[i], i)
        }
    }

  return (

    <div className='w-screen h-screen  overflow-scroll hideScrollbar'>
        {/* Sound functionality */}
        {intervalSession &&
            <div className='hidden'>
                <MIDISounds 
                ref={refMidi}
                appElementName='root'
                instruments={[0]}
            />
            </div>
        }

        {/* Background */}
        <div style={{backgroundImage: `url(${light_music_image})`}} className='dark:hidden absolute inset-y-0 right-0 -z-30 bg-right max-lg:bg-center bg-cover bg-no-repeat w-full lg:w-3/5 h-full '></div>
        <div style={{backgroundImage: `url(${dark_music_image})`}} className='hidden dark:block absolute inset-y-0 right-0 -z-30 bg-right max-lg:bg-center bg-cover bg-no-repeat w-full lg:w-3/5 h-full'></div>
        <div className="absolute inset-y-0 right-0 w-full lg:w-3/5 bg-gradient-to-r from-white dark:from-black from-2% -z-20" />
        <div className='dark:lg:hidden fixed bg-cover inset-0 -z-10 backdrop-blur-sm'></div>
    
        <div className='fixed bg-cover inset-0 -z-40 bg-white dark:bg-black'></div>

        {showStart &&
            <IntervalsSettings handleStartClick={handleStartClick} />
        }

        {showMain && 
            <div className=' min-h-full pt-20'>
                <div>
                    <div className='flex gap-1'>
                        {Object.entries(result).map(([num, status]) => 
                            <div key={num} className={`h-6 flex-grow ${(status === 1) ? 'bg-green-500' : (status === 2) ? 'bg-red-500' : 'bg-slate-900/30 dark:bg-cyan-400/30'}`}></div>
                        )}
                    </div>
                </div>
                <div className='mt-14 max-xs:mt-6 max-sm:mt-10 flex flex-col items-center'>
                    <h1 className='h1-et'>Listen to the interval</h1>
                    <button onClick={handleContinueClick} className='py-2 px-4 max-xs:py-1 max-xs:px-3 text-lg max-xs:text-sm max-sm:text-base dark:text-sky-200 font-montserrat bg-sky-500/40 dark:bg-blue-900/80 ring-2 ring-sky-700 dark:ring-blue-500 rounded-md shadow-lg mb-4 max-xs:mb-2'>{progress ? 'Continue' : 'Start'}</button>
                    <button onClick={handleAgainClick} className={`py-2 px-4 max-xs:py-1 max-xs:px-3 text-lg max-xs:text-sm max-sm:text-base dark:text-sky-200 font-montserrat bg-sky-500/40 dark:bg-blue-900/80 ring-2 ring-sky-700 dark:ring-blue-500 rounded-md shadow-lg ${!progress && 'hidden'}`}>Listen again</button>
                </div>
                <div className='mt-10 max-xs:mt-2 flex flex-col items-center px-20 max-sm:px-6 '>
                    <div className='max-w-[700px]'>
                        <h1 className='h1-et'>Take a guess</h1>
                        <div className='flex flex-wrap justify-evenly gap-4'>
                            {intervalNames.map((interval) => 
                                <div onClick={() => handleGuessClick(interval)} key={interval} className={`${(guess === interval) ? clickedColor : defaultColor} flex-1 guess-btn`}>{interval}</div>
                            )}
                        </div>
                    </div>
                    
                </div>
                
                <h1 className={`pointer-events-none max-sm:absolute max-sm:text-3xl max-xs:text-xl max-sm:top-1/2 max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 py-4 px-6 shadow-xl bg-slate-200/70 dark:bg-slate-900/60 mt-16 opacity-0 transition-opacity duration-1000 ease-in-out text-5xl text-center font-montserrat font-bold ${passedInterval['correct'] ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-500'} ${passedInterval['visible'] ? 'opacity-100' : 'opacity-0'}`}>{passedInterval['name']}</h1>
                
            </div>
        }
        {isFinished && 
            <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-800 bg-opacity-50 z-10 pt-20 pb-4'>
                <div className='bg-zinc-200 dark:bg-slate-700 max-h-full xsPlus:px-8 py-8 rounded-lg shadow-xl overflow-scroll hideScrollbar'>
                    <div className='flex flex-col items-center gap-4 dark:text-sky-200'>
                        <h1 className='text-3xl font-montserrat text-center mb-5'>Good job</h1>
                        <p>{`Your score: ${stats['sessionStats']['correct']}/${stats['sessionStats']['total']}`}</p>
                        <h1 className='text-3xl font-montserrat text-center'>Your session stats</h1>
                        <div className='grid grid-cols-3 max-sm:grid-cols-2 max-xs:grid-cols-1 gap-x-16 gap-y-4 px-6 '>
                            {Object.entries(stats['intervalStats']).map(([interval, obj]) => 
                                <p key={interval}>{`${interval}: ${obj['correct']}/${obj['total']}`}</p>
                            )}
                        </div>
                        <div className='grid grid-cols-2 gap-2 px-2'>
                            <button onClick={() => handleRestartClick(false)} className='bg-blue-300 border-2 border-blue-500 px-4 py-2 max-xs:px-2 max-xs:py-1 rounded-md text-black font-light'>Restart session</button>
                            <button onClick={() => handleRestartClick(true)} className='bg-blue-300 border-2 border-blue-500 px-4 py-2 max-xs:px-2 max-xs:py-1 rounded-md text-black font-light'>Restart with new settings</button>
                            <button onClick={() => handleExtendClick(false)} className='bg-blue-300 border-2 border-blue-500 px-4 py-2 max-xs:px-2 max-xs:py-1 rounded-md text-black font-light'>Extend session</button>
                            <button onClick={() => handleExtendClick(true)} className='bg-blue-300 border-2 border-blue-500 px-4 py-2 max-xs:px-2 max-xs:py-1 rounded-md text-black font-light'>Extend with new settings</button>
                        </div>
                        
                    </div>
                </div>
                
            </div>
        }
        
    </div>
  )
}

export default Intervals