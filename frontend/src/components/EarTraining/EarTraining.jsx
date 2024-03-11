import EarTrainingHome from "./EarTrainingHome"
import Intervals from "./Intervals"
import Chords from "./Chords"
import Progressions from "./Progressions"
import { useState } from 'react'
import { Routes, Route, Link} from 'react-router-dom'

const EarTraining = () => {
   

  return (
    <div>
        <Routes>
            <Route path="/" element={<EarTrainingHome />} />
            <Route path="/intervals" element={<Intervals />} />
            <Route path="/melodies" element={<Intervals />} />
            <Route path="/chords" element={<Chords />} />
            <Route path="/progressions" element={<Progressions />} />
        </Routes>

    </div>
  )
}

export default EarTraining