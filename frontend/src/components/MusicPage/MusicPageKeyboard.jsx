
import Piano from './Piano';
import { useResizeDetector } from 'react-resize-detector';


const MusicPageKeyboard = (props) => {
    const { width, height, ref } = useResizeDetector()
    
    return (
        <div className='xsPlus:px-4 py-6'>
            <div ref={ref} style={{position: 'relative'}} className="h-full">
                
                <Piano start={60} end={83} showChord={props.showChord} pianoW={width}/>

            </div>
        </div>
        
            
        
    )
}

export default MusicPageKeyboard