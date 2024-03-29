import React, { useEffect, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Cross2Icon } from '@radix-ui/react-icons'
import Tooltip from './Tooltip'

const ButtonPopover = ({ hoverText, icon, styled, children, side, closeButton, open, setOpen, arrow}) => {

  const [toolTipOpen, setToolTipOpen ] = useState(false)
  const [ tooltipDisabled, setTooltipDisabled ] = useState(false)
  
  // note: open and setOpen refer to Popover status
  useEffect(() => {
    if (open) setTooltipDisabled(true)
    else setTimeout(() => setTooltipDisabled(false), 200)
  }, [open])

  return (
    <Tooltip 
      text={hoverText} 
      side={side}
      toolTipOpen={open || tooltipDisabled ? false : toolTipOpen}
      setToolTipOpen={open || tooltipDisabled ? () => {} : setToolTipOpen}
    >
      <Popover.Root
        open={open}
        onOpenChange={setOpen}
      >
        <Popover.Trigger asChild>
          <button
            className={styled===false ? '' : 'my-2 rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-cyan11 bg-white shadow-[0_2px_10px] shadow-blackA7 hover:bg-cyan3 cursor-default outline-none'}
            aria-label="Popover"
          >
            {icon}
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className={`m-2 rounded bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade`}
            side={side}
            sideOffset={2}
          >
            {children}
            {closeButton &&
              <Popover.Close
                className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-cyan11 absolute top-[5px] right-[5px] hover:bg-cyan4 outline-none cursor-default z-[2]"
                aria-label="Close"
              >
                <Cross2Icon />
              </Popover.Close>
            }
            { arrow !== false &&
              <Popover.Arrow className="fill-white m-[-0.5px]" />
            }
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </Tooltip>
  )
}

ButtonPopover.defaultProps = {
  side: 'right',
  closeButton: true,
}

export default ButtonPopover;