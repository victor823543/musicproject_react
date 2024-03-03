
import { useState } from 'react'

const MusicPageOptions = (props) => {
    const [clickedKey, setClickedKey] = useState(props.song['key'])
    const [clickedQuality, setClickedQuality] = useState(props.song['quality'])
    const [clickedLength, setClickedLength] = useState(props.song['length'])
    const [showButton, setShowButton] = useState(false)
    const [showTranspose, setShowTranspose] = useState(false)
    const [isChecked, setIsChecked] = useState({
        7: false,
        M7: false,
        m7: false,
        6: false,
        m6: false,
        M9: false,
        sus2: false,
        sus4: false,
    })
    const [showAdvanced, setShowAdvanced] = useState(false)

    const keys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'Db', 'Eb', 'Gb', 'Ab', 'Bb']

    const currentColor = 'bg-teal-600/60 dark:bg-teal-600'
    const defaultColor = 'bg-slate-500/20'
    const clickedColor = 'bg-cyan-300/60 dark:bg-cyan-500/70'

    const handleKeyClick = (keyClickedOn) => {
        setClickedKey(keyClickedOn)
        if ((clickedQuality === props.song['quality']) && (keyClickedOn === props.song['key'])) {
            setShowButton(false)
        } else {
            setShowButton(true)
            setShowTranspose(true)
        }
        if (!(clickedQuality === props.song['quality'])) {
            setShowTranspose(false)
        }

    }

    const handleQualityClick = (qualityClickedOn) => {
        setClickedQuality(qualityClickedOn)
        if ((qualityClickedOn === props.song['quality']) && (clickedKey === props.song['key'])) {
            setShowButton(false)
        } else {
            setShowButton(true)
            setShowTranspose(true)
        }
        if (!(qualityClickedOn === props.song['quality'])) {
            setShowTranspose(false)
        }        
    }

    const handleLengthChange = (e) => {
        setClickedLength(e.target.value)
    }

    const handleCheckboxChange = (checkboxName) => {
        setIsChecked({
            ...isChecked,
            [checkboxName]: !isChecked[checkboxName]
        })
    }

    return (
        <div className='flex flex-col gap-4 px-4 max-xs:px-4'>
            <div className='flex max-xs:text-base max-sm:text-lg text-2xl max-xs:gap-2 gap-4 flex-wrap font-light'>
                {keys.map((key, index)=> 
                    <div onClick={() => handleKeyClick(key)}
                    className={`px-4 py-2 ${(props.song['key'] === key) ? currentColor : (clickedKey === key) ? clickedColor : defaultColor}`} key={index}>{key}</div>
                    )}
            </div>
            <div className='flex flex-wrap max-xs:gap-2 gap-4 '> 
                <div className='flex max-xs:gap-2 gap-4 max-xs:text-base max-sm:text-lg text-2xl font-light'>
                <div
                onClick={() => handleQualityClick('Major')} className={`py-2 px-4 ${(props.song['quality'] === 'Major') ? currentColor : (clickedQuality === 'Major') ? clickedColor : defaultColor}`}>Major</div>
                <div
                onClick={() => handleQualityClick('Minor')} className={`py-2 px-4 ${(props.song['quality'] === 'Minor') ? currentColor : (clickedQuality === 'Minor') ? clickedColor : defaultColor}`}>Minor</div>
                </div>
                <form className='flex items-center xl:min-w-96 lg:min-w-72'>
                    <label className='max-xs:text-base max-sm:text-lg text-2xl font-light' htmlFor="lengthInput">{`Length (${clickedLength})`}</label>
                    <input className=' bg-transparent' value={clickedLength} onChange={handleLengthChange} id='lengthInput' type="range" min={1} max={4}/>
                </form>
            </div>
            <div>
                <button className='max-xs:text-sm max-xs:px-2 bg-teal-700/10 py-2 px-4 font-light border-2 border-teal-600 rounded-md hover:bg-zinc-600/20' onClick={() => setShowAdvanced(!showAdvanced)}>{showAdvanced ? 'Hide advanced settings' : 'Show advanced settings' }</button>
            </div>
            <div>
                {showAdvanced && 
                    <div className='flex flex-wrap gap-2 font-light text-lg'>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['7']} onChange={() => handleCheckboxChange('7')} />
                            Dominant 7th (7)
                        </label>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['M7']} onChange={() => handleCheckboxChange('M7')} />
                            Major 7th (Maj7)
                        </label>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['m7']} onChange={() => handleCheckboxChange('m7')} />
                            Minor 7th (m7)
                        </label>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['6']} onChange={() => handleCheckboxChange('6')} />
                            Major 6th (6)
                        </label>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['m6']} onChange={() => handleCheckboxChange('m6')} />
                            Minor 6th (m6)
                        </label>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['M9']} onChange={() => handleCheckboxChange('M9')} />
                            Add 9 (add9)
                        </label>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['sus2']} onChange={() => handleCheckboxChange('sus2')} />
                            Suspended 2nd (sus2)
                        </label>
                        <label className='checkbox-label'>
                            <input type="checkbox" checked={isChecked['sus4']} onChange={() => handleCheckboxChange('sus4')} />
                            Suspended 4th (sus4)
                        </label>
                    </div>
                }
            </div>
            
            
            
            {showButton &&
            <div className='flex gap-2 px-4'>
                <button className='btn-s' onClick={() => props.handleCreateClick({ key: clickedKey, quality: clickedQuality, length: clickedLength, additions: isChecked})}>Create New</button>
                {showTranspose &&
                    <button className='btn-s' onClick={() => props.handleTransposeClick({ key: clickedKey, quality: clickedQuality, length: clickedLength})}>Transpose song</button>
                }
                
            </div>
            }
            
        </div>
    )
}

export default MusicPageOptions