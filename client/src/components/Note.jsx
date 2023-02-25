import React, { useEffect, useRef, useState } from 'react'
import GridItem from './primitives/GridItem'
import axios from 'axios'
import { IoTrashOutline } from "react-icons/io5"

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

        appState.noteListDispatch({
          type: "UPDATE_ONE",
          id: widgetProps.id,
          payload: {
            title: noteRef.current.title,
            content: noteRef.current.content
          }
        })
      }
    }, 1500))
  }
  
  // delete note
  const deleteNote = () => {
    axios.delete(`/api/notes/${widgetProps.id}`)
      .then(res => {
        appState.noteListDispatch({
          type: "DELETE_ONE",
          id: widgetProps.id,
        })
        appState.setWidgets(widgets => {
          widgets = widgets.filter(widget => !(widget.type==='note' && widget.id===widgetProps.id))
          return widgets
        })
      }).catch(err => console.log(err))
  }
  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      title={title}
      titleChange={titleChange}
      appState={appState}
      optionsPane={
        <div className='p-4'>
          Customize Color

          {/* delete note */}
          <button className="px-[15px] mt-3 block items-center text-center mx-auto justify-center rounded text-[15px] leading-none font-medium h-[35px] bg-red4 text-red11 hover:bg-red6  outline-none cursor-default" onClick={() => deleteNote()}>
            <IoTrashOutline />
          </button>

        </div>
      }
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