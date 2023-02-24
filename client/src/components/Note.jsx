import React, { useEffect, useRef, useState } from 'react'
import GridItem from './primitives/GridItem'
import axios from 'axios'

const Note = ({ widgetProps, appState }) => {

  const [ syncTimeoutId, setSyncTimeoutId ] = useState(0)
  const [ title, setTitle ] = useState('')
  const [ content, setContent ] = useState('')

  const noteRef = useRef({title: '', content: ''})

  // load note if id present, otherwise post new note
  useEffect(() => {
    if (widgetProps.id) {
      // load note
      axios.get(`/api/notes/${widgetProps.id}`)
        .then(res => {
          const note = res.data.note
          setTitle(note.title)
          setContent(note.content)
          noteRef.current = note
        })
    } else {
      // post new note, save note id
      axios.post('/api/notes', { title, content })
        .then(res => widgetProps.id = res.data)
    }
  }, [])

  const titleChange = (value) => {
    setTitle(value)
    noteRef.current.title = value
    syncHandler()
  }
  const contentChange = (value) => {
    setContent(value)
    noteRef.current.content = value
    syncHandler()
  }
  
  // syncs note with server
  const syncHandler = () => {
    if (syncTimeoutId) clearTimeout(syncTimeoutId)
    setSyncTimeoutId(setTimeout(() => {
      if (widgetProps.id) {
        axios.put(`/api/notes/${widgetProps.id}`, {
          title: noteRef.current.title,
          content: noteRef.current.content
        })

        // update title in NoteList
        appState.setNoteList(appState.noteList.map((note, i) => {
          if (i===widgetProps.noteListIdx) {
            note.title = noteRef.current.title
          }
          return note
        }))
      }
    }, 1500))
  }
  
  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      title={title}
      titleChange={titleChange}
      appState={appState}
    >
      <div className='h-full overflow-hidden rounded-md'>
        <textarea
          className='p-3 bg-transparent text-slate-800 text-sm outline-0 block h-full w-full resize-none'
          onChange={(e) => contentChange(e.target.value)}
          value={content}
          maxLength={1e4}
        ></textarea>
      </div>
    </GridItem>
  )
}

export default Note