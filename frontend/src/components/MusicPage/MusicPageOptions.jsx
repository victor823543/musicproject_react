
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

    const currentColor = 'rgba(52, 83, 184, 0.733)'
    const defaultColor = 'rgba(255, 255, 255, 0.33)'
    const clickedColor = 'rgba(234, 192, 43, 0.385)'

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
        <div className='flex flex-col gap-4'>
            <div className='flex text-2xl gap-4 flex-wrap font-light px-4'>
                {keys.map((key, index)=> 
                    <div onClick={() => handleKeyClick(key)} style={
                        (props.song['key'] === key) ? {backgroundColor: currentColor} : (clickedKey === key) ? {backgroundColor: clickedColor} : {backgroundColor: defaultColor}
                    } 
                    className='px-4 py-2' key={index}>{key}</div>
                    )}
            </div>
            <div className='flex flex-wrap gap-4 px-4'> 
                <div className='flex gap-4 text-2xl font-light'>
                <div style={
                    (props.song['quality'] === 'Major') ? {backgroundColor: currentColor} : (clickedQuality === 'Major') ? {backgroundColor: clickedColor} : {backgroundColor: defaultColor}
                } 
                onClick={() => handleQualityClick('Major')} className='py-2 px-4'>Major</div>
                <div style={
                    (props.song['quality'] === 'Minor') ? {backgroundColor: currentColor} : (clickedQuality === 'Minor') ? {backgroundColor: clickedColor} : {backgroundColor: defaultColor}
                }  
                onClick={() => handleQualityClick('Minor')} className='py-2 px-4'>Minor</div>
                </div>
                <form className='flex items-center xl:min-w-96 lg:min-w-72'>
                    <label className='text-2xl font-light' htmlFor="lengthInput">{`Length (${clickedLength})`}</label>
                    <input className=' bg-transparent' value={clickedLength} onChange={handleLengthChange} id='lengthInput' type="range" min={1} max={4}/>
                </form>
            </div>
            <div className='px-4'>
                <button className='bg-teal-700/10 py-2 px-4 font-light border-2 border-teal-600 rounded-md hover:bg-zinc-600/20' onClick={() => setShowAdvanced(!showAdvanced)}>{showAdvanced ? 'Hide advanced settings' : 'Show advanced settings' }</button>
            </div>
            <div className='px-4'>
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