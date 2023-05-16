import React from 'react'
import ButtonTooltip from './primitives/ButtonTooltip'
import { GrBlockQuote } from "react-icons/gr";

const QuoteButton = ({ appState }) => {
  const { layoutDispatch, widgetsDispatch } = appState

  const addQuote = () => {
    const reactId = Math.random().toString()
    widgetsDispatch({type: "CREATE", payload: {
      type: 'quote',
      reactId
    }})
    layoutDispatch({type: "CREATE", payload: {i: reactId, h: 2}})
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