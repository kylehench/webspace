import React, { useState, useEffect } from 'react'
import axios from 'axios'
import GridItem from './primitives/GridItem'
import GridItemTitleButton from './primitives/GridItemTitleButton'

import { IoPin, IoPinOutline, IoRefresh } from 'react-icons/io5'

const Quote = ({ appState, widgetProps }) => {
  const { widgetsDispatch } = appState
  const [quote, setQuote] = useState({})

  useEffect(() => {
    if (widgetProps.pin && widgetProps.id) {
      axios.get(`${process.env.REACT_APP_SERVER_URI}/api/quotes/${widgetProps.id}`)
        .then(res => setQuote(res.data.quote))
      } else {
        axios.get(`${process.env.REACT_APP_SERVER_URI}/api/quotes/today`)
        .then(res => setQuote(res.data.quote))
      }
    }, [])

  const setPin = (pin) => {
    // pin is boolean
    widgetsDispatch({type: "UPDATE", reactId: widgetProps.reactId, payload: {id: quote.id, pin}})
  }
    
  const getRandomQuote = () => {
    axios.get(`${process.env.REACT_APP_SERVER_URI}/api/quotes/random`)
      .then(res => setQuote(res.data.quote))
    setPin(false)
  }
  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      appState={appState}
      titleLeft={<div className='px-6'></div>}
      title='Daily Quote'
      titleRight={
        <div className='flex items-center'>

          {/* pin quote button */}
          <GridItemTitleButton
            hoverText='Pin quote'
            onClick={() => setPin(!widgetProps.pin)}
          >
            {widgetProps.pin ? <IoPin /> : <IoPinOutline className='opacity-80' />}
          </GridItemTitleButton>

          {/* new quote button */}
          <GridItemTitleButton
            hoverText='New quote'
            onClick={getRandomQuote}
          >
            <IoRefresh className='rotate-45' />
          </GridItemTitleButton>

        </div>
      }
    >
      {quote.text && 
        <div className='px-8 pb-2 h-full flex flex-col justify-center font-[Lora] text-lg'>
          <div className=''>
            {quote.text}
          </div>
          <div className="flex justify-end items-end font-semibold">
            <span className='text-[16px]'>- {quote.author ? quote.author : 'Unknown'}</span>
          </div>
        </div>
      }
    </GridItem>
  )
}

export default Quote