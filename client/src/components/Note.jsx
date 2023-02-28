import React, { useEffect, useRef, useState } from 'react'
import GridItem from './primitives/GridItem'
import axios from 'axios'
import colors from 'tailwindcss/colors'
import { IoTrashOutline } from "react-icons/io5"

const colorsList = [
  [colors.yellow[100], colors.yellow[300]],
  [colors.green[100], colors.green[300]],
  [colors.blue[100], colors.blue[300]],
  [colors.purple[100], colors.purple[300]],
  [colors.pink[100], colors.pink[300]],
  [colors.gray[100], colors.gray[300]],
]


const Note = ({ widgetProps, appState }) => {

  const { noteListDispatch, widgetsDispatch } = appState

  const [ title, setTitle ] = useState('')
  const [ content, setContent ] = useState('')
  
  const [ syncTimeoutId, setSyncTimeoutId ] = useState(0)

  // load note if id present, otherwise post new note
  useEffect(() => {
    if (widgetProps.noteId) {
      // load note
      axios.get(`/api/notes/${widgetProps.noteId}`)
        .then(res => {
          const note = res.data.note
          setTitle(note.title)
          setContent(note.content)
          widgetsDispatch({type: "UPDATE", reactId: widgetProps.reactId, payload: {
            titleBgColor: note.titleBgColor,
            contentBgColor: note.contentBgColor
          }})
        })
    } else {
      // post new note, save note id
      axios.post('/api/notes', { title, content })
        .then(res => {
          noteListDispatch({type: "CREATE", payload: {
            id: res.data, title, content
          }})
          widgetsDispatch({type: "UPDATE", reactId: widgetProps.reactId, payload: {noteId: res.data}})
        })
    }
  }, [])

  const titleChange = (value) => {
    setTitle(value)
    syncHandler({title: value})
  }
  const contentChange = (value) => {
    setContent(value)
    syncHandler({content: value})
  }
  const colorChange = (newData) => {
    syncHandler(newData)
    widgetsDispatch({
      type: "UPDATE",
      reactId: widgetProps.reactId,
      payload: newData
    })
  }
  
  // syncs note with server
  const syncHandler = (newData) => {
    if (syncTimeoutId) clearTimeout(syncTimeoutId)
    setSyncTimeoutId(setTimeout(() => {
      if (widgetProps.noteId) {
        const newProps = {title, content, ...newData}
        axios.put(`/api/notes/${widgetProps.noteId}`, newProps)
        noteListDispatch({
          type: "UPDATE",
          id: widgetProps.noteId,
          payload: newProps
        })
      }
    }, 1500))
  }
  
  // delete note
  const deleteNote = () => {
    axios.delete(`/api/notes/${widgetProps.noteId}`)
      .then(res => {
        noteListDispatch({
          type: "DELETE",
          id: widgetProps.noteId,
        })
        widgetsDispatch({type: "DELETE_BY_NOTE_ID", noteId: widgetProps.noteId})
      }).catch(err => console.log(err))
  }
  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      title={title}
      titleChange={titleChange}
      appState={appState}
      optionsPane={
        <div className=''>

          {/* background color selector */}
          <div className='flex'>
            {colorsList.map(([contentBgColor, titleBgColor], i) => {
              const buttonStyle = {}
              if (i===0) buttonStyle.borderTopLeftRadius = '4px'
              if (i===colorsList.length-1) buttonStyle.borderTopRightRadius = '4px'
              return <button 
                  className='py-4 flex-1'
                  style={{...buttonStyle, backgroundColor: titleBgColor}}
                  key={i}
                  onClick={() => colorChange({contentBgColor, titleBgColor})}
                ></button>
            }
            )}
          </div>

          {/* delete note */}
          <button className="flex items-center px-12 text-center mx-auto justify-center rounded-b text-[15px] leading-none font-medium h-[35px] bg-red5 text-red11 hover:bg-red7 outline-none cursor-default" onClick={() => deleteNote()}>
            <IoTrashOutline /><div className='pl-2'>Delete</div>
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