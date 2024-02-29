
import ReactPlayer from 'react-player'
import { useState } from 'react'

const MusicPageAudio = (props) => {
    const [showSettings, setShowSettings] = useState(false)
    const [currentOption, setCurrentOption] = useState({chords: null, base: null, tempo: 2})
    const [clickedOption, setClickedOption] = useState({chords: null, base: null, tempo: 2})
    
    const currentColor = 'rgba(52, 83, 184, 0.733)'
    const defaultColor = 'rgba(255, 255, 255, 0.33)'
    const clickedColor = 'rgba(234, 192, 43, 0.385)'

    const options = ['Basic', 'Arpeggio']
    const baseOptions = ['None', 'Basic', 'Double', 'Arpeggio']

    const handleSettingsClick = () => {
        setShowSettings(!showSettings)
    }

    const handleOptionClick = (option, type) => {
        setClickedOption((prev) => {
            let newOptions = {...prev}
            if (type === 0) {
                newOptions.chords = option
            } else if (type === 1) {
                newOptions.base = option
            }
            return newOptions
        })
    }

    const handleTempoChange = (e) => {
        setClickedOption({
            ...clickedOption,
            tempo: e.target.value
        })
    }

    const handleListenClick = () => {
        setCurrentOption((prev) => {
            let options = {...prev}
            options.chords = (clickedOption.chords ? clickedOption.chords : 0)
            options.base = (clickedOption.base ? clickedOption.base : 0)
            options.tempo = clickedOption.tempo
            return options
        })
        props.handleGetAudioClick({'variation': clickedOption.chords, 'base': clickedOption.base, 'tempo': clickedOption.tempo})
    }



    return (
        <>
            <div className={`px-4 ${!props.inModal ? 'max-sm:hidden' : ''} `}>
                <div className='flex gap-4'>
                    <button className='btn-s' onClick={handleListenClick}>Listen to song</button>
                    <button className='btn-s' onClick={handleSettingsClick}>{showSettings ? 'Hide song settings' : 'Show song settings'}</button>
                </div>
                
                {showSettings &&
                    <div className='flex flex-col gap-6'>
                        <form className='mt-2 flex gap-4 items-center'>
                            <label className='text-2xl font-light text-nowrap' htmlFor="tempoInput">{`Tempo (${clickedOption.tempo})`}</label>
                            <input className='range-input bg-transparent' value={clickedOption.tempo} onChange={handleTempoChange} id='tempoInput' type="range" min={1} max={4}/>
                        </form>
                        <div className='flex flex-wrap gap-4'>
                            {options.map((option, index) => 
                                <div onClick={() => handleOptionClick(index, 0)} style={
                                    (currentOption.chords === index) ? {backgroundColor: currentColor} : (clickedOption.chords === index) ? {backgroundColor: clickedColor} : {backgroundColor: defaultColor}
                                } 
                                className='font-light text-xl py-2 px-4 bg-slate-900 rounded-sm' key={index}>
                                    {option}
                                </div>
                            )}
                        </div>
                        <div className='flex flex-wrap gap-4'> 
                            {baseOptions.map((option, index) => 
                                <div onClick={() => handleOptionClick(index, 1)} style={
                                    (currentOption.base === index) ? {backgroundColor: currentColor} : (clickedOption.base === index) ? {backgroundColor: clickedColor} : {backgroundColor: defaultColor}
                                }
                                className='font-light text-xl py-2 px-4 bg-slate-900 rounded-sm' key={index}>
                                    {option}
                                </div>
                            )}
                        </div>
                    </div>
                }
                {props.audio && (
                    <div className='mt-4'>
                        <ReactPlayer
                            url={props.audio}
                            controls
                            width={'300px'}
                            height={'50px'}
                            progressInterval={500}
                            onProgress={props.handleProgress}
                        /> 
                    </div>
                    
                )}
            </div>
            {props.audio && (
                <div className='mt-4'>
                    <ReactPlayer
                        url={props.audio}
                        controls
                        width={'300px'}
                        height={'50px'}
                        progressInterval={500}
                        onProgress={props.handleProgress}
                    /> 
                </div>
                
            )}
        </>
        
    )
}

export default MusicPageAudio