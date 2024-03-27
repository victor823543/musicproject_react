import image_dark_grand from '../../assets/images/dark_grand.jpeg'
import image_white_grand from '../../assets/images/white_grand.jpeg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BarChart, ProgressCircle, Tab, TabGroup, TabList, TabPanel, TabPanels } from '@tremor/react'
import FullProgress from '../EarTraining/FullProgress'

const HomePageAuth = (props) => {
    const navigate = useNavigate()
    const [songs, setSongs] = useState([])
    const [editMode, setEditMode] = useState(false)
    const [updateUI, setUpdateUI] = useState(false)
    const [stats, setStats] = useState(null)
    const [charts, setCharts] = useState(null)
    const [showFullProgress, setShowFullProgress] = useState(null)

    useEffect(() => {
        const fetchStats = () => {
            const url = new URL(`http://localhost:8000/api/userstats/${props.user['user_id']}/`)

            fetch(url)
                .then(response => {
                    if (response.ok) {
                        response.json()
                        .then(data => {
                            console.log(data)
                            const newStats = {
                                'intervalSessionStats': data.intervalSessionStats,
                                'intervalProgressStats': data.intervalProgressStats,
                                'currentIntervalLevel': data.currentIntervalLevel,
                                'progressionSessionStats': data.progressionSessionStats,
                                'progressionProgressStats': data.progressionProgressStats,
                                'currentProgressionLevel': data.currentProgressionLevel,
                            }
                            setStats(newStats)
                            const newCharts = {
                                'intervalChart': data.intervalChart,
                            }
                            setCharts(newCharts)
                        })
                    } else {
                        console.log(response)
                    }
                })
                .catch(error => console.error('Error', error))
        }

        const fetchSongs = () => {
            const url = new URL(`http://localhost:8000/api/users/${props.user['user_id']}/songs`)

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setSongs(data)
                })
                .catch(error => console.error('Error:', error))
        }

        fetchStats()
        fetchSongs()
        props.cancelSong()
    }, [updateUI])

    const fetchDeleteSong = (song_id) => {
        const url = new URL(`http://localhost:8000/api/users/${props.user['user_id']}/songs/${song_id}/delete`)

        const options = {
            method: 'DELETE',
        }

        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete song')
                }
                console.log('Song deleted')
                setUpdateUI(!updateUI)
            })
            .catch(error => console.error('Error:', error))
    }

    const handleEditClick = () => {
        setEditMode(!editMode)
    }

    const handleLevelClick = () => {

    }


    const dataFormatter = (number) =>
    Intl.NumberFormat('us').format(number).toString()

    return (
        <div className='h-screen w-screen flex flex-col items-center dark:text-slate-300 overflow-x-hidden hideScrollbar'>
            <div className='w-full min-h-20 bg-transparent'></div>
            <div style={{backgroundImage: `url(${image_white_grand})`}} className='dark:hidden fixed bg-cover inset-0 bg-center -z-20 '></div>
            <div style={{backgroundImage: `url(${image_dark_grand})`}} className='dark:block hidden fixed bg-cover inset-0 bg-center -z-20 '></div>
            <div className=' fixed bg-cover inset-0 -z-10 backdrop-blur-md'></div>
            <h1 className='text-center text-3xl xs:text-4xl lg:text-5xl xl:text-6xl font-montserrat font-light text-shadow-lg shadow-teal-800/60 dark:text-shadow dark:shadow-sky-400 my-10'>Welcome {props.user['username']}</h1>
            <div className='mt-10'>
                <p className='font-montserrat text-lg text-center'>Get started by creating a song or practicing eartraining</p>
                <div className='flex justify-evenly mt-4'>
                    <button onClick={() => navigate('/music')} className='btn-h'>Create music</button>
                    <button onClick={() => navigate('/eartraining')} className='btn-h'>Ear training</button>
                </div>
            </div>
            
            <div className='mt-10 w-full flex flex-col items-center'>
                <div className='relative px-2'>
                    <p className='font-montserrat text-lg text-center'>Browse through your stored songs</p>
                    <div onClick={handleEditClick} className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-full cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </div>
                </div>
                
                <div className='relative w-5/6 flex justify-center '>
                   
                    <div className='bg-slate-700/20 flex gap-3 mt-4 py-4 px-2 overflow-x-scroll hideScrollbar'>
                        {songs.length ?
                            songs.map((song) => 
                            <div key={song.id} className='flex flex-col min-w-48'>
                                <div onClick={() => props.handleSongClick(song.song)} className='p-3 bg-slate-600/40 dark:bg-slate-700/40 hover:bg-amber-400/20 cursor-pointer hover:shadow-amber-700 shadow-md shadow-teal-600 dark:shadow-sky-400 font-montserrat font-light'>
                                    <p>{song.title ? song.title : 'Unnamed song'}</p>
                                    <p>{`Created: ${song.created}`}</p>
                                    <p>{`Key: ${song.song.key}`}</p>
                                </div>
                                {editMode && 
                                    <button onClick={() => fetchDeleteSong(song.id)} className='red-btn mt-2'>Delete</button>
                                }
                            </div>
                            
                            ) :
                            <p className='font-montserrat text-center'>You have no stored songs at the moment</p>
                        }
        
                    </div>
                    
                           
                    
                </div>
            </div>
            <div className='w-full mt-6'>
                <h1 className='text-center font-montserrat text-2xl mt-8'>Eartraining stats</h1>
                <div className='w-full px-6'>
                    <TabGroup>
                        <TabList>
                            <Tab>Interval</Tab>
                            <Tab>Melody</Tab>
                            <Tab>Chord quality</Tab>
                            <Tab>Chord progression</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <p className='text-center font-montserrat font-light text-xl mt-6'>Interval results chart</p>
                                {charts ? 
                                    <BarChart 
                                        className='mb-6'
                                        data={charts?.intervalChart}
                                        index='name'
                                        categories={[
                                            'total',
                                            'correct',
                                            'wrong',
                                        ]}
                                        colors={['slate-700', 'green-500', 'red-500']}
                                        valueFormatter={dataFormatter}
                                        yAxisWidth={48}
                                        showAnimation
                                    /> : 
                                    <p className='text-center mt-3'>No data available</p>
                                }
                                <p className='text-center font-montserrat font-light text-xl mt-6'>Interval progress mode</p>
                                {stats?.intervalProgressStats ? 
                                    <div className='flex flex-col gap-10 justify-center mt-4 mb-20'>
                                        <div className='flex gap-16 justify-center'>
                                            <div className='flex flex-col items-center gap-3'>
                                                <h2 className='font-montserrat text-xl'>Total progress</h2>
                                                <ProgressCircle className='relative' value={stats?.intervalProgressStats.totalStats.progressPercent} size="xl" strokeWidth={16} showAnimation>
                                                    <span className="text-sm font-medium font-montserrat text-slate-700 dark:text-sky-100">{`${stats?.intervalProgressStats.totalStats.progressPercent}%`}</span>
                                                </ProgressCircle>
                                            </div>
                                            <div className='relative flex gap-5 bg-slate-600/30 rounded-xl p-6 my-auto'>
                                                {Array.from({ length: 3 }, (_, index) => parseInt(Math.max(1, stats?.currentIntervalLevel) - 1) + index).map((level, index) => {

                                                    return (
                                                        <div key={level} className={`bg-sky-500/60 hover:bg-sky-800/40 px-4 py-2 rounded-lg text-black font-montserrat text-center ${(level == parseInt(stats?.currentIntervalLevel) && 'scale-125')}`}>
                                                            <p>{`Level ${level}`}</p>
                                                            <p className='text-xs'>{`Length: ${stats?.intervalProgressStats.levelStats[level.toString()].info.length}`}</p>
                                                            <p className='text-xs'>{`Width: ${stats?.intervalProgressStats.levelStats[level.toString()].info.width}`}</p>
                                                            <p className='text-xs'>...</p>
                                                        </div>
                                                    )
                                                })}
                                                <button onClick={() => setShowFullProgress('interval')} className='text-sm w-16 py-1 px-2 text-center text-black font-light bg-emerald-500/80 m-auto rounded-md'>Show all</button>
                                                
                                            </div>
                                        </div>
                                        <div className='flex gap-16 justify-center items-center'>
                                            <div className='flex flex-col items-center gap-3'>
                                                <h2 className='font-montserrat text-xl'>Session progress</h2>
                                                <ProgressCircle className='relative' value={stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].bestScorePercent} size="xl" strokeWidth={16} showAnimation>
                                                    <span className="text-sm font-medium font-montserrat text-slate-700 dark:text-sky-100">{`${stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].bestScorePercent}%`}</span>
                                                </ProgressCircle>
                                            </div>
                                            <div className='flex flex-col gap-1 items-center bg-slate-600/30 rounded-xl p-6 font-montserrat max-w-96'>
                                                <h2 className='text-center text-lg'>Current session information</h2>
                                                <div className='flex flex-wrap gap-4 text-sm font-light'>
                                                    <p>{`Length: ${stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].info.length}`}</p>
                                                    <p>{`Width: ${stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].info.width}`}</p>
                                                </div>
                                                <div className='flex gap-3'>
                                                    <p className='text-sm'>Directions:</p>
                                                    <p className='text-sm font-light'>{stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].info.directions.map((direction, index) => index === stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].info.directions.length - 1 ? direction : ` ${direction} - `)}</p>
                                                </div>
                                                <p className='text-base text-center mt-1'>Intervals</p>
                                                <p className='text-sm font-light text-center'>{stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].info.interval_names.map((interval, index) => index === stats?.intervalProgressStats.levelStats[stats?.currentIntervalLevel].info.interval_names.length - 1 ? interval : ` ${interval} - `)}</p>
                                                </div>
                                        </div>
                                        
                                    </div> :
                                    <p className='text-center mt-3'>No data available</p>
                                }
                            </TabPanel>
                            <TabPanel>

                            </TabPanel>
                            <TabPanel>
                                
                            </TabPanel>
                            <TabPanel>
                            {stats?.progressionProgressStats ? 
                                    <div className='flex flex-col gap-10 justify-center mt-4 mb-20'>
                                        <div className='flex gap-16 justify-center'>
                                            <div className='flex flex-col items-center gap-3'>
                                                <h2 className='font-montserrat text-xl'>Total progress</h2>
                                                <ProgressCircle className='relative' value={stats?.progressionProgressStats.totalStats.progressPercent} size="xl" strokeWidth={16} showAnimation>
                                                    <span className="text-sm font-medium font-montserrat text-slate-700 dark:text-sky-100">{`${stats?.progressionProgressStats.totalStats.progressPercent}%`}</span>
                                                </ProgressCircle>
                                            </div>
                                            <div className='relative flex gap-7 bg-slate-600/30 rounded-xl p-6 my-auto'>
                                                {Array.from({ length: 3 }, (_, index) => parseInt(Math.max(1, parseInt(stats?.currentProgressionLevel) - 1)) + index).map((level, index) => {

                                                    return (
                                                        <div key={level} className={`bg-sky-500/60 hover:bg-sky-800/40 px-4 py-2 rounded-lg text-black font-montserrat text-center ${(level == parseInt(stats?.currentProgressionLevel) && 'scale-125')}`}>
                                                            <p>{`Level ${level}`}</p>
                                                            <p className='text-xs'>{`Length: ${stats?.progressionProgressStats.levelStats[level.toString()].info.length}`}</p>
                                                            <p className='text-xs'>{`Progression length: ${stats?.progressionProgressStats.levelStats[level.toString()].info.progression_length}`}</p>
                                                            <p className='text-xs'>...</p>
                                                        </div>
                                                    )
                                                })}
                                                <button onClick={() => setShowFullProgress('progression')} className='text-sm w-16 py-1 px-2 text-center text-black font-light bg-emerald-500/80 m-auto rounded-md'>Show all</button>
                                                
                                            </div>
                                        </div>
                                        <div className='flex gap-16 justify-center items-center'>
                                            <div className='flex flex-col items-center gap-3'>
                                                <h2 className='font-montserrat text-xl'>Session progress</h2>
                                                <ProgressCircle className='relative' value={stats?.progressionProgressStats.levelStats[stats?.currentProgressionLevel].bestScorePercent} size="xl" strokeWidth={16} showAnimation>
                                                    <span className="text-sm font-medium font-montserrat text-slate-700 dark:text-sky-100">{`${stats?.progressionProgressStats.levelStats[stats?.currentProgressionLevel].bestScorePercent}%`}</span>
                                                </ProgressCircle>
                                            </div>
                                            <div className='flex flex-col gap-1 items-center bg-slate-600/30 rounded-xl p-6 font-montserrat max-w-96'>
                                                <h2 className='text-center text-lg'>Current session information</h2>
                                                <div className='flex flex-wrap gap-4 text-sm font-light'>
                                                    <p>{`Length: ${stats?.progressionProgressStats.levelStats[stats?.currentProgressionLevel].info.length}`}</p>
                                                    <p>{`Progression length: ${stats?.progressionProgressStats.levelStats[stats?.currentProgressionLevel].info.progression_length}`}</p>
                                                </div>
                                                <div className='flex gap-3'>
                                                    <p className='text-sm'>Directions:</p>
                                                    <p className='text-sm font-light'>{stats?.progressionProgressStats.levelStats[stats?.currentProgressionLevel].info.inversions.map((inversion, index) => index === stats?.progressionProgressStats.levelStats[stats?.currentProgressionLevel].info.inversions.length - 1 ? inversion : ` ${inversion} - `)}</p>
                                                </div>
                                                </div>
                                        </div>
                                        
                                    </div> :
                                    <p className='text-center mt-3'>No data available</p>
                                }
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                    
                </div>
            </div>
            {showFullProgress === 'interval' && <FullProgress type='interval' levelStats={stats?.intervalProgressStats.levelStats} current={stats?.currentIntervalLevel} close={() => setShowFullProgress(false)}/>}
            {showFullProgress === 'progression' && <FullProgress type='progression' levelStats={stats?.progressionProgressStats.levelStats} current={stats?.currentProgressionLevel} close={() => setShowFullProgress(false)}/>}
        </div>
    )
}

export default HomePageAuth