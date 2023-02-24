import React from 'react'
import * as RTooltip from '@radix-ui/react-tooltip'

// note: Tooltip.Provider (global functionality) wraps App in index.js

const Tooltip = ({ text, side, children, toolTipOpen, setToolTipOpen }) => {
  return (
    <RTooltip.Root
      open={toolTipOpen}
      onOpenChange={setToolTipOpen}
    >
      <RTooltip.Trigger asChild>
        <span>
          {children}
        </span>
      </RTooltip.Trigger>
      <RTooltip.Portal>
        <RTooltip.Content
          className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-slate-800 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]"
          side={side}
          sideOffset={5}
        >
          {text}
          <RTooltip.Arrow className="fill-white" />
        </RTooltip.Content>
      </RTooltip.Portal>
    </RTooltip.Root>
  )
}

export default Tooltip