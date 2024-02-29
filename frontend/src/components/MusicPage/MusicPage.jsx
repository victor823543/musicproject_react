
import arrowDown from '../../assets/icons/arrow-down.svg'

import MusicPageChords from './MusicPageChords'
import MusicPageForm from './MusicPageForm'
import MusicPageOptions from './MusicPageOptions'
import MusicPageKeyboard from './MusicPageKeyboard'
import MusicPageAudio from './MusicPageAudio'
import { useState } from 'react'

const MusicPage = () => {
    const [params, setParams] = useState({ key: '', quality: 'Major', length: '1', additions: null})
    const [song, setSong] = useState(null)
    const [showChord, setShowChord] = useState([0])
    const [songAudio, setSongAudio] = useState(null)
    const [chordPlaying, setChordPlaying] = useState(null)
    const [audioTempo, setAudioTempo] = useState(2)
    const [showModal, setShowModal] = useState(false)
    const [showAudioModal, setShowAudioModal] = useState(false)



    const fetchCreateSong = (paramsOut=params) => {
        const url = new URL('http://localhost:8000/api/create/')
        //url.search = new URLSearchParams(paramsOut).toString()

        const headers = new Headers({
            'Content-Type': 'application/json',
        })

        const dataToSend = {
            'length': paramsOut['length'],
            'key': paramsOut['key'],
            'quality': paramsOut['quality'],
            'additions': paramsOut['additions'],
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
                setSong(data)
            })
            .catch(error => console.error('Error:', error))

    }

    const fetchTransposeSong = (paramsOut) => {
        const url = new URL('http://localhost:8000/api/transpose/')
        const headers = new Headers({
            'Content-Type': 'application/json',
        })

        const dataToSend = {
            'song': song['song'],
            'key': paramsOut['key'],
            'quality': paramsOut['quality'],
            'length': song['length'],
            'chords': song['chords'],
            'oldKey': song['key'],
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
                setSong(data)
            })
            .catch(error => console.error('Error', error))
    }

    const fetchSongAudio = (paramsOut) => {
        setShowAudioModal(false)
        setAudioTempo(paramsOut['tempo'])
        const url = new URL('http://localhost:8000/api/audio/')
        const headers = new Headers({
            'Content-Type': 'application/json'
        })

        const dataToSend = {
            'song': song['song'],
            'chords': song['chords'],
            'variation': paramsOut['variation'],
            'base': paramsOut['base'],
            'tempo': paramsOut['tempo']
        }

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(dataToSend)
        }

        fetch(url, options)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setSongAudio(url)
            })
            .catch(error => console.error('Error fetching MP3 file:', error))
        
    }

    const handleSelectKeyChange = (e) => {
        setParams((prev) => {
            return ({
                ...prev,
                key: e.target.value
            })
        })
    }

    const handleSelectQualityChange = (e) => {
        setParams((prev) => {
            return ({
                ...prev,
                quality: e.target.value
            })
        })
    }

    const handleSelectLengthChange = (e) => {
        setParams((prev) => {
            return ({
                ...prev,
                length: e.target.value
            })
        })
    }
    
    const handleCreateClick = (e) => {
        e.preventDefault()
        fetchCreateSong()
        
    }

    const handleCreateNewClick = (newParams) => {
        setParams(newParams)
        fetchCreateSong(newParams)
        setShowModal(false)
    }

    const handleTransposeClick = (newParams) => {
        setParams(newParams)
        fetchTransposeSong(newParams)
        setShowModal(false)
    }

    const handleChordClick = (c) => {
        setShowChord(song['chords'][c])
    }

    const handleProgress = state => {
        let secondsPlayed = state['playedSeconds']
        if (song['length'] * (6 - audioTempo) * 4 > secondsPlayed > 0) {
            let currentChord = Math.floor(secondsPlayed / (6 - audioTempo))
            setChordPlaying(currentChord)
            setShowChord(song['chords'][song['chordList'][currentChord]])
            console.log(currentChord)
        }
        
    }

    const toggleModal = () => {
        setShowModal(!showModal)
    }

    const toggleAudioModal = () => {
        setShowAudioModal(!showAudioModal)
    }

    return (
        <div className={`${song && 'bg-zinc-200'} min-h-screen flex flex-col justify-center items-center`}>
            
                {!song  && <MusicPageForm 
                    onSelectKeyChange={handleSelectKeyChange} 
                    onCreateClick={handleCreateClick} 
                    onSelectLengthChange={handleSelectLengthChange}
                    onSelectQualityChange={handleSelectQualityChange}
                /> }
                {song && 
                <>
                {/* For bigger than sm device width */}
                <div className='w-full h-full flex max-lg:flex-col max-sm:hidden'>
                    <div className='w-full h-20 lg:hidden'></div>
                    <div className='absolute w-full h-full bg-zinc-200 inset-0 -z-20'></div>
                    <div className='lg:w-1/2 h-full flex flex-col justify-between'>
                        <MusicPageChords song={song} handleChordClick={handleChordClick} chordPlaying={chordPlaying}/>
                        <MusicPageOptions song={song} handleCreateClick={handleCreateNewClick} handleTransposeClick={handleTransposeClick}/>
                    </div>
                    <div className='lg:w-1/2'>
                        <MusicPageKeyboard showChord={showChord}/>
                        <MusicPageAudio audio={songAudio} handleGetAudioClick={fetchSongAudio} handleProgress={handleProgress}/>
                    </div>
                    
                </div>

                {/* For bigger than sm device width */}
                <div className='w-full h-full flex flex-col sm:hidden'>
                    <div className='absolute w-screen h-screen bg-zinc-200 inset-0 -z-20'></div>
                    <div className='w-full h-20 lg:hidden'></div>
                    {showModal && 
                        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-800 bg-opacity-50 z-10'>
                            <div className='bg-zinc-200 p-8 rounded-lg shadow-md'>
                                <MusicPageOptions song={song} handleCreateClick={handleCreateNewClick} handleTransposeClick={handleTransposeClick} />
                                <button className='bg-red-300 border-2 border-red-500 px-4 py-2 rounded-md mt-4 font-light' onClick={toggleModal}>Close</button>
                            </div>
                            
                        </div>
                    }
                    {showAudioModal && 
                        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-zinc-800 bg-opacity-50 z-10'>
                            <div className='bg-zinc-200 p-8 rounded-lg shadow-md'>
                                <MusicPageAudio audio={songAudio} handleGetAudioClick={fetchSongAudio} handleProgress={handleProgress} inModal={true}/>    
                                <button className='bg-red-300 border-2 border-red-500 px-4 py-2 rounded-md mt-4 font-light' onClick={toggleAudioModal}>Close</button>
                            </div>
                            
                        </div>
                    }
                    
    
                    <div className='h-full flex flex-col justify-between'>

                        

                        <MusicPageChords song={song} handleChordClick={handleChordClick} chordPlaying={chordPlaying}/>
                        <div className='flex justify-center'>
                            <button className='btn-s w-fit' onClick={toggleModal}>Change song</button>
                        </div>
                        
                        <MusicPageKeyboard showChord={showChord}/>
                        <div className='flex justify-center'>
                            <button className='btn-s w-fit' onClick={toggleAudioModal}>Generate audio</button>
                        </div>
                        
                        <MusicPageAudio audio={songAudio} handleGetAudioClick={fetchSongAudio} handleProgress={handleProgress}/>
                    </div>
                    
                    
                </div>
                </>
                
                }
            
            
        </div>
    )
}

export default MusicPage