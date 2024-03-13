import '../MusicPage/piano.css'
import { useState } from 'react'

const PianoEarTraining = (props) => {
    const [pressing, setPressing] = useState(null)
    const notes = Array.from({ length: props.end - props.start + 1 }, (_, index) => props.start + index)
    const sharps = {
        0: false, 1: true, 2: false, 3: true, 4: false, 5: false, 6: true, 7: false, 8: true, 9: false, 10: true, 11: false, 
        12: false, 13: true, 14: false, 15: true, 16: false, 17: false, 18: true, 19: false, 20: true, 21: false, 22: true, 23: false, 
        24: false, 25: true, 26: false, 27: true, 28: false, 29: false, 30: true, 31: false, 32: true, 33: false, 34: true, 35: false, 
        36: false, 37: true, 38: false, 39: true, 40: false, 41: false, 42: true, 43: false, 44: true, 45: false, 46: true, 47: false, 
        48: false, 49: true, 50: false, 51: true, 52: false, 53: false, 54: true, 55: false, 56: true, 57: false, 58: true, 59: false, 
        60: false, 61: true, 62: false, 63: true, 64: false, 65: false, 66: true, 67: false, 68: true, 69: false, 70: true, 71: false, 
        72: false, 73: true, 74: false, 75: true, 76: false, 77: false, 78: true, 79: false, 80: true, 81: false, 82: true, 83: false, 
        84: false, 85: true, 86: false, 87: true, 88: false, 89: false, 90: true, 91: false, 92: true, 93: false, 94: true, 95: false
    }

    const handleMouseDown = (note) => {
        setPressing(note)
    }

    const handleMouseUp = () => {
        setPressing(null)
    }

    const findPlacements = (arr, itemToFind) => {
        const placements = []

        arr.forEach((note, index) => {
            if (note === itemToFind) {
                placements.push(index + 1)
            }
        })
        
        return placements
    }

    return (
        <div>
            <ul>
            {
               notes.map((note, index) => {
                const interval = note - (Math.floor(note / 12) * 12)
                const octave = Math.floor(index / 12)
                const decidePosition = {
                    1: 4.3,
                    3: 12.4,
                    6: 25.8,
                    8: 34,
                    10: 41.5,

                }
                const whiteHeight = `${props.pianoW*0.27}px`
                const blackHeight = `${props.pianoW*0.175}px`
                const blackKeyStyles = {
                    backgroundColor: (pressing === note) ? 'teal' : (props.correctNote === note) ? 'green' : (props.wrongNote === note) ? 'red' : (props.startNote === note) ? 'blue' : (props.highlighted.includes(note)) ? 'dimgrey' : 'black',
                    left: decidePosition[interval] + (octave * 50) + '%',
                    height: blackHeight,
                }
                const whiteKeyStyles = {
                    backgroundColor: (pressing === note) ? 'teal' : (props.correctNote === note) ? 'green' : (props.wrongNote === note) ? 'red' : (props.startNote === note) ? 'blue' : (props.highlighted.includes(note)) ? 'lightgrey' : 'white',
                    height: whiteHeight,
                }

                const guessPlacements = findPlacements(props.guess, note)

                return (
                    <div 
                        onMouseDown={() => handleMouseDown(note)} 
                        onMouseUp={handleMouseUp} 
                        onClick={() => props.onClick(note)} 
                        key={note} 
                        className={`piano-key ${sharps[note] === false ? 'white-key text-black' : 'black-key text-white'} p-2 text-center font-bold flex flex-col justify-end`}
                        style={sharps[note] ? blackKeyStyles : whiteKeyStyles}
                    >
                        {guessPlacements && 
                            guessPlacements.map((placement) => 
                                <div key={placement}>{placement}</div>
                            )
                        }
                    </div>
                )
                
               }) 
            }
            </ul>
        </div>
    )
}

export default PianoEarTraining