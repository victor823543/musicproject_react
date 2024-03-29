import EarTrainingHome from "./EarTrainingHome"
import Intervals from "./Intervals"
import IntervalProgress from "./IntervalProgress"
import Melodies from "./Melodies"
import Chords from "./Chords"
import Progressions from "./Progressions"
import ProgressionProgress from './ProgressionProgress'
import { Routes, Route, Link} from 'react-router-dom'
import ProtectedRoute from "../ProtectedRoute"

const EarTraining = (props) => {
   

  return (
    <div>
        <Routes>
            <Route path="/" element={<EarTrainingHome />} />
            <Route path="/intervals" element={<Intervals user={props.user}/>} />
            <Route path="/intervals/progress-mode" element={
              <ProtectedRoute>
                <IntervalProgress user={props.user}/>
              </ProtectedRoute>
            }/>           
            <Route path="/melodies" element={<Melodies />} />
            <Route path="/chords" element={<Chords />} />
            <Route path="/progressions" element={<Progressions />} />
              <Route path="/progressions/progress-mode" element={
                <ProtectedRoute>
                  <ProgressionProgress user={props.user}/>
                </ProtectedRoute>
              }/>
            
        </Routes>

    </div>
  )
}

export default EarTraining