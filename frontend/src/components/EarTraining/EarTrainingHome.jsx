import { useNavigate } from "react-router-dom"
import { useState } from 'react'

const EarTrainingHome = () => {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(3)

    const handleMouseOver = (section) => {
        setSelected(section)
    }

  return (
    <div className="flex-col w-full h-screen bg-gradient-to-r from-zinc-200 to-teal-600/10 dark:from-slate-900 dark:to-cyan-900 hideScrollbar">
        
        <div className={`pt-20 flex w-full h-full ${(selected < 2) ? 'max-xl:justify-start' : 'max-xl:justify-end'} max-sm:justify-center overflow-hidden `}>
            
            <section className={`${(selected === 0) ? 'max-xl:w-1/3 max-xl:scale-110 max-mdPlus:w-1/2 max-sm:absolute max-sm:bottom-16 max-sm:z-20 max-sm:w-4/5 max-sm:h-5/6' : 'max-xl:w-[250px] max-mdPlus:w-[200px] opacity-50 max-sm:opacity-0 max-sm:pointer-events-none'} transition-all ease-in-out duration-500 w-1/4 py-10 px-4 overflow-y-clip `}>
                <div onMouseOver={() => handleMouseOver(0)} className="text-blue-950 dark:text-blue-300 h-full bg-gradient-to-r -skew-x-12 from-blue-600/50 to-blue-300/50 rounded-lg flex flex-col gap-6 justify-center items-center overflow-hidden">
                    <div className="skew-x-12 px-16">
                        <h2 className="text-4xl  font-montserrat text-center mb-3">Intervals</h2>
                        <p className="text-lg font-montserrat font-light">Learn to recognice the distance between notes
                        </p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button onClick={() => navigate('/eartraining/intervals')} className="btn-e mb-2 bg-blue-200/60 ring-blue-800 dark:bg-blue-950 dark:ring-blue-500">Custom practice</button>
                        <p className="font-montserrat font-light text-center text-pretty">Practice freely with your own settings</p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-blue-200/60 ring-blue-800 dark:bg-blue-950 dark:ring-blue-500">Guided learning</button>
                        <p className="font-montserrat font-light text-center text-pretty">Learn with our prearranged plan</p>
                    </div>
                </div>
            </section>
            <section className={`${(selected === 1) ? 'max-xl:w-1/3 max-xl:scale-110 max-mdPlus:w-1/2 max-sm:absolute max-sm:z-20 max-sm:w-4/5 max-sm:h-5/6' : 'max-xl:w-[250px] max-mdPlus:w-[200px] opacity-50 max-sm:opacity-0 max-sm:pointer-events-none'} transition-all ease-in-out duration-500 w-1/4 py-10 px-4 overflow-y-clip`}>
                <div onMouseOver={() => handleMouseOver(1)} className="text-yellow-900 dark:text-yellow-300 h-full flex flex-col gap-6 justify-center items-center bg-gradient-to-r -skew-x-12 from-yellow-600/50 to-yellow-400/30 rounded-lg overflow-hidden">
                <div className="skew-x-12 px-16">
                        <h2 className="text-4xl font-montserrat text-center mb-3">Melodies</h2>
                        <p className="text-lg font-montserrat font-light">Learn to recognice a progression of intervals
                        </p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button onClick={() => navigate('/eartraining/melodies')} className="btn-e mb-2 bg-yellow-200/60 ring-yellow-900 dark:bg-yellow-950 dark:ring-yellow-500">Custom practice</button>
                        <p className="font-montserrat font-light text-center text-pretty">Practice freely with your own settings</p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-yellow-200/60 ring-yellow-900 dark:bg-yellow-950 dark:ring-yellow-500">Guided learning</button>
                        <p className="font-montserrat font-light text-center text-pretty">Learn with our prearranged plan</p>
                    </div>    
                </div>    
            </section>
            <section className={`${(selected === 2) ? 'max-xl:w-1/3 max-xl:scale-110 max-mdPlus:w-1/2 max-sm:absolute max-sm:z-20 max-sm:w-4/5 max-sm:h-5/6' : 'max-xl:w-[250px] max-mdPlus:w-[200px] opacity-50 max-sm:opacity-0 max-sm:pointer-events-none'} transition-all ease-in-out duration-500 w-1/4 py-10 px-4 overflow-y-clip`}>
            <div onMouseOver={() => handleMouseOver(2)} className="text-red-900 dark:text-red-300 h-full flex flex-col gap-6 justify-center items-center bg-gradient-to-r -skew-x-12 from-red-600/50 to-red-300/50 rounded-lg overflow-hidden">
                <div className="skew-x-12 px-16">
                        <h2 className="text-4xl font-montserrat text-center mb-3">Chord quality</h2>
                        <p className="text-lg font-montserrat font-light">Learn to recognice the quality of chords
                        </p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button onClick={() => navigate('/eartraining/chords')} className="btn-e mb-2 bg-red-200/70 ring-red-700 dark:bg-red-950 dark:ring-red-500">Custom practice</button>
                        <p className="font-montserrat font-light text-center text-pretty">Practice freely with your own settings</p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-red-200/70 ring-red-700 dark:bg-red-950 dark:ring-red-500">Guided learning</button>
                        <p className="font-montserrat font-light text-center text-pretty">Learn with our prearranged plan</p>
                    </div>    
                </div>      
            </section>
            <section className={`${(selected === 3) ? 'max-xl:w-1/3 max-xl:scale-110 max-mdPlus:w-1/2 max-sm:absolute max-sm:z-20 max-sm:w-4/5 max-sm:h-5/6' : 'max-xl:w-[250px] max-mdPlus:w-[200px] opacity-50 max-sm:opacity-0 max-sm:pointer-events-none'} transition-all ease-in-out duration-500 w-1/4 py-10 px-4 overflow-y-clip`}>
            <div onMouseOver={() => handleMouseOver(3)} className="text-fuchsia-900 dark:text-fuchsia-400 h-full flex flex-col gap-6 justify-center items-center bg-gradient-to-r -skew-x-12 from-violet-600/50 to-violet-300/40 rounded-lg overflow-hidden">
                <div className="skew-x-12 px-16">
                        <h2 className="text-4xl font-montserrat text-center mb-3">Chord progressions</h2>
                        <p className="text-lg font-montserrat font-light">Learn to recognice progressions of chords
                        </p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button onClick={() => navigate('/eartraining/progressions')} className="btn-e mb-2 bg-fuchsia-200/60 ring-fuchsia-700 dark:bg-violet-950 dark:ring-fuchsia-500">Custom practice</button>
                        <p className="font-montserrat font-light text-center text-pretty">Practice freely with your own settings</p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-fuchsia-200/60 ring-fuchsia-700 dark:bg-violet-950 dark:ring-fuchsia-500">Guided learning</button>
                        <p className="font-montserrat font-light text-center text-pretty">Learn with our prearranged plan</p>
                    </div>    
                </div>       
            </section>
            
            
        </div>
        
        <div className="absolute w-full h-16 px-2 bottom-3 flex justify-center gap-4 sm:hidden overflow-x-hidden">
            <div onMouseDown={() => handleMouseOver(0)} className={`flex justify-center items-center flex-1 -skew-x-12 bg-gradient-to-r from-blue-600/50 to-blue-300/50 rounded-lg px-4 py-2 z-30 ${(selected === 0) && 'hidden pointer-events-none'}`}>
                <p className="text-blue-950 dark:text-blue-300 skew-x-12 text-center font-montserrat">Intervals</p>
            </div>
            <div onMouseDown={() => handleMouseOver(1)} className={`flex justify-center items-center flex-1 -skew-x-12 bg-gradient-to-r from-yellow-600/50 to-yellow-400/30 rounded-lg px-4 py-2 z-30 ${(selected === 1) && 'hidden pointer-events-none'}`}>
                <p className="text-yellow-900 dark:text-yellow-300 skew-x-12 text-center font-montserrat">Melodies</p>
            </div>
            <div onClick={() => handleMouseOver(2)} className={`flex justify-center items-center flex-1 -skew-x-12 bg-gradient-to-r from-red-600/50 to-red-300/50 rounded-lg px-4 py-2 z-30 ${(selected === 2) && 'hidden pointer-events-none'}`}>
                <p className="text-red-900 dark:text-red-300 skew-x-12 text-center font-montserrat">Chord quality</p>
            </div>
            <div onClick={() => handleMouseOver(3)} className={`flex justify-center items-center flex-1 -skew-x-12 bg-gradient-to-r from-violet-600/50 to-violet-300/40 rounded-lg px-4 py-2 z-30 ${(selected === 3) && 'hidden pointer-events-none'}`}>
                <p className="text-fuchsia-900 dark:text-fuchsia-400 skew-x-12 text-center font-montserrat">Chord progression</p>
            </div>
        </div>
    </div>
  )
}

export default EarTrainingHome