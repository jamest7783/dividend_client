import {useState,useEffect} from 'react'
import axios from 'axios'
import {Line} from 'react-chartjs-2'
const Chart=require('chart.js/auto')

const Community=({investor,scrollChartData})=>{

    const [optionsMini,setoptionsMini]=useState({
        scales: {x:{grid:{display:false},ticks:{maxRotation:0,minRotation:0}},y:{grid:{display:false}}},
    })
    const [threads,setThreads]=useState([])
    const [insights,setInsights]=useState([])
    console.log(scrollChartData)

    const getThreads=async ()=>{
        const res=await axios.get(`${process.env.REACT_APP_MONGO_DB}/api/thread/all`)
        const author=await axios.get(`${process.env.REACT_APP_MONGO_DB}/api/investor/all`)
        setThreads(res.data)
    }
    const getInsights=async()=>{
        const res=await axios.get(`${process.env.REACT_APP_MONGO_DB}/api/insight/all`)
        setInsights(res.data)
    }
    useEffect(()=>{
        getThreads()
        getInsights()
    },[])
        
    const [form,setForm]=useState({name:'',symbol:'',tag:'',textBody:'',author:investor._id})
    const [insight,setInsight]=useState({text:'',thread:0})

    const handleInsight=(e)=>{setInsight({...insight,[e.target.name]:e.target.value})}
    const handleChange=(e)=>{setForm({...form,[e.target.name]:e.target.value})}
    const createReply=async (e,thread)=>{
        e.preventDefault()
        setInsight({...insight,author:investor._id,thread})
        const res=await axios.post(`${process.env.REACT_APP_MONGO_DB}/api/insight/create`,insight)
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const res=await axios.post(`${process.env.REACT_APP_MONGO_DB}/api/thread/create`,form)
        getThreads()
        getInsights()
    }
  

    return(
        <div id='glass'>
            <div id='trending'>
                {scrollChartData.map((unit)=>(
                    <div className='trending-tile'>
                        <div id='community-chart'>
                            <div>{unit.datasets[0].data[unit.datasets[0].data.length-1].toFixed(2)}</div>
                            <Line data={unit} options={optionsMini}/>
                        </div>
                    </div>
                ))}
                {scrollChartData.map((unit)=>(
                    <div className='trending-tile'>
                        <div id='community-chart'>
                            <div>{unit.datasets[0].data[unit.datasets[0].data.length-1].toFixed(2)}</div>
                            <Line data={unit} options={optionsMini}/>
                        </div>
                    </div>
                ))}
            </div>
            <div id='thread-container'>
                <div id='threads'>
                       <div id='thread-nav'>
                        <div id='thread-search'>
                            <input id='thread-search-input'></input>
                            <button className='thread-button'>Search</button>
                            <button className='thread-button'>Top</button>
                            <button className='thread-button'>Hot</button>
                        </div>
                    </div>
                    {threads.map((thread)=>(
                        <div id='thread'>

                            <div id='thread-form'>
                                <div id='thread-name'>{thread.name}</div>
                                <div id='thread-name'>{thread.author}</div>
                                <div id='thread-body'>{thread.textBody}</div>
                                <div id='reply-container'>
                                    <button 
                                        id='reply-button'
                                        onClick={(e)=>{createReply(e,thread._id)}}>
                                        Reply
                                    </button>
                                    <textarea
                                        id='text'
                                        onChange={handleInsight}
                                        name='text'
                                        type='text'
                                        placeholder=''
                                        value={insight.value}
                                    ></textarea>   
                                </div>
                                    {insights?.map((insight)=>(
                                        insight.thread===thread._id &&
                                        <div>{insight.text}</div>
                                    ))}
                            </div> 

                        </div>
                    ))}
                </div>
                <div id='top-performers'>
                    <div id='create-thread'>
                        <form id='create-thread-form'>
                            <input
                                onChange={handleChange}
                                name='name'
                                type='name'
                                placeholder='thread title'
                                value={form.value}
                                required
                            ></input>
                            <input
                                onChange={handleChange}
                                name='symbol'
                                type='symbol'
                                placeholder='symbol'
                                value={form.value}
                                required
                            ></input>
                            <input
                                onChange={handleChange}
                                name='tag'
                                type='tag'
                                placeholder='tags'
                                value={form.value}
                                required
                            ></input>
                            <textarea
                                id='text-body'
                                onChange={handleChange}
                                name='textBody'
                                type='textBody'
                                placeholder=''
                                value={form.value}
                                required
                            ></textarea>
                            <button 
                                id='create-thread-button'
                                onClick={(e)=>{handleSubmit(e)}}
                                >Create Thread
                            </button>
                        </form>
                    </div>
                    <div className='top-performer'></div>
                    <div className='top-performer'></div>
                </div>
            </div>

        </div>
    )
}
export default Community