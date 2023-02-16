import React, { useState } from 'react'
import axios from 'axios'
import * as Tabs from '@radix-ui/react-tabs'

const LoginRegForm = ({ appState, setOpen }) => {
  const { user, setUser } = appState
  
    const [ registerUsername, setRegisterUsername ] = useState()
    const [ registerEmail, setRegisterEmail ] = useState()
    const [ registerPassword, setRegisterPassword ] = useState()
    const [ registerPasswordConfirm, setRegisterPasswordConfirm ] = useState()
    const [ registerErrors, setRegisterErrors ] = useState({})

  const [ loginEmail, setLoginEmail ] = useState()
  const [ loginPassword, setLoginPassword ] = useState()
  const [ loginErrors, setLoginErrors ] = useState({})

  const register = e => {
    axios.post(`${process.env.REACT_APP_AUTH_URI}/api/register`,
      {username: registerUsername, email: registerEmail, password: registerPassword, password_confirm: registerPasswordConfirm}
    ).then(res => {
      const data = res.data.data
      if (res.data.status==='success') {
        setRegisterErrors({})
        localStorage.setItem('username', data.username)
        localStorage.setItem('username', data.email)
        setUser({...user, username: data.username, email: data.email})
      } else {
        console.log(data.errors)
        setRegisterErrors(data.errors)
      }
    }).catch(err => console.log(err))
  }

  const login = e => {
    axios.post(`${process.env.REACT_APP_AUTH_URI}/api/login`,
      {email: loginEmail, password: loginPassword}
    ).then(res => {
      const data = res.data.data
      if (res.data.status==='success') {
        setLoginErrors({})
        localStorage.setItem('username', data.username)
        localStorage.setItem('username', data.email)
        setUser({...user, username: data.username, email: data.email})
      } else {
        setLoginErrors(data.errors)
      }
    }).catch(err => console.log(err))
  }

  const logout = e => {
    axios.get(`${process.env.REACT_APP_AUTH_URI}/api/logout`, {withCredentials: true})
    .then(res => {
      if (res.data.status==='success') {
        localStorage.clear()
        setUser({})
      }
    }).catch(err => console.log(err))
  }
  
  return (
    <Tabs.Root
    className="flex flex-col"
    defaultValue="tab1"
    >
      <Tabs.List className="shrink-0 flex border-b border-mauve6" aria-label="Manage your account">
        <Tabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-cyan11 data-[state=active]:text-cyan11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative outline-none cursor-default"
          value="tab1"
        >
          Login
        </Tabs.Trigger>
        <Tabs.Trigger
          className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-cyan11 data-[state=active]:text-cyan11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative outline-none cursor-default"
          value="tab2"
        >
          Register
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        value="tab1"
        className="grow p-5 bg-white rounded-b-md outline-none"
      >
        { user.username ? <>
            <div className='mb-4 text-center text-mauve11 text-[15px] leading-normal'>Hello, {user.username}</div>
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
            <div className="mt-5 flex justify-between items-center">
              <div className="text-red-600 font-medium text-[13px] leading-normal">{loginErrors.credentials && loginErrors.credentials}</div>
              <button className="inline-flex items-center justify-center rounded px-[15px] text-[15px] leading-none font-medium h-[35px] bg-green4 text-green11 hover:bg-green5 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default" onClick={() => login()}>
                Login
              </button>
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