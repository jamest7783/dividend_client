import {useEffect,useState} from 'react'
import axios from 'axios'

const News=()=>{

    const [query,setQuery]=useState('')
    const [news,setNews]=useState([])
    const handleChange=(e)=>{setQuery({query:e.target.value})}
    const requestNews=async ( )=>{
        const res=await axios.post(`${process.env.REACT_APP_MONGO_DB}/api/watchlist/news`,query)
        setNews(res.data.items)
    }


    return(
        <div id='glass'>
            <div id='news-search-container'>
                <button id='news-search-button'
                    onClick={(e)=>{requestNews()}}>
                    search
                </button>
                <input id='news-search-input'          
                    onChange={handleChange}
                    name='search'
                    type='search'
                    placeholder='search'
                ></input>
            </div>
            <div id='news'>
                {news?.map((article)=>(
                    <div id='tile'>
                        <div>{article.title}</div>
                        <button 
                            // onClick={(e)=>{}}
                        >{article.link}</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default News