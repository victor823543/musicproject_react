import { useRef, useState, useEffect } from 'react'
import { ProgressCircle, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import MIDISounds from 'midi-sounds-react'
import dark_music_image from '../../assets/images/dark-music-bg.jpeg'
import light_music_image from '../../assets/images/light-music-bg.jpeg'
import FullProgress from './FullProgress'
import { ACCESS_TOKEN } from '../../constants'

const IntervalProgress = (props) => {
    const refMidi = useRef()
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
    const [passedInterval, setPassedInterval] = useState({'name': '', 'correct': true, 'visible': false, 'triggered': true})
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        fetchSession()
    }, [])

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

    const fetchSession = () => {
        const url = new URL(`http://localhost:8000/api/interval/progress/`)
        const token = localStorage.getItem(ACCESS_TOKEN)

        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setIntervalNames(data['interval_names'])
                setIntervalSession(data)
                setResult(Object.fromEntries(
                    Array.from({ length: parseInt(data['length']) }, (_, index) => [index, 0])
                    ))
            })
            .catch(error => console.error('Error:', error))
    }

    const fetchUpdateProgress = () => {

        const url = new URL(`http://localhost:8000/api/interval/progress/update/`)
        const token = localStorage.getItem(ACCESS_TOKEN)

            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => 
                        console.log(response)
                    )
                .catch(error => console.error('Error:', error))
    }

    const fetchUpdateStats = (intervalStats, progressStats) => {
        const interval_length = Object.keys(intervalSession['intervals']).length
        const sessionStats = {}
        intervalNames.forEach(interval => {
            sessionStats[interval] = {'correct': 0, 'total': 0} 
        })
        for (let i=0; i<interval_length; i++) {
            sessionStats[intervalSession['intervals'][i]['name']]['total'] += 1
            if (intervalStats[i] === 1) {
                sessionStats[intervalSession['intervals'][i]['name']]['correct'] += 1
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
            'sessionStats': sessionStats,
            'progressStats': progressStats,
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

    const handleStartClick = () => {
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

        //Update user stats
        const progressStats = {
            'result': finalScore,
            'level': intervalSession?.level
        }
        fetchUpdateStats(finalResult, progressStats)

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
        
        var intervalStats = {}
        
        
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
            'total': interval_length,
            'percent': Math.ceil((finalScore / interval_length) * 100),
            'moveOn': Math.ceil((finalScore / interval_length) * 100) >= 100,
        }

        if (sessionStats.moveOn) {
            fetchUpdateProgress()
        }

        setStats({
            'intervalStats': intervalStats,
            'sessionStats': sessionStats,
        })
    }

    const handleRestartClick = () => {
            setScore(0)
            setShowMain(false)
            setShowStart(true)
            setIsFinished(false)
            fetchSession()
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
            <div className='fixed inset-0 cover bg-slate-700/40 flex flex-col justify-center items-center dark:text-sky-200/80'>
                <div className='bg-zinc-200 dark:bg-slate-950 p-20 flex flex-col gap-10 items-center rounded-xl shadow-xl'>
                    <h1 className='font-montserrat text-3xl text-center'>Progress mode</h1>
                    <div className='flex gap-10'>
                        <div className='flex flex-col items-center gap-3'>
                            <h2 className='font-montserrat text-xl'>Total progress</h2>
                            <ProgressCircle value={intervalSession?.totalProgress} size="lg" showAnimation>
                                <span className="text-sm font-medium font-montserrat text-slate-700">{`${intervalSession?.totalProgress}%`}</span>
                            </ProgressCircle>
                        </div>
                        <div className='flex flex-col items-center gap-3'>
                            <h2 className='font-montserrat text-xl'>Session progress</h2>
                            <ProgressCircle value={intervalSession?.sessionBest} size="lg" showAnimation>
                                <span className="text-sm font-medium font-montserrat text-slate-700">{`${intervalSession?.sessionBest}%`}</span>
                            </ProgressCircle>
                        </div>
                    </div>
                    <h2 className='font-montserrat text-2xl text-center mt-5'>{`Current session - ${intervalSession?.level}`}</h2>
                    <button onClick={() => setShowAll(true)} className='py-2 px-4 bg-blue-600/30 ring-2 ring-blue-800 dark:ring-sky-400 rounded-sm font-montserrat'>Show all sessions</button>
                    <div className='flex gap-10'>
                        <div className='flex flex-col items-center'>
                            <h3>Session information</h3>
                            <TabGroup>
                                <TabList variant='line'>
                                    <Tab value={1}>Intervals</Tab>
                                    <Tab value={2}>Directions</Tab>
                                    <Tab value={3}>Octaves</Tab>
                                    <Tab value={4}>Length</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{intervalNames.map((name) => `${name}, `)}</p>
                                    </TabPanel>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{intervalSession?.directions.map((direction) => `${direction}, `)}</p>
                                    </TabPanel>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{intervalSession?.width}</p>
                                    </TabPanel>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{intervalSession?.length}</p>
                                    </TabPanel>
                                </TabPanels>
                            </TabGroup>
                        </div>

                    </div>
                    <button onClick={handleStartClick} className='py-2 px-4 bg-blue-600/30 ring-2 ring-blue-800 dark:ring-sky-400 rounded-sm font-montserrat'>Start current session</button>
                </div>
            </div>
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
                        <div className='flex'>
                            <div className='grid grid-cols-3 max-sm:grid-cols-2 max-xs:grid-cols-1 gap-x-16 gap-y-4 px-6 '>
                                {Object.entries(stats['intervalStats']).map(([interval, obj]) => 
                                    <p key={interval}>{`${interval}: ${obj['correct']}/${obj['total']}`}</p>
                                )}
                            </div>
                            <div className='flex flex-col items-center gap-3'>
                                <h2 className='font-montserrat text-xl'>Session progress</h2>
                                <ProgressCircle value={stats['sessionStats']['percent']} size="lg">
                                    <span className="text-sm font-medium font-montserrat text-slate-700">{`${stats['sessionStats']['percent']}%`}</span>
                                </ProgressCircle>
                            </div>
                        </div>
                        
                        <button onClick={handleRestartClick} className='bg-blue-300 border-2 border-blue-500 px-4 py-2 max-xs:px-2 max-xs:py-1 rounded-md text-black font-light'>{stats.sessionStats['moveOn'] ? 'Next session' : 'Try again'}</button>
                            
                        
                    </div>
                </div>
                
            </div>
        }

        {showAll &&
            <FullProgress levelStats={intervalSession?.progressInfo.levelStats} current={intervalSession?.level} close={() => setShowAll(false)}/>
        }
        
    </div>
  )
}

export default IntervalProgress