import React from 'react'
import * as RScrollArea from '@radix-ui/react-scroll-area'


const ScrollArea = ({ children, style }) => {
  return (
    <RScrollArea.Root
      className={`h-full w-full overflow-hidden`}
      style={style}
    >
      <RScrollArea.Viewport className="w-full h-full rounded">
        {children}
      </RScrollArea.Viewport>
      <RScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <RScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </RScrollArea.Scrollbar>
      <RScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-blackA6 transition-colors duration-[160ms] ease-out hover:bg-blackA8 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <RScrollArea.Thumb className="flex-1 bg-mauve10 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </RScrollArea.Scrollbar>
      <RScrollArea.Corner className="bg-blackA8" />
  </RScrollArea.Root>
  )
}

export default ScrollArea