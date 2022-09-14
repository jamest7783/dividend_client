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
    useEffect(()=>{requestNews()},[])
    const link=(path)=>{window.open(path,'_blank')}


    return(
        <div id='glass'>
            <div id='news-container'>
                <div id='news-search-container'>
                    <input id='news-search-input'          
                        onChange={handleChange}
                        name='search'
                        type='search'
                        placeholder=''
                    ></input>
                    <button id='news-search-button'
                        onClick={(e)=>{requestNews()}}>
                        search
                    </button>
                </div>
               
                    {news?.map((article)=>(
                        <div id='tile'>
                            <div id='news-source'>{article.title.split('-')[1]}</div>
                            <div id='article-title'>{article.title.split('-')[0]}</div>
                            <button 
                                id='news-link'
                                onClick={(e)=>{link(article.link)}}
                            >Go to Article</button>
                        </div>
                    ))}
                 
            </div>
        </div>
    )
}
export default News