import {useEffect,useState} from 'react'
import axios from 'axios'

const Watchlist=({investor})=>{

    const [ticker,setTicker]=useState('')
    const [watchlistItems,setWatchlistItems]=useState([])
    const handleChange=(e)=>{setTicker(e.target.value)}
    const fillWatchlist=async ()=>{
        const res=await axios.get(`${process.env.REACT_APP_MONGO_DB}/api/watchlist/read/${investor.watchlists[0]}`)
        let tempArray=Array()
        for(let symbol in res.data.symbols.reverse()){
            try{
            const watchlistData=await axios.post(
                `${process.env.REACT_APP_POSTGRESQL_DB}/api/equity/historical`,{ticker:res.data.symbols[symbol],period:'d'})
            let sym=watchlistData.data[0].symbol
            let close=watchlistData.data[0].close
            tempArray.push({[`${sym}`]:close.toFixed(2)})
            }catch(error){console.log(error)}
        } 
        setWatchlistItems(tempArray)
    } 
    useEffect(()=>{
        fillWatchlist()
    },[])
    const addTickerToWatchlist=async (e)=>{
        console.log(`${process.env.REACT_APP_MONGO_DB}/api/watchlist/update/${investor.watchlists[0]}`)
        const res=await axios.put(`${process.env.REACT_APP_MONGO_DB}/api/watchlist/update/${investor.watchlists[0]}`,{ticker})
        console.log(res)
        fillWatchlist()
    }

    return(
        <div id='watchlist'>
            <div className='watchlist-item'>
                <button 
                    onClick={(e)=>{addTickerToWatchlist(e)}}
                    id='watchlist-button'>
                    +
                </button>
                <input id='watchlist-input'
                    onChange={handleChange}
                    name='ticker'
                    type='ticker'
                    placeholder=''
                    required
                ></input>
            </div>
            {watchlistItems.map((item)=>(
                <div className='watchlist-item'>
                    <div>{Object.keys(item)}</div> 
                    <div>{Object.values(item)}</div> 
                </div>
                 
            ))}
  
        </div>
    )
}
export default Watchlist