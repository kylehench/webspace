import { useState } from 'react';
import Grid from './components/Grid';
import LoginRegButton from './components/LoginRegButton';
import NotepadButton from './components/NotepadButton';

function App() {
  const [ user, setUser ] = useState({
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
  })
  const [ widgets, setWidgets ] = useState()

  const appState = { user, setUser, widgets, setWidgets }
  
  return (
    <div className={`flex h-screen bg-cover mx-auto bg-center`} style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/img/ocean.jpg")`}} >
      <div className='flex flex-col justify-start py-2 pl-2'>
        <LoginRegButton appState={appState} />
        <NotepadButton appState={appState} />
      </div>
      <div className='flex-1 overflow-y-auto'>
        <Grid />
      </div>
      {/* <div className='p-10 bg-orange-100'></div> */}
    </div>
  );
}

export default App;