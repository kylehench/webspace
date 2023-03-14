import React, { useState, useEffect } from 'react'
import GridItem from './primitives/GridItem'
import axios from 'axios'

const Quote = ({ appState, widgetProps }) => {
  const [quote, setQuote] = useState({})

  useEffect(() => {
    if (widgetProps.id) {
      axios.get(`${process.env.REACT_APP_SERVER_URI}/api/quotes/${widgetProps.id}`)
        .then(res => setQuote(res.data.quote))
    } else {
      axios.get(`${process.env.REACT_APP_SERVER_URI}/api/quotes/today`)
        .then(res => setQuote(res.data.quote))
    }
  }, [])
  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      appState={appState}
      title='Daily Quote'
    >
      {quote.text && 
        <div className='px-8 pb-4 h-full flex flex-col justify-center font-[Lora] text-lg'>
          <div className=''>
            {quote.text}
          </div>
          <div className="mt-2 flex justify-end items-end font-semibold">
            <span className='text-[16px]'>- {quote.author ? quote.author : 'Unknown'}</span>
          </div>
        </div>
      }
    </GridItem>
  )
}

export default Quote