import React from 'react'
import ButtonTooltip from './primitives/ButtonTooltip'
import { GrBlockQuote } from "react-icons/gr";

const QuoteButton = ({ appState }) => {
  const { setLayout, widgetsDispatch } = appState

  const addQuote = () => {
    const reactId = Math.random().toString()
    widgetsDispatch({type: "CREATE", payload: {
      type: 'quote',
      reactId
    }})
    setLayout(layout => [...layout, {
      w: 1,
      h: 2,
      x: 0,
      y: 0,
      i: reactId
    }])
  }
  
  return (
    <ButtonTooltip
      icon={<GrBlockQuote />}
      hoverText='Inspirational Quote'
      side='right'
      onClick={addQuote}
    />
  )
}

export default QuoteButton