import { useNavigate } from "react-router-dom"

const EarTrainingHome = () => {
    const navigate = useNavigate()
  return (
    <div className="flex-col w-full h-screen bg-gradient-to-r from-zinc-200 to-teal-600/10 dark:from-slate-900 dark:to-cyan-900">
        
        <div className="pt-20 flex w-full h-full overflow-hidden">
            
            <section className="w-1/4 py-10 px-4 overflow-y-clip">
                <div className="text-blue-950 dark:text-blue-300 h-full bg-gradient-to-r -skew-x-12 from-blue-600/50 to-blue-300/50 rounded-lg flex flex-col gap-6 justify-center items-center">
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
            <section className="w-1/4 py-10 px-4">
                <div className="text-yellow-900 dark:text-yellow-300 h-full flex flex-col gap-6 justify-center items-center bg-gradient-to-r -skew-x-12 from-yellow-600/50 to-yellow-400/30 rounded-lg">
                <div className="skew-x-12 px-16">
                        <h2 className="text-4xl font-montserrat text-center mb-3">Melodies</h2>
                        <p className="text-lg font-montserrat font-light">Learn to recognice a progression of intervals
                        </p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-yellow-200/60 ring-yellow-900 dark:bg-yellow-950 dark:ring-yellow-500">Custom practice</button>
                        <p className="font-montserrat font-light text-center text-pretty">Practice freely with your own settings</p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-yellow-200/60 ring-yellow-900 dark:bg-yellow-950 dark:ring-yellow-500">Guided learning</button>
                        <p className="font-montserrat font-light text-center text-pretty">Learn with our prearranged plan</p>
                    </div>    
                </div>    
            </section>
            <section className="w-1/4 py-10 px-4">
            <div className="text-red-900 dark:text-red-300 h-full flex flex-col gap-6 justify-center items-center bg-gradient-to-r -skew-x-12 from-red-600/50 to-red-300/50 rounded-lg">
                <div className="skew-x-12 px-16">
                        <h2 className="text-4xl font-montserrat text-center mb-3">Chord quality</h2>
                        <p className="text-lg font-montserrat font-light">Learn to recognice the quality of chords
                        </p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-red-200/70 ring-red-700 dark:bg-red-950 dark:ring-red-500">Custom practice</button>
                        <p className="font-montserrat font-light text-center text-pretty">Practice freely with your own settings</p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-red-200/70 ring-red-700 dark:bg-red-950 dark:ring-red-500">Guided learning</button>
                        <p className="font-montserrat font-light text-center text-pretty">Learn with our prearranged plan</p>
                    </div>    
                </div>      
            </section>
            <section className="w-1/4 py-10 px-4">
            <div className="text-fuchsia-900 dark:text-fuchsia-400 h-full flex flex-col gap-6 justify-center items-center bg-gradient-to-r -skew-x-12 from-violet-600/50 to-violet-300/40 rounded-lg">
                <div className="skew-x-12 px-16">
                        <h2 className="text-4xl font-montserrat text-center mb-3">Chord progressions</h2>
                        <p className="text-lg font-montserrat font-light">Learn to recognice progressions of chords
                        </p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-fuchsia-200/60 ring-fuchsia-700 dark:bg-violet-950 dark:ring-fuchsia-500">Custom practice</button>
                        <p className="font-montserrat font-light text-center text-pretty">Practice freely with your own settings</p>
                    </div>
                    <div className="flex flex-col items-center skew-x-12 px-16">
                        <button className="btn-e mb-2 bg-fuchsia-200/60 ring-fuchsia-700 dark:bg-violet-950 dark:ring-fuchsia-500">Guided learning</button>
                        <p className="font-montserrat font-light text-center text-pretty">Learn with our prearranged plan</p>
                    </div>    
                </div>       
            </section>
        </div>
        
        
    </div>
  )
}

export default EarTrainingHome