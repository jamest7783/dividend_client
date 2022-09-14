import axios from 'axios'
import {useEffect,useState} from 'react'


const Positions=({investor})=>{

    const [positions,setPositions]=useState([])

    useEffect(()=>{
        
        const getPositions=async ()=>{
            console.log(investor.portfolios[0])
            const res=await axios.get(`${process.env.REACT_APP_POSTGRESQL_DB}/api/portfolio/read/${investor.portfolios[0]}/positions`)
            setPositions(res.data)
        }
        getPositions()
    },[])


    return(
        <div id='positions'>
            <div id='position-container'>
                <div id='position-title'>Positions</div>
                    <div id='positions-columns'>
                        <p>Symbol</p>
                        <p>Position</p> 
                        <p>Average Price</p> 
                        <p>Current Price</p> 
                        <p>Capital Gains</p>
                    </div>
                {Object.keys(positions)?.map((pos)=>(
                    <div id='position'>
                        <p>{pos.toUpperCase()}</p>
                        <p>{positions[pos].numShares}</p> 
                        <p>{positions[pos].avgPricePerShare.toFixed(2)}</p> 
                        <p>{positions[pos].currentPrice.toFixed(2)}</p> 
                        <p>{(positions[pos].numShares*(positions[pos].currentPrice-positions[pos].avgPricePerShare)).toFixed(2)}</p> 
                    </div>
                ))}
            </div>
        </div>
    )
}
export default Positions