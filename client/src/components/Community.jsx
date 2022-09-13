import {useState,useEffect} from 'react'
import axios from 'axios'

const Community=({investor})=>{

    const [threads,setThreads]=useState([])
    const [insights,setInsights]=useState([])

    const getThreads=async ()=>{
        const res=await axios.get(`${process.env.REACT_APP_MONGO_DB}/api/thread/all`)
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
        
    const [form,setForm]=useState({name:'',symbol:'',tag:'',textBody:''})
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
                <div className='trending-tile'></div>
                <div className='trending-tile'></div>
                <div className='trending-tile'></div>
                <div className='trending-tile'></div>
                <div className='trending-tile'></div>
            </div>
            <div id='thread-container'>
                <div id='threads'>
                    <div id='thread-nav'>
                        <div id='thread-search'>
                            <input id='thread-search-input'></input>
                            <button className='thread-button'>search</button>
                            <button className='thread-button'>top</button>
                            <button className='thread-button'>hot</button>
                        </div>
                    </div>
                    {threads.map((thread)=>(
                        <div id='thread'>
                            <div id='thread-form'>
                                <div id='thread-name'>{thread.name}</div>
                                <div > 
                                    <button>upVote</button>
                                    <button>downVote</button>
                                </div>
                                <div>
                                    <button onClick={(e)=>{createReply(e,thread._id)}}>
                                        reply
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
                                <div>{thread.textBody}</div>
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
                                placeholder='tag'
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
                                onClick={(e)=>{handleSubmit(e)}}
                                >create thread
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