import React, { useState } from 'react'
import { FiUser } from 'react-icons/fi'
import LoginRegForm from './LoginRegForm'
import ButtonPopover from './primitives/ButtonPopover'

const LoginRegButton = ({ appState }) => {
  const [open, setOpen] = useState(false)
  
  return (
      <ButtonPopover 
        icon={<FiUser />}
        open={open}
        setOpen={setOpen}
        hoverText='Account'
      >
        <LoginRegForm appState={appState} />
      </ButtonPopover>
  )
}

export default LoginRegButton