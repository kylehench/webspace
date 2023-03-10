import React from 'react'
import GridItem from './primitives/GridItem'

const Quote = ({ appState, widgetProps }) => {
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      appState={appState}
      title='Inspiring Quote'
    >
      well hello
    </GridItem>
  )
}

export default Quote