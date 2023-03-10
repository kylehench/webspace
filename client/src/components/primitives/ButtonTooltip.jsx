import React from 'react'
import Tooltip from './Tooltip'

const ButtonTooltip = ({ hoverText, icon, styled, side, onClick}) => {
  
  return (
    <Tooltip
      text={hoverText}
      side={side}
    >
      <button
        className={styled===false ? '' : 'my-2 rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-cyan11 bg-white shadow-[0_2px_10px] shadow-blackA7 hover:bg-cyan3 cursor-default outline-none'}
        aria-label="Update dimensions"
        onClick={onClick}
      >
        {icon}
      </button>
    </Tooltip>
  )
}

export default ButtonTooltip