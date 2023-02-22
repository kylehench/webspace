import React, { useState } from 'react'
import Note from '../Note'

const GridItem = ({ widget, appState, key }) => {
  const widgetTypeMap = {
    'note': <Note widget={widget} appState={appState} />,
  }
  
  return (
    <>
      <div className="grid-item__title flex justify-between p-1 rounded-t-md"
        style={{backgroundColor: widget.titleBgColor}}
      >
        <div className='w-10'>{widget.titleLeft}</div>
        <div className='flex-1 min-h-[20px]'>
          <input type="text" className="bg-transparent text-sm focus:border-blue outline-0 text-ellipsis block text-center w-full p-2.5" placeholder="Title" />
        </div>
        <div className='w-10 flex justify-end'>
          <div>{widget.titleRight}</div>
        </div>
      </div>
      <div
        className='text flex-1 overflow-hidden rounded-md'
        style={{backgroundColor: widget.contentBgColor}}
      >
        {widgetTypeMap[widget.type]}
      </div>
    </>
  )
}

export default GridItem