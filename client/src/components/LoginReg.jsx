import React, { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Cross2Icon } from '@radix-ui/react-icons'
import { FiUser } from "react-icons/fi"
import LoginRegForm from './LoginRegForm';

const LoginReg = ({ appState }) => {
  const [open, setOpen] = useState(false)
  
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-cyan11 bg-white shadow-[0_2px_10px] shadow-blackA7 hover:bg-cyan3 cursor-default outline-none"
          aria-label="Update dimensions"
        >
          <FiUser />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="m-2 rounded px-4 pt-4 w-[360px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >
          <LoginRegForm appState={appState} setOpen={setOpen} />
          <Popover.Close
            className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-cyan11 absolute top-[5px] right-[5px] hover:bg-cyan4 focus:shadow-[0_0_0_2px] focus:shadow-cyan7 outline-none cursor-default"
            aria-label="Close"
          >
            <Cross2Icon />
          </Popover.Close>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default LoginReg;