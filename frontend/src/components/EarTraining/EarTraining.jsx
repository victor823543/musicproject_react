import EarTrainingHome from "./EarTrainingHome"
import Intervals from "./Intervals"
import { useState } from 'react'
import { Routes, Route, Link} from 'react-router-dom'

const EarTraining = () => {
   

  return (
    <div>
        <Routes>
            <Route path="/" element={<EarTrainingHome />} />
            <Route path="/intervals" element={<Intervals />} />
        </Routes>

    </div>
  )
}

export default EarTraining