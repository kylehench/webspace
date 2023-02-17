import React, { useState } from 'react'
import Note from '../Note'

const GridItem = ({ widget }) => {
  const widgetTypeMap = {
    'note': <Note widget={widget} />,
  }
  
  return (
    <>
      <div className="grid-item__title flex justify-between p-1 rounded-t-md"
        style={{backgroundColor: widget.titleBgColor}}
      >
        <div className='flex-1'>{widget.titleLeft}</div>
        <div className='flex-2 min-h-[20px]'>{widget.title}</div>
        <div className='flex-1 flex justify-end'>
          <div>{widget.titleRight}</div>
          <div>{widget.titleRight}</div>
        </div>
      </div>
      <div
        className='text'
        style={{backgroundColor: widget.contentBgColor}}
      >
        {widgetTypeMap[widget.type]}
      </div>
    </>
  )
}

export default GridItem