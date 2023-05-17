import { useReducer, useState } from 'react';
import layoutReducer from './reducers/LayoutReducer';
import widgetsReducer from './reducers/WidgetsReducer';
import noteListReducer from './reducers/NoteListReducer';
import Grid from './components/Grid';
import LoginRegButton from './components/LoginRegButton';
import NoteButton from './components/NoteButton';
import QuoteButton from './components/QuoteButton';
import BackgroundButton from './components/BackgroundButton';

function App() {
  const [ user, setUser ] = useState({
    id: localStorage.getItem('webspace_user_id'),
    username: localStorage.getItem('webspace_username'),
    email: localStorage.getItem('webspace_email'),
  })
  // note: background images are prefetched in index.html > head
  const [backgroundImage, setBackgroundImage] = useState(localStorage.getItem('webspace_backgroundImage') || 'ocean-lg')
  const [layout, layoutDispatch] = useReducer(
    layoutReducer,
    JSON.parse(localStorage.getItem('webspace_layout')) || []
  )
  const [widgets, widgetsDispatch] = useReducer(
    widgetsReducer,
    JSON.parse(localStorage.getItem('webspace_widgets')) || []
  )
  const [noteList, noteListDispatch] = useReducer(noteListReducer, [])

  const appState = {
    user, setUser,
    backgroundImage, setBackgroundImage,
    layout, layoutDispatch,
    widgets, widgetsDispatch,
    noteList, noteListDispatch,
  }
  
  
  return (
    <div className={`pr-1 flex h-screen bg-cover mx-auto bg-center transition-all`} style={{ backgroundImage: `url("${import.meta.env.BASE_URL}/img/${backgroundImage}.jpg")`}}>
      <div className='flex flex-col justify-start py-2 pl-2'>
        <LoginRegButton appState={appState} />
        <BackgroundButton appState={appState} />
        <NoteButton appState={appState} />
        <QuoteButton appState={appState} />
      </div>
      <div className='flex-1 overflow-y-auto thin-scrollbar'>
        <Grid appState={appState} />
      </div>
    </div>
  );
}

export default App
