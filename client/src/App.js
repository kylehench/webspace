import { useState } from 'react';
import Grid from './components/Grid';
import LoginRegButton from './components/LoginRegButton';
import NoteButton from './components/NoteButton';
import colors from 'tailwindcss/colors'

function App() {
  const [ user, setUser ] = useState({
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
  })
  const [ widgets, setWidgets ] = useState([
      {
        type: 'note',
        id: 'a',
        title: 'DRAG ME',
        content: 'asdfasdfasdfasdfasdfasdfasdfa'
      },
      {
        type: 'note',
        id: 'b',
        title: 'DRAG ME',
      },
      {
        type: 'note',
        id: 'c',
      }
  ])

  const appState = { user, setUser, widgets, setWidgets }
  
  return (
    <div className={`flex h-screen bg-cover mx-auto bg-center`} style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/img/ocean_xl.jpg")`}}>
      {/* <div>{JSON.stringify(widgets)}</div> */}
      <div className='flex flex-col justify-start py-2 pl-2'>
        <LoginRegButton appState={appState} />
        <NoteButton appState={appState} />
      </div>
      <div className='flex-1 overflow-y-auto'>
        <Grid appState={appState} />
      </div>
      {/* <div className='p-10 bg-orange-100'></div> */}
    </div>
  );
}

export default App;