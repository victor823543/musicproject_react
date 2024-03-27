import { useRef, useState, useEffect } from 'react'
import MIDISounds from 'midi-sounds-react'
import MelodiesSettings from './MelodiesSettings'
import dark_music_image from '../../assets/images/dark-music-bg.jpeg'
import light_music_image from '../../assets/images/light-music-bg.jpeg'
import PianoEarTraining from './PianoEarTraining'
import { useResizeDetector } from 'react-resize-detector'

const Melodies = () => {
    const refMidi = useRef()
    const { width, height, ref } = useResizeDetector()
    const [currentSettings, setCurrentSettings] = useState({})
    const [showStart, setShowStart] = useState(true)
    const [showMain, setShowMain] = useState(false)
    const [melodySession, setMelodySession] = useState(null)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState({0: 0})
    const [guess, setGuess] = useState([])
    const [score, setScore] = useState(0)
    const [noteScore, setNoteScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [stats, setStats] = useState({})
    const [totalCompleted, setTotalCompleted] = useState(0)
    const [passedMelody, setPassedMelody] = useState([])
    const [sessionLength, setSessionLength] = useState(0)
    const [melodyLength, setMelodyLength] = useState(4)
    const [keysIncluded, setKeysIncluded] = useState([])
    const [tempo, setTempo] = useState(2)
    const [startRandom, setStartRandom] = useState(false)
    const [playingReference, setPlayingReference] = useState(false)
    const [startNote, setStartNote] = useState(null)
    const [correctNote, setCorrectNote] = useState(null)
    const [wrongNote, setWrongNote] = useState(null)
    const [allowContinue, setAllowContinue] = useState(true)

    
    const defaultColor = 'bg-slate-200/40 dark:bg-slate-500/20'
    const clickedColor = 'bg-blue-500/30 dark:bg-sky-400/30'

    //Log temp for debug
    const log = () => console.log(keysIncluded)

    const fetchMelodySession = (paramsOut) => {
        setCurrentSettings(paramsOut)
        setMelodyLength(parseInt(paramsOut['melody_length']))
        setSessionLength(parseInt(paramsOut['length']))

        if (paramsOut['start']) {
            setStartRandom(true)
        }

        const resObj = Object.fromEntries(
                Array.from({ length: parseInt(paramsOut['length']) }, (_, index) => [index, 0])
                )
        setResult(resObj)


        const url = new URL('http://localhost:8000/api/melody/')

        const headers = new Headers({
            'Content-Type': 'application/json',
        })

        const dataToSend = {
            'melodies_included': paramsOut['melodies_included'],
            'start': paramsOut['start'],
            'melody_length': paramsOut['melody_length'],
            'length': paramsOut['length'],
            'difficulty': paramsOut['difficulty'],
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
                
                setMelodySession(data)
                setKeysIncluded(data['melodies'][0]['all_notes'])
                
            })
            .catch(error => console.error('Error:', error))

    }

    const handleStartClick = (params) => {
        fetchMelodySession(params)
        setShowStart(false)
        setShowMain(true)
    }

    const pauseExecution = (milliseconds) => {
        return new Promise((resolve) => {
          setTimeout(resolve, milliseconds);
        });
      };
    
    const showAnswer = (passed) => {
        console.log(passed)
        for (let i=0; i<passed.length; i++) {
            setTimeout(() => {
                if (passed[i]['correct']) {
                    setCorrectNote(passed[i]['number'][0])
                } else {
                    setWrongNote(passed[i]['number'][0])
                }
                setTimeout(() => {
                    setCorrectNote(null)
                    setWrongNote(null)
                }, 400)
            }, i*500)
        }
    }

    const handleContinueClick = async () => {
        if (allowContinue) {
            setAllowContinue(false)
            if (progress === sessionLength) {
                
                console.log('finished')
                atFinish()
            }
    
            if (progress) {
    
                const current = progress - 1
    
                const notes = []
                let correctAmmount = 0
                for (let i=0; i<melodyLength; i++) {
                    const note = {
                        'number': melodySession['melodies'][current]['numbers'][i],
                    }
    
                    if (guess[i] === melodySession['melodies'][current]['numbers'][i][0]) {
                        note['correct'] = true
                        correctAmmount++
                        setNoteScore(prev => prev + 1)
                    }
                    notes.push(note)
                }
    
                const passed = notes
                
                if (correctAmmount === melodyLength) {
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
                setPassedMelody(passed)
    
                showAnswer(passed)
                await pauseExecution((500 * melodyLength) + 1000)
                setCorrectNote(null)
                setWrongNote(null)
    
            } else {
                refMidi.current.setMasterVolume(0.5)
            }
            if (!(progress === sessionLength)) {
                playMelody(melodySession['melodies'][progress])
                setStartNote(melodySession['melodies'][progress]['numbers'][0][0])
                setGuess([])
                setKeysIncluded(melodySession['melodies'][progress]['all_notes'])
                setProgress(prev => prev + 1)    
                
            }
        }
        
    }

        
    const atFinish = () => {
        const current = progress - 1
        console.log(current)
        let finalNoteScore = noteScore
        let correctAmmount = 0
            for (let i=0; i < melodyLength; i++) {
                if (guess[i] === melodySession['melodies'][current]['numbers'][i][0]) {
                    correctAmmount++
                    finalNoteScore++
                }
            }

        if (correctAmmount === melodyLength) {
            var finalScore = score + 1
        } else {
            var finalScore = score
        }
        getStats(finalScore, finalNoteScore)
        setProgress(0)
        setGuess([])
        setIsFinished(true)

    }

    const handleAgainClick = () => {
        playMelody(melodySession['melodies'][progress - 1])
    }

    const handlePianoClick = (note) => {
        if (guess.length < melodyLength) {
            setGuess(prev => [...prev, note])
            if (guess.length === 0) {
                setStartNote(null)
            }
            if (guess.length === melodyLength - 1) {
                setAllowContinue(true)
            }
        }
    }

    const getStats = (finalScore, finalNoteScore) => {
        
        const sessionStats = {
            'correct': finalScore,
            'total': sessionLength + totalCompleted,
        }
        const noteTotalStats = {
            'correct': finalNoteScore,
            'total': (sessionLength + totalCompleted) * melodyLength
        }

        setStats({
            'sessionStats': sessionStats,
            'noteTotalStats': noteTotalStats,
        })

        setTotalCompleted(sessionStats['total'])
    }

    const handleExtendClick = (newSettings) => {
        if (newSettings) {
            setShowMain(false)
            setShowStart(true)
            setIsFinished(false)
        } else {
            fetchMelodySession(currentSettings)
            setIsFinished(false)
        }
    }

    const handleRestartClick = (newSettings) => {
        if (newSettings) {
            setScore(0)
            setShowMain(false)
            setShowStart(true)
            setIsFinished(false)
        } else {
            setScore(0)
            fetchMelodySession(currentSettings)
            setIsFinished(false)
        }
    }

    const handleTempoMinus = () => {
        setTempo(prev => Math.min(4, (prev + 0.5)))
    }

    const handleTempoPlus = () => {
        setTempo(prev => Math.max(1, (prev - 0.5)))
    }

    const playMelodyPart = (melody, index) => {
        let time = refMidi.current.contextTime()
        
        for (let i=0; i<melody.length; i++) {
            refMidi.current.playChordAt(time + (index * tempo), 0, [melody[i]], tempo) 
        }
    }
    const playMelody = (melody) => {
        console.log(melody)
        
        for (let i=0; i<melody['numbers'].length; i++) {
            playMelodyPart(melody['numbers'][i], i)
        }
    }



  return (

    <div className='w-screen h-screen  overflow-scroll hideScrollbar'>
        {/* Sound functionality */}
        {melodySession &&
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
            <MelodiesSettings handleStartClick={handleStartClick} />
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
                    <h1 className='h1-et'>Listen to the melody</h1>
                    <button onClick={handleContinueClick} className='py-2 px-4 max-xs:py-1 max-xs:px-3 text-lg max-xs:text-sm max-sm:text-base dark:text-sky-200 font-montserrat bg-sky-500/40 dark:bg-blue-900/80 ring-2 ring-sky-700 dark:ring-blue-500 rounded-md shadow-lg mb-4 max-xs:mb-2'>{progress ? 'Continue' : 'Start'}</button>
                    <button onClick={handleAgainClick} className={`py-2 px-4 max-xs:py-1 max-xs:px-3 text-lg max-xs:text-sm max-sm:text-base dark:text-sky-200 font-montserrat bg-sky-500/40 dark:bg-blue-900/80 ring-2 ring-sky-700 dark:ring-blue-500 rounded-md shadow-lg ${!progress && 'hidden'}`}>Listen again</button>
                </div>

                <h1 className='h1-et max-sm:px-6 mt-10'>Take a guess</h1>
                <div className='flex flex-col py-4 sm:px-10 w-full md:w-3/4 flex-grow mx-auto max-w-[1000px] bg-slate-700/10'>
                    
                    
                    <div ref={ref} style={{position: 'relative'}} className=' h-full'>
                        {<PianoEarTraining onClick={handlePianoClick} start={60} end={83} pianoW={width} highlighted={keysIncluded} guess={guess} startNote={startNote} correctNote={correctNote} wrongNote={wrongNote} />}
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
                    </div>
                </div>
                
                {playingReference && 
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-400/30 dark:bg-slate-700/40 p-5'>
                        <p className='text-xl font-montserrat dark:text-white text-center' >
                            Playing reference chord - tonic
                        </p>
                    </div>
                }

                

            </div>
        }
        {isFinished && 
            <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-800 bg-opacity-50 z-10 pt-20 pb-4'>
                <div className='bg-zinc-200 dark:bg-slate-700 max-h-full xsPlus:px-8 py-8 rounded-lg shadow-xl overflow-scroll hideScrollbar'>
                    <div className='flex flex-col items-center gap-4 dark:text-sky-200'>
                        <h1 className='text-3xl font-montserrat text-center mb-5'>Good job</h1>
                        <h1 className='text-xl font-montserrat text-center'>Your score</h1>
                        <p className='fonst-montserrat text-lg'>{`Melodies: ${stats['sessionStats']['correct']}/${stats['sessionStats']['total']}`}</p>
                        <p className='fonst-montserrat text-lg'>{`Notes: ${stats['noteTotalStats']['correct']}/${stats['noteTotalStats']['total']}`}</p>
                        
                        
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

export default Melodies