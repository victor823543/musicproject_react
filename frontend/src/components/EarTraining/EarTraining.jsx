import EarTrainingHome from "./EarTrainingHome"
import Intervals from "./Intervals"
import IntervalProgress from "./IntervalProgress"
import Melodies from "./Melodies"
import Chords from "./Chords"
import Progressions from "./Progressions"
import ProgressionProgress from './ProgressionProgress'
import { useState } from 'react'
import { Routes, Route, Link} from 'react-router-dom'

const EarTraining = (props) => {
   

  return (
    <div>
        <Routes>
            <Route path="/" element={<EarTrainingHome />} />
            <Route path="/intervals" element={<Intervals user={props.user}/>} />
            <Route path="/intervals/progress-mode" element={<IntervalProgress user={props.user}/>}/>
            <Route path="/melodies" element={<Melodies />} />
            <Route path="/chords" element={<Chords />} />
            <Route path="/progressions" element={<Progressions />} />
            <Route path="/progressions/progress-mode" element={<ProgressionProgress user={props.user}/>}/>
        </Routes>

    </div>
  )
}

export default EarTraining