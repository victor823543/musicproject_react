import { useRef, useState, useEffect } from 'react'
import MIDISounds from 'midi-sounds-react'
import dark_music_image from '../../assets/images/dark-music-bg.jpeg'
import light_music_image from '../../assets/images/light-music-bg.jpeg'
import { ProgressCircle, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'

const ProgressionProgress = (props) => {
    const refMidi = useRef()
    const [showStart, setShowStart] = useState(true)
    const [showMain, setShowMain] = useState(false)
    const [progressionSession, setProgressionSession] = useState(null)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState({0: 0})
    const [guess, setGuess] = useState([])
    const [score, setScore] = useState(0)
    const [chordScore, setChordScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [stats, setStats] = useState({})
    const [passedprogression, setPassedprogression] = useState({'chords': [], 'visible': false, 'triggered': true})
    const [showRoman, setShowRoman] = useState(true)
    const [spotSelected, setSpotSelected] = useState(0)
    const [sessionLength, setSessionLength] = useState(0)
    const [progLength, setProgLength] = useState(4)
    const [chordNames, setChordNames] = useState([])
    const [tempo, setTempo] = useState(2)
    const [startRandom, setStartRandom] = useState(false)
    const [playingReference, setPlayingReference] = useState(false)


    useEffect(() => {
        fetchSession()
    }, [])

    useEffect(() => {
        if (!passedprogression['triggered']) {
            const timeout = setTimeout(() => {
            setPassedprogression(prev => {
                return {...prev, 'visible': !prev['visible'], 'triggered': true}
            })
        }, 1500)

        return () => clearTimeout(timeout)
        }
        
    }, [passedprogression])


    const defaultColor = 'bg-slate-200/40 dark:bg-slate-500/20'
    const clickedColor = 'bg-blue-500/30 dark:bg-sky-400/30'


    const fetchSession = () => {
        const url = new URL(`http://localhost:8000/api/progression/progress/${props.user['user_id']}/`)

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setProgressionSession(data)
                setProgLength(parseInt(data['progression_length']))
                setSessionLength(parseInt(data['length']))
                setStartRandom(data['start'] === 'Start on random')
                setResult(Object.fromEntries(
                    Array.from({ length: parseInt(data['length']) }, (_, index) => [index, 0])
                    ))
                setChordNames(data['chord_names'][0])
            })
            .catch(error => console.error('Error:', error))
    }

    const fetchUpdateProgress = () => {
        const url = new URL(`http://localhost:8000/api/progression/progress/update/${props.user['user_id']}/`)
            fetch(url)
                .then(response => 
                        console.log(response)
                    )
                .catch(error => console.error('Error:', error))
    }

    const fetchUpdateStats = (progressStats) => {

        const url = new URL(`http://localhost:8000/api/update/stats/${props.user['user_id']}/`)

        const headers = new Headers({
            'Content-Type': 'application/json',
        })

        const dataToSend = {
            'type': 'progression',
            'sessionStats': null,
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

        if (progress === sessionLength) {
            
            console.log('finished')
            atFinish()
        }

        if (progress) {
            const current = progress - 1

            const chords = []
            let correctAmmount = 0
            for (let i=0; i<progLength; i++) {
                const chord = {
                    'name': progressionSession['progressions'][current][i]['name'],
                    'roman': progressionSession['progressions'][current][i]['roman'],
                }
                if (guess[i]['roman'] === progressionSession['progressions'][current][i]['roman']) {
                    chord['correct'] = true
                    correctAmmount++
                    setChordScore(prev => prev + 1)
                }
                chords.push(chord)
            }

            const passed = {
                'chords': chords,
                'visible': true,
                'triggered': false,
            }
            
            if (correctAmmount === progLength) {
                var cor = true
            } else {
                var cor = false
            }
            
            if (cor) {
                setResult(prev => {
                    return {
                        ...prev,
                        [current]: 1
                    }
                })
                setScore(prev => prev + 1)
            } else {
                setResult(prev => {
                    return {
                        ...prev,
                        [current]: 2
                    }
                })
            }
            setPassedprogression(passed)
        } else {
            refMidi.current.setMasterVolume(0.5)
        }
        if (!(progress === sessionLength)) {
            playprogression(progressionSession['progressions'][progress], progressionSession['chord_names'][progress][0]['numbers'])
            setGuess([])
            setChordNames(progressionSession['chord_names'][progress])
            setProgress(prev => prev + 1)    
            
        }
    }

        
    const atFinish = () => {
        const current = progress - 1

        let finalChordScore = chordScore
        let correctAmmount = 0
            for (let i=0; i<progLength; i++) {
                if (guess[i]['roman'] === progressionSession['progressions'][current][i]['roman']) {
                    correctAmmount++
                    finalChordScore++
                }
            }

        if (correctAmmount === progLength) {
            var finalScore = score + 1
        } else {
            var finalScore = score
        }

        const progressStats = {
            'result': finalScore,
            'level': progressionSession?.level
        }
        
        fetchUpdateStats(progressStats)

        getStats(finalScore, finalChordScore)
        setProgress(0)
        setGuess([])
        setIsFinished(true)

    }

    const handleAgainClick = () => {
        playprogression(progressionSession['progressions'][progress - 1], chordNames[0]['numbers'])
    }

    const handleGuessClick = (chord) => {
        if (guess.length < progLength) {
            setGuess(prev => [...prev, chord])
        } else if (spotSelected) {
            setGuess(prev => {
                const newGuessList = [...prev]
                newGuessList[spotSelected - 1] = chord
                return newGuessList
            })
        }
    }

    const getStats = (finalScore, finalChordScore) => {
        
        const sessionStats = {
            'correct': finalScore,
            'total': sessionLength,
            'percent': Math.ceil((finalScore / sessionLength) * 100),
            'moveOn': Math.ceil((finalScore / sessionLength) * 100) >= 100,
        }

        if (sessionStats.moveOn) {
            fetchUpdateProgress()
        }

        const chordTotalStats = {
            'correct': finalChordScore,
            'total': (sessionLength) * progLength
        }

        setStats({
            'sessionStats': sessionStats,
            'chordTotalStats': chordTotalStats,
        })
    }

    const handleRestartClick = () => {
        setScore(0)
        setShowMain(false)
        setShowStart(true)
        setIsFinished(false)
        fetchSession()
    }

    const handleTempoMinus = () => {
        setTempo(prev => Math.min(4, (prev + 0.5)))
    }

    const handleTempoPlus = () => {
        setTempo(prev => Math.max(1, (prev - 0.5)))
    }

    const handlePlayingReference = () => {
        setPlayingReference(true)
        setTimeout(() => {
            setPlayingReference(false)
            
        }, 2500)
    }

    const playprogressionPart = (progression, index) => {
        let time = refMidi.current.contextTime()
        if (startRandom) {
            time += 3
        }
        for (let i=0; i<progression.length; i++) {
            refMidi.current.playChordAt(time + (index * tempo), 0, [progression[i]], tempo) 
        }
    }
    const playprogression = (progression, current) => {
        console.log(progression)
        if (startRandom) {
           playReference(current) 
        }
        for (let i=0; i<progression.length; i++) {
            playprogressionPart(progression[i]['numbers'], i)
        }
    }

    const playReference = (chord) => {
        handlePlayingReference()
        const time = refMidi.current.contextTime()
        refMidi.current.playChordAt(time, 0, chord, 2)
    }


  return (

    <div className='w-screen h-screen  overflow-scroll hideScrollbar'>
        {/* Sound functionality */}
        {progressionSession &&
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
                            <ProgressCircle value={progressionSession?.totalProgress} size="lg" showAnimation>
                                <span className="text-sm font-medium font-montserrat text-slate-700">{`${progressionSession?.totalProgress}%`}</span>
                            </ProgressCircle>
                        </div>
                        <div className='flex flex-col items-center gap-3'>
                            <h2 className='font-montserrat text-xl'>Session progress</h2>
                            <ProgressCircle value={progressionSession?.sessionBest} size="lg" showAnimation>
                                <span className="text-sm font-medium font-montserrat text-slate-700">{`${progressionSession?.sessionBest}%`}</span>
                            </ProgressCircle>
                        </div>
                    </div>
                    <h2 className='font-montserrat text-2xl text-center mt-5'>{`Current session - ${progressionSession?.level}`}</h2>
                    
                    <div className='flex gap-10'>
                        <div className='flex flex-col items-center'>
                            <h3>Session information</h3>
                            <TabGroup>
                                <TabList variant='line'>
                                    <Tab>Chords</Tab>
                                    <Tab>Start</Tab>
                                    <Tab>Inversions</Tab>
                                    <Tab>Length</Tab>
                                    <Tab>Progression length</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{chordNames.map((chord) => `${chord['roman']}, `)}</p>
                                    </TabPanel>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{progressionSession?.start}</p>
                                    </TabPanel>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{progressionSession?.inversions.map((inversion, index) => `${inversion}${(progressionSession?.inversions.length > index + 1) ? ', ' : ''}`)}</p>
                                    </TabPanel>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{progressionSession?.length}</p>
                                    </TabPanel>
                                    <TabPanel>
                                        <p className='mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content'>{progressionSession?.progression_length}</p>
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
                    <h1 className='h1-et'>Listen to the progression</h1>
                    <button onClick={handleContinueClick} className='py-2 px-4 max-xs:py-1 max-xs:px-3 text-lg max-xs:text-sm max-sm:text-base dark:text-sky-200 font-montserrat bg-sky-500/40 dark:bg-blue-900/80 ring-2 ring-sky-700 dark:ring-blue-500 rounded-md shadow-lg mb-4 max-xs:mb-2'>{progress ? 'Continue' : 'Start'}</button>
                    <button onClick={handleAgainClick} className={`py-2 px-4 max-xs:py-1 max-xs:px-3 text-lg max-xs:text-sm max-sm:text-base dark:text-sky-200 font-montserrat bg-sky-500/40 dark:bg-blue-900/80 ring-2 ring-sky-700 dark:ring-blue-500 rounded-md shadow-lg ${!progress && 'hidden'}`}>Listen again</button>
                </div>
                <div className='mt-10 max-xs:mt-2 flex flex-col items-center px-20 max-sm:px-6 '>
                    <div className='max-w-[500px]'>
                        <h1 className='h1-et'>Take a guess</h1>
                        <div className='flex flex-wrap justify-center gap-4'>
                            {chordNames.map((chord) => 
                                <div onClick={() => handleGuessClick(chord)} key={chord['roman']} className={`${defaultColor} guess-btn`}>{showRoman ? chord['roman'] : chord['name']}</div>
                            )}
                        </div>
                    </div>
                    
                </div>
                <div className={`  absolute top-1/3 right-0  overflow-hidden`}>
                    <div className='bg-zinc-200/40 dark:bg-slate-700/40 flex flex-col gap-5 py-3'>
                        <div className='flex flex-col items-center'>
                            <svg onClick={handleTempoMinus} xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                            </svg>

                            <div className='font-bold dark:text-white'>BPM</div>

                            <svg onClick={handleTempoPlus} xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                        </div>
                        <div className='px-2'>
                            <button onClick={() => setShowRoman(!showRoman)} className='px-2 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-bold'>{showRoman ? 'Name' : 'Roman'}</button>

                        </div>
                    </div>
                </div>
                
                {playingReference && 
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-400/30 dark:bg-slate-700/40 p-5'>
                        <p className='text-xl font-montserrat dark:text-white text-center' >
                            Playing reference chord - tonic
                        </p>
                    </div>
                }

                {guess && 
                    <div className='flex justify-center gap-4 mt-5'>
                        {guess.map((guess, index) => 
                        <div 
                        key={index} 
                        onClick={() => setSpotSelected(index + 1)}
                        className={`guess-btn scale-110 ${(spotSelected === index + 1) ? clickedColor : defaultColor}`}>
                            {showRoman ? guess['roman'] : guess['name']}
                        </div>
                        )}
                    </div>
                }
                
                
                <div className={`${passedprogression['visible'] ? 'opacity-100' : 'opacity-0'} pointer-events-none max-sm:absolute max-sm:text-3xl max-xs:text-xl max-sm:top-1/2 max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:-translate-y-1/2
                     py-4 px-6 shadow-xl bg-slate-200/70 dark:bg-slate-900/60 mt-16 opacity-0 transition-opacity duration-1000 ease-in-out text-5xl text-center font-montserrat font-bold `}>
                    {passedprogression['chords'].map((chord, index) => 
                    <div 
                    key={index} 
                    className={`${chord['correct'] ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-500'}`}>
                        {showRoman ? chord['roman'] : chord['name']}
                    </div>
                    )}
                </div>

            </div>
        }
        {isFinished && 
            <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-800 bg-opacity-50 z-10 pt-20 pb-4'>
            <div className='bg-zinc-200 dark:bg-slate-700 max-h-full xsPlus:px-8 py-8 rounded-lg shadow-xl overflow-scroll hideScrollbar'>
                <div className='flex flex-col items-center gap-4 dark:text-sky-200'>
                    <h1 className='text-3xl font-montserrat text-center mb-5'>Good job</h1>
                    <p className='fonst-montserrat text-lg'>{`Progressions: ${stats['sessionStats']['correct']}/${stats['sessionStats']['total']}`}</p>
                    <p className='fonst-montserrat text-lg'>{`Chords: ${stats['chordTotalStats']['correct']}/${stats['chordTotalStats']['total']}`}</p>
                    <div className='flex flex-col items-center gap-3'>
                        <h2 className='font-montserrat text-xl'>Session progress</h2>
                        <ProgressCircle value={stats['sessionStats']['percent']} size="lg">
                            <span className="text-sm font-medium font-montserrat text-slate-700">{`${stats['sessionStats']['percent']}%`}</span>
                        </ProgressCircle>
                    </div>
                    
                    <button onClick={handleRestartClick} className='bg-blue-300 border-2 border-blue-500 px-4 py-2 max-xs:px-2 max-xs:py-1 rounded-md text-black font-light'>{stats.sessionStats['moveOn'] ? 'Next session' : 'Try again'}</button>
                        
                    
                </div>
            </div>
            
        </div>
        }
        
    </div>
  )
}

export default ProgressionProgress