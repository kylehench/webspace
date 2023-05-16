import React, { useState } from 'react'
import axios from 'axios'
import * as Tabs from '@radix-ui/react-tabs'
import Button from './primitives/Button'

const LoginRegForm = ({ appState }) => {
  const { user, setUser, widgetsDispatch, layoutDispatch } = appState
  
  const [ registerUsername, setRegisterUsername ] = useState()
  const [ registerEmail, setRegisterEmail ] = useState()
  const [ registerPassword, setRegisterPassword ] = useState()
  const [ registerPasswordConfirm, setRegisterPasswordConfirm ] = useState()
  const [ registerErrors, setRegisterErrors ] = useState({})

  const [ loginEmail, setLoginEmail ] = useState()
  const [ loginPassword, setLoginPassword ] = useState()
  const [ loginErrors, setLoginErrors ] = useState({})

  const [ activeTab, setActiveTab ] = useState('tab1')

  const register = (username=registerUsername, email=registerEmail, password=registerPassword, password_confirm=registerPasswordConfirm) => {
    axios.post(`${process.env.REACT_APP_AUTH_URI}/api/register`,
      {username, email, password, password_confirm}
    ).then(res => {
      const data = res.data.data
      console.log(res)
      if (res.data.status==='success') {
        setRegisterErrors({})
        localStorage.setItem('webspace_user_id', data.user_id)
        localStorage.setItem('webspace_username', data.username)
        localStorage.setItem('webspace_email', data.email)
        setUser({...user, id: data.user_id, username: data.username, email: data.email})
        setActiveTab('tab1')
        layoutDispatch({type: "CLEAR"})
        widgetsDispatch({type: "CLEAR"})
      } else {
        console.log(data.errors)
        setRegisterErrors(data.errors)
      }
    }).catch(err => console.log(err))
  }

  const login = () => {
    axios.post(`${process.env.REACT_APP_AUTH_URI}/api/login`,
      {email: loginEmail, password: loginPassword}
    ).then(res => {
      const data = res.data.data
      if (res.data.status==='success') {
        setLoginErrors({})
        localStorage.setItem('webspace_user_id', data.user_id)
        localStorage.setItem('webspace_username', data.username)
        localStorage.setItem('webspace_email', data.email)
        setUser({...user, id: data.user_id, username: data.username, email: data.email})
        layoutDispatch({type: "CLEAR"})
        widgetsDispatch({type: "CLEAR"})
      } else {
        setLoginErrors(data.errors)
      }
    }).catch(err => console.log(err))
  }
  
  const registerGuest = () => {
    const rand = Math.floor(Math.random()*(1e7)).toString()
    register(
      `guest_${rand}`,
      `guest_${rand}@guest.guest`,
      `guest_${rand}@guest.guest`,
      `guest_${rand}@guest.guest`
      )
    }
    
    const logout = e => {
      axios.get(`${process.env.REACT_APP_AUTH_URI}/api/logout`, {withCredentials: true})
      .then(res => {
        if (res.data.status==='success') {
          localStorage.removeItem('webspace_user_id')
          localStorage.removeItem('webspace_username')
          localStorage.removeItem('webspace_email')
          localStorage.removeItem('webspace_widgets')
          localStorage.removeItem('webspace_layout')
          setUser({})
          layoutDispatch({type: "CLEAR"})
          widgetsDispatch({type: "CLEAR"})
        }
    }).catch(err => console.log(err))
  }

  // vertical bar used to cover rendering artifacts
  const verticalBar = () => <div 
      className='mx-[-1px] mb-[1px] w-[2px] bg-white z-[1]'
    ></div>
  
  return (
    <Tabs.Root
      className="flex flex-col p-4 w-72 md:w-96"
      // class:transform-gpu mitigates inset-shadow rendering issue
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Account">

      {verticalBar()}

        <Tabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-cyan11 data-[state=active]:text-cyan11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:relative outline-none cursor-default"
          value="tab1"
        >
          Login
        </Tabs.Trigger>

        {verticalBar()}

        <Tabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-cyan11 data-[state=active]:text-cyan11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:relative outline-none cursor-default"
          value="tab2"
        >
          Register
        </Tabs.Trigger>

        {verticalBar()}

      </Tabs.List>
      <Tabs.Content
        value="tab1"
        className="grow pt-5 bg-white rounded-b-md outline-none"
      >
        { user.username ? <>
            <div className='mb-4 text-center text-mauve11 text-[15px] leading-normal'>Hello, {user.username.slice(0,5)==='guest' ? 'guest' : user.username}.<br/>You are logged in.</div>
            <button className="px-[15px] mb-4 block items-center text-center mx-auto justify-center rounded text-[15px] leading-none font-medium h-[35px] bg-red4 text-red11 hover:bg-red5 focus:shadow-[0_0_0_2px] focus:shadow-red7 outline-none cursor-default" onClick={() => logout()}>
              Logout
            </button>
          </> : <>
            <p className="mb-5 text-mauve11 text-[15px] leading-normal">
              Enter your email and password.
            </p>
            <fieldset className="mb-[15px] w-full flex flex-col justify-start">
              <label className="text-[13px] leading-none mb-2.5 text-cyan12 block" htmlFor="loginEmail">
                Email
              </label>
              <input
                className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none"
                id="loginEmail"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </fieldset>
            <fieldset className="mb-[15px] w-full flex flex-col justify-start">
              <label className="text-[13px] leading-none mb-2.5 text-cyan12 block" htmlFor="loginPassword">
                Password
              </label>
              <input
                className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none"
                id="loginPassword"
                type="password"
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </fieldset>
            <div className="text-red-600 font-medium text-[13px] leading-normal">{loginErrors.credentials && loginErrors.credentials}</div>
            <div className="mt-5 flex justify-between items-center">
              <Button 
                onClick={registerGuest}
                color='gray'
              >
                Guest Login
              </Button>
              <Button onClick={login}>Login</Button>
            </div>
          </>
        }
      </Tabs.Content>
      <Tabs.Content
        value="tab2"
        className="grow p-5 bg-white rounded-b-md outline-none"
      >
        <p className="mb-5 text-mauve11 text-[15px] leading-normal">
          Create a new account.
        </p>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-cyan12 block"
            htmlFor="registerUsername"
          >
            Username
          </label>
          <div className="mb-2 text-red-600 font-medium text-[13px]">{registerErrors.username && registerErrors.username}</div>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none"
            id="registerUsername"
            onChange={(e) => setRegisterUsername(e.target.value)}
          />
        </fieldset>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-cyan12 block"
            htmlFor="registerEmail"
          >
            Email
          </label>
          <div className="mb-2 text-red-600 font-medium text-[13px]">{registerErrors.email && registerErrors.email}</div>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none"
            id="registerEmail"
            onChange={(e) => setRegisterEmail(e.target.value)}
          />
        </fieldset>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-cyan12 block"
            htmlFor="registerPassword"
          >
            Password
          </label>
          <div className="mb-2 text-red-600 font-medium text-[13px]">{registerErrors.password && registerErrors.password}</div>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none"
            id="registerPassword"
            type="password"
            onChange={(e) => setRegisterPassword(e.target.value)}
          />
        </fieldset>
        <fieldset className="mb-[15px] w-full flex flex-col justify-start">
          <label
            className="text-[13px] leading-none mb-2.5 text-cyan12 block"
            htmlFor="registerPasswordConfirm"
          >
            Confirm password
          </label>
          <input
            className="grow shrink-0 rounded px-2.5 text-[15px] leading-none text-cyan11 shadow-[0_0_0_1px] shadow-cyan7 h-[35px] focus:shadow-[0_0_0_2px] focus:shadow-cyan8 outline-none"
            id="registerPasswordConfirm"
            type="password"
            onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
          />
        </fieldset>
        <div className="flex justify-end mt-5">
          <button className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default" onClick={() => register()}>
            Create account
          </button>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  )
}

export default LoginRegForm