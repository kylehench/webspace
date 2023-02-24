import React, { useState } from 'react'
import colors from 'tailwindcss/colors'
import { IoCloseOutline } from "react-icons/io5";
import Tooltip from './Tooltip';

const GridItem = ({ widgetProps, title, titleChange, appState, children }) => {
  const { widgets, setWidgets } = appState

  const closeWidget = () => {
    setWidgets(widgets.filter((widget, i) => i !== widgetProps.widgetIdx))
  }
  
  return (
    <>
      <div className="grid-item__title flex justify-between items-center h-8 rounded-t-md"
        style={{backgroundColor: widgetProps.titleBgColor}}
      >
        <div className='w-10'>{widgetProps.titleLeft}</div>
        <div className='flex-1 min-h-[20px]'>
          <input
            type="text"
            className="bg-transparent font-medium text-sm outline-0 text-slate-800 text-ellipsis block text-center w-full p-1"
            placeholder="Title"
            value={title}
            onChange={(e) => titleChange(e.target.value)}
            maxLength={100}
          />
        </div>
        <div className='flex justify-end'>
          <div>{widgetProps.titleRight}</div>

          {/* close button */}
          <Tooltip text={'Close'}>
            <button 
              className='h-8 w-8 rounded-tr-md  hover:bg-gray-800/10'
              onClick={() => closeWidget()}
            >
              <IoCloseOutline 
                className='mx-auto' 
                color={colors.gray[500]} 
                size={20} 
              />
            </button>
          </Tooltip>

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