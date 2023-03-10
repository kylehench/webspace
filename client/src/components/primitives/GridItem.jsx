import React, { useState } from 'react'
import colors from 'tailwindcss/colors'
import { IoCloseOutline, IoEllipsisHorizontal } from "react-icons/io5";
import Tooltip from './Tooltip';
import ButtonPopover from './ButtonPopover';

const GridItem = ({ widgetProps, title, titleChange, titleRight, titleLeft, optionsPane, appState, children }) => {
  const { widgetsDispatch } = appState

  const [ optionsOpen, setOptionsOpen ] = useState()
  
  const closeWidget = () => {
    widgetsDispatch({type: "DELETE", reactId: widgetProps.reactId})
  }
  
  return (
    <>
      <div className="grid-item__title flex justify-between items-center h-7 rounded-t-md slideUpAndFade transition-colors"
        style={{backgroundColor: widgetProps.titleBgColor}}
      >
        <div className='w-14'>{titleLeft}</div>
        <div className='flex-1 min-h-[20px]'>

          {/* title */}
          { titleChange ? 
            <input
              type="text"
              className="bg-transparent font-medium text-sm outline-0 text-slate-800 text-ellipsis block text-center w-full p-1"
              placeholder="Title"
              value={title}
              onChange={(e) => titleChange(e.target.value)}
              maxLength={100}
            />
          :
            <div className="bg-transparent font-medium text-sm outline-0 text-slate-800 text-ellipsis block text-center w-full p-1 cursor-default">{title}</div>
          }

        </div>
        <div className='flex justify-end'>
          {titleRight}

          {/* options pane */}
          { optionsPane ?
            <div
              className='flex justify-center items-center h-7 w-7 hover:bg-gray-800/10'
            >
              <ButtonPopover
                icon={<IoEllipsisHorizontal 
                  className='mx-auto mt-1.5' 
                  color={colors.gray[600]} 
                  size={20}
                />}
                hoverText='Options'
                styled={false}
                open={optionsOpen}
                setOpen={setOptionsOpen}
                side='bottom'
                closeButton={false}
                arrow={false}
              >
                {optionsPane}
              </ButtonPopover>
            </div>
            :
            <div className='w-7'></div>
          }

          {/* close button */}
          <Tooltip text={'Close'} side='bottom'>
            <button 
              className='h-7 w-7 rounded-tr-md  hover:bg-gray-800/10'
              onClick={() => closeWidget()}
            >
              <IoCloseOutline 
                className='mx-auto' 
                color={colors.gray[600]} 
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