import { RiCloseCircleLine } from '@remixicon/react'
import { ProgressCircle } from '@tremor/react'
import { useState } from 'react'

const FullProgress = (props) => {
    const [showLevel, setShowLevel] = useState(props.current)

    const intervalNames = ['Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave']
    const chordRomans = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'I7', 'ii7', 'iii7', 'IV7', 'V7', 'vi7']
    const indexToChords = {
        'Basic': [0, 3, 4, 5],
        'All diatonic': [0, 1, 2, 3, 4, 5],
        '+ seventh': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    }
    const inversions = ['First inversion', 'Second inversion']
    const numRows = Math.ceil(Object.keys(props.levelStats).length / 3)
    const numCols = 3


    return (
        <div className='fixed inset-0 cover bg-slate-700/40 flex flex-col justify-center items-center dark:text-sky-200/80 pt-20'>
            
            <div className=' relative bg-zinc-200 dark:bg-slate-950 p-20 flex rounded-xl shadow-xl overflow-scroll hideScrollbar'>
                <div className='flex flex-col items-start'>
                    {Array.from({ length: numRows }, (_, rowIndex) => (
                        <div key={rowIndex} className="w-full flex" style={{ flexDirection: rowIndex % 2 === 0 ? 'row' : 'row-reverse' }}>
                            {Array.from({ length: numCols }, (_, colIndex) => {
                                const key = ((rowIndex * numCols) + colIndex + 1).toString()
                                if (parseInt(key) <= Object.keys(props.levelStats).length) {
                                    //Hide or show line depending on position - horizontal
                                    if ((colIndex == numCols - 1 && rowIndex % 2 === 0) || (colIndex == 0 && rowIndex % 2 > 0) ) {
                                        var displayHorizontal = 'hidden'
                                    } else if (((rowIndex * numRows) + colIndex + 1) === Object.keys(props.levelStats).length) {
                                        var displayHorizontal = 'hidden'
                                    } else {
                                        var displayHorizontal = 'border-b-2 border-black dark:border-amber-200'
                                    }
                                    //Hide or show line depending on position - vertical
                                    if ((colIndex == numCols - 1) && !(rowIndex + 1 === numRows && colIndex + 1 === numCols)) {
                                        var displayVertical = 'border-r-2 border-black dark:border-amber-200'
                                    }

                                    const item = props.levelStats[key]
                                    return (
                                        <div key={colIndex} className="flex flex-col">
                                            <div className="flex">
                                                <div onClick={() => setShowLevel(item.info.level)} className={`${(item.bestScorePercent === 100) ? 'bg-green-900/30 hover:bg-green-700/30 dark:bg-green-400/30 hover:dark:bg-green-300/40' : 'bg-blue-800/30 hover:bg-blue-600/30'} p-4 rounded-md font-montserrat w-52`}>
                                                    <p className='text-center'>{`Level ${item.info.level}`}</p>
                                                    <div className='flex gap-x-4 flex-wrap'>
                                                        <p className='text-sm font-light'>{`Length: ${item.info.length}`}</p>
                                                        {props.type === 'interval' && <p className='text-sm font-light'>{`Width: ${item.info?.width}`}</p>}
                                                        {props.type === 'progression' && <p className='text-sm font-light'>{`Progression length: ${item.info?.progression_length}`}</p>}
                                                        {props.type === 'progression' && <p className='text-sm font-light'>{`${item.info?.start}`}</p>}
                                                    </div>
                                                    <div className='flex gap-3'>
                                                        {props.type === 'interval' &&
                                                        <>
                                                            <p className='text-sm'>Directions:</p>
                                                            <p className='text-sm font-light'>{item.info?.directions.map((direction, index) => index === item.info?.directions.length - 1 ? direction : ` ${direction} - `)}</p>
                                                        </>
                                                        }
                                                    </div>
                                                    
                                                </div>
                                                <div className={`w-4 h-1/2 ${displayHorizontal}`}></div>   
                                            </div>
                                            <div className={`h-5 w-1/2 ${displayVertical}`}></div>
                                        </div>
                                )}
                            })}
                        </div>
                    ))} 
                </div>
                <div className='sticky top-0 ml-10 pl-10 border-l border-gray-300 dark:border-sky-300/40'>
                    <div className='flex flex-col gap-4 h-full justify-center'>
                        <h1 className='text-center text-3xl font-montserrat'>{`Level ${showLevel}`}</h1>
                        <div className='w-full h-1 border-b-[1px] border-slate-400'></div>
                        <div className='flex flex-col items-center gap-3'>
                            <h2 className='font-montserrat text-xl'>Session progress</h2>
                            <ProgressCircle className='relative' value={props.levelStats[showLevel].bestScorePercent} size="xl" strokeWidth={16} showAnimation>
                                <span className="text-sm font-medium font-montserrat text-slate-700 dark:text-sky-100">{`${props.levelStats[showLevel].bestScorePercent}%`}</span>
                            </ProgressCircle>
                        </div>    
                        <div className='flex flex-col gap-2 items-center'>
                            {props.type === 'interval' &&
                            <>
                                <h2 className='font-montserrat text-xl'>Intervals Included</h2>
                                <div className='grid grid-cols-3 gap-x-3 gap-y-2'>
                                    {intervalNames.map((interval, index) => 
                                        
                                        <div key={index} className={`text-center font-montserrat pb-1 border-sky-500 dark:border-amber-200 ${props.levelStats[showLevel].info?.interval_names.includes(interval) ? 'border-b dark:text-sky-200' : 'text-gray-400/30'}`}>{interval}</div>
                                            
                                    )}
                                </div>
                            </>
                            }
                            {props.type === 'progression' &&
                            <>
                                <h2 className='font-montserrat text-xl'>Chords Included</h2>
                                <div className='grid grid-cols-3 gap-x-3 gap-y-2'>
                                    {chordRomans.map((chord, index) => 
                                        
                                        <div key={chord} className={`text-center font-montserrat pb-1 border-sky-500 dark:border-amber-200 ${indexToChords[props.levelStats[showLevel].info?.chords_included].includes(index) ? 'border-b dark:text-sky-200' : 'text-gray-400/30'}`}>{chord}</div>
                                            
                                    )}
                                </div>
                            </>
                            }
                            {props.type === 'progression' &&
                            <>
                                <h2 className='font-montserrat text-xl'>Inversions</h2>
                                <div className='flex flex-col'>
                                    {inversions.map((inversion, index) => 
                                        
                                        <div key={index} className={`text-center font-montserrat pb-1 border-sky-500 dark:border-amber-200 ${props.levelStats[showLevel].info?.inversions.includes(inversion) ? 'border-b dark:text-sky-200' : 'text-gray-400/30'}`}>{inversion}</div>
                                            
                                    )}
                                </div>
                            </>
                            }
                            
                        </div>
                    </div>
                    
                </div>

                <RiCloseCircleLine 
                    size={48}
                    className='sticky top-0 translate-x-full -translate-y-full dark:fill-red-100'
                    onClick={props.close}
                />
            </div>
        </div>
    )
}

export default FullProgress