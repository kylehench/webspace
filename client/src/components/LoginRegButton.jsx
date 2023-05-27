import { useState, useEffect } from 'react'
import { FiUser } from 'react-icons/fi'
import LoginRegForm from './LoginRegForm'
import ButtonPopover from './primitives/ButtonPopover'
import axios from 'axios'

const LoginRegButton = ({ appState }) => {
  const [open, setOpen] = useState(false)

  // request token (jwt) renewal if expiration present in localStorage
  useEffect(() => {
    const token_expires = localStorage.getItem('webspace_token_expires')
    if (token_expires) {
      const expires = new Date(token_expires)
      // request token renewal if within 21 days of expiration
      if (expires.getTime() < new Date().getTime() + 21*24*60*60*1000) {
        axios.post(`${import.meta.env.VITE_AUTH_URI}/api/renew-token`)
          .then(res => {
            const data = res.data.data
            localStorage.setItem('webspace_token_expires', data.token_expires)
          })
          .catch(err => console.log(err))
      }
    }
  },[])
  
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