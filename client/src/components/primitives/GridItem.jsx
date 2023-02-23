import React, { useState } from 'react'
import Note from '../Note'

const GridItem = ({ widgetProps, title, titleChange, children }) => {
  
  return (
    <>
      <div className="grid-item__title flex justify-between p-1 rounded-t-md"
        style={{backgroundColor: widgetProps.titleBgColor}}
      >
        <div className='w-10'>{widgetProps.titleLeft}</div>
        <div className='flex-1 min-h-[20px]'>
          <input
            type="text"
            className="bg-transparent text-sm focus:border-blue outline-0 text-ellipsis block text-center w-full p-1"
            placeholder="Title"
            value={title}
            onChange={(e) => titleChange(e.target.value)}
          />
        </div>
        <div className='w-10 flex justify-end'>
          <div>{widgetProps.titleRight}</div>
        </div>
      </div>
      <div
        className='text flex-1 overflow-hidden rounded-md'
        style={{backgroundColor: widgetProps.contentBgColor}}
      >
        {children}
      </div>
    </>
  )
}

export default GridItem