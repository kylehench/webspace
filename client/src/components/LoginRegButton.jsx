import React from 'react'
import { FiUser } from 'react-icons/fi'
import LoginRegForm from './LoginRegForm'
import ButtonPopover from './primitives/ButtonPopover'

const LoginRegButton = ({ appState }) => {
  return (
    <ButtonPopover icon={<FiUser />}>
      <LoginRegForm appState={appState} />
    </ButtonPopover>
  )
}

export default LoginRegButton