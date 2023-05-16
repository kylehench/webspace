import React from 'react'
import Tooltip from './Tooltip'

const GridItemTitleButton = ({ hoverText, onClick, children }) => {
  return (
    <Tooltip text={hoverText} side='bottom'>
      <button 
        className='h-7 w-7 flex items-center justify-center text-gray-800   hover:bg-gray-800/10'
        onClick={onClick}
      >
        {children}
      </button>
    </Tooltip>
  )
}

export default GridItemTitleButton