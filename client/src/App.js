import { useState } from 'react';
import Grid from './components/Grid';
import LoginRegButton from './components/LoginRegButton';
import NoteButton from './components/NoteButton';
import Tooltip from './components/primitives/Tooltip';

function App() {
  const [ user, setUser ] = useState({
    id: localStorage.getItem('user_id'),
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
  })
  const [widgets, setWidgets] = useState([])
  const [noteList, setNoteList] = useState([])

  const appState = {
    user, setUser,
    widgets, setWidgets,
    noteList, setNoteList,
  }
  
  
  return (
    <div className={`flex h-screen bg-cover mx-auto bg-center transition-all`} style={{ backgroundImage: `url("${process.env.PUBLIC_URL}/img/ocean.jpg")`}}>
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