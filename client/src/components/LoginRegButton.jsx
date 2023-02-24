import React from 'react'
import { FiUser } from 'react-icons/fi'
import LoginRegForm from './LoginRegForm'
import ButtonPopover from './primitives/ButtonPopover'
import Tooltip from './primitives/Tooltip'

const LoginRegButton = ({ appState }) => {
  return (
    <Tooltip text={'Login/Registration'} side={'right'}>
      <ButtonPopover icon={<FiUser />}>
        <LoginRegForm appState={appState} />
      </ButtonPopover>
    </Tooltip>


  )
}

export default LoginRegButton