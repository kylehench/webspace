import { useState } from 'react';
import LoginReg from './components/LoginReg';
import ResponsiveGrid from './components/ResponsiveGrid';

function App() {
  const [ user, setUser ] = useState({
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
  })

  const appState = { user, setUser }
  
  return (
    <div className={`flex h-screen bg-cover mx-auto bg-center`} style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/img/ocean.jpg")`}} >
      <div className='flex flex-col justify-start py-2 pl-2'>
        <LoginReg appState={appState} />
      </div>
      <div className='flex-1 overflow-y-auto'>
        <ResponsiveGrid />
      </div>
      {/* <div className='p-10 bg-orange-100'></div> */}
    </div>
  );
}

export default App;