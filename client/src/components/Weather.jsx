import { useState, useEffect } from 'react'
import axios from 'axios'
import GridItem from './primitives/GridItem'

const Weather = ({ appState, widgetProps }) => {
  const { widgetsDispatch } = appState

  return (
    <GridItem
      widgetProps={{...widgetProps}}
      appState={appState}
      titleLeft={<div className='px-6'></div>}
      title='Weather'
    >
      hello, weather
    </GridItem>
  )
}

export default Weather