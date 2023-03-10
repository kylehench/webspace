import React from 'react'
import ButtonTooltip from './primitives/ButtonTooltip'
import { GrBlockQuote } from "react-icons/gr";

const QuoteButton = ({ appState }) => {
  const { widgetsDispatch } = appState

  const addQuote = () => {
    widgetsDispatch({type: "CREATE", payload: {
      type: 'quote'
    }})
    console.log(appState.widgets);
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