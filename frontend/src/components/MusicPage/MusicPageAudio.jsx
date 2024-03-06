
import ReactPlayer from 'react-player'
import { useState } from 'react'

const MusicPageAudio = (props) => {
    const [showSettings, setShowSettings] = useState(false)
    const [currentOption, setCurrentOption] = useState({chords: null, base: null, tempo: 2})
    const [clickedOption, setClickedOption] = useState({chords: null, base: null, tempo: 2})
    
    const currentColor = 'bg-teal-600/60 dark:bg-teal-600'
    const defaultColor = 'bg-slate-500/20'
    const clickedColor = 'bg-cyan-300/60 dark:bg-cyan-500/70'

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
                        <div className='flex flex-wrap gap-4 max-xs:text-base text-xl'>
                            {options.map((option, index) => 
                                <div onClick={() => handleOptionClick(index, 0)} 
                                className={`font-light py-2 px-4 rounded-sm ${(currentOption.chords === index) ? currentColor : (clickedOption.chords === index) ? clickedColor : defaultColor}`} key={index}>
                                    {option}
                                </div>
                            )}
                        </div>
                        <div className='flex flex-wrap gap-4 max-xs:text-base text-xl'> 
                            {baseOptions.map((option, index) => 
                                <div onClick={() => handleOptionClick(index, 1)}
                                className={`font-light py-2 px-4 rounded-sm ${(currentOption.base === index) ? currentColor : (clickedOption.base === index) ? clickedColor : defaultColor}`} key={index}>
                                    {option}
                                </div>
                            )}
                        </div>
                    </div>
                }
                {(props.audio && !props.inModal) && (
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
            {(props.audio && !props.inModal) && (
                <div className='mt-4 overflow-clip sm:hidden'>
                    <ReactPlayer
                        url={props.audio}
                        controls
                        width={'260px'}
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