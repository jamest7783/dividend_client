import axios from 'axios'
import {useState,useEffect, useDebugValue} from 'react'
import {Line} from 'react-chartjs-2'
const Chart=require('chart.js/auto')
 
const Charts=({investor})=>{

    const [temp,setTemp]=useState('')
    const [mainSymbol,setMainSymbol]=useState('TSLA')
    const [order,setOrder]=useState({date:'',numShares:0,pricePerShare:0,portfolioId:0,ticker:''})
    const handleChange=(e)=>{setOrder({...order,[e.target.name]:e.target.value})}
    const handleSymbol=(e)=>{
        e.preventDefault()
        setTemp(e.target.value )
    }
    const handleSubmitSymbol=(e)=>{
        e.preventDefault()
        setMainSymbol(temp)
    }
    const handleSubmit=async (e)=>{
        e.preventDefault()
        const res=await axios.post(`${process.env.REACT_APP_POSTGRESQL_DB}/api/order/create`,order)
    }
    const [mainChartData,setMainChartData]=useState({labels:[],datasets:[{label:'',data:[0],pointRadius:0,backgroundColor:'blue'}]})
    const [options,setoptions]=useState({
        scales: {x:{grid:{display:false},ticks:{maxRotation:0,minRotation:0}},y:{grid:{display:false}}},
        plugins:{legend:{display:false}}
    })
    const [optionsMini,setoptionsMini]=useState({
        scales: {x:{grid:{display:false},ticks:{maxRotation:0,minRotation:0}},y:{grid:{display:false}}},
        // plugins:{legend:{display:false}}
    })
    const [scrollChartData,setScrollChartData]=useState([])
    useEffect(()=>{
        let tkr=mainSymbol
        const getMainChartData=async ()=>{
            let data={labels:[],datasets:[{label:'',data:[],pointRadius:0,}]}
            const res=await axios.post(`${process.env.REACT_APP_POSTGRESQL_DB}/api/equity/historical`,{ticker:mainSymbol,period:'d'})
            data.datasets[0].label=tkr 
            let count=0
            res.data.reverse().map((period)=>{
                count%4===0?data.labels.push(period.date.substring(5,10)):data.labels.push('')
                count++
            // data.labels.push(period.date.substring(5,10))
                data.datasets[0].data.push(period.close) 
            })
            setMainChartData(data)
            setOrder({...order,
                date:data.labels[data.labels.length-1],
                numShares:0,
                pricePerShare:data.datasets[0].data[data.datasets[0].data.length-1],
                portfolioId:investor?investor.portfolios[0]:0,
                ticker:tkr
            })
        }
        const getScrollChartData=async ()=>{
            let scrollData=[]
            let tickers=['AAPL','F','AMC','GE','OCGN']
            tickers.map((tkr)=>{
                scrollData.push({labels:[],datasets:[{label:'',data:[],pointRadius:0}]})
            })
            const res=await axios.post(
            `${process.env.REACT_APP_POSTGRESQL_DB}/api/equity/historical/batch`,{
                tickers,
                period:'w'
            })
            Object.keys(res.data).map((tkr,i)=>{
                scrollData[i].datasets[0].label=tkr
                res.data[tkr].map((period)=>{
                    scrollData[i].labels.push(period.date.substring(5,10))
                    scrollData[i].datasets[0].data.push(period.close)
                })
            })
            setScrollChartData(scrollData)
        }
        getMainChartData()
        getScrollChartData()
    },[mainSymbol])
    return(
        <div id='glass'>
            <div id='chart'>
                <div id='chart-search-bar'>
                    <input onChange={handleSymbol} id='main-chart-sym' placeholder='TSLA'/>  
                    <button id='chart-button' onClick={(e)=>{handleSubmitSymbol(e)}}>view</button>
                </div>
                <Line id='main-chart'
                data={mainChartData} options={options}/>
            </div>
            <div id='indicators'></div>
            <div id='charts'>
                {scrollChartData.map((unit)=>(
                    <div className='mini-chart'>
                        <Line data={unit} options={optionsMini}
                        />
                    </div>
                ))}
            </div>
            <div id='trade-bar-container'>
                    <div id='cost-estimate'>
                        {mainChartData.datasets[0].data[mainChartData.datasets[0].data.length-1].toFixed(2)} x 
                        <input 
                        id='order-numShares'
                        onChange={handleChange}
                        name='numShares'
                        type='numShares'
                        placeholder='quantity'
                        value={order.numShares}
                    />=  
                    </div>
                    <div>
                        {(mainChartData.datasets[0].data[mainChartData.datasets[0].data.length-1]*order.numShares).toFixed(2)}
                        <button 
                        id='order-submit'
                        onClick={(e)=>{handleSubmit(e)}}>
                        Submit
                    </button>
                    </div>   
            </div>
        </div>
    )
}
export default Charts