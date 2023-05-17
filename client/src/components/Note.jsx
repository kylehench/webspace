import React, { useEffect, useState } from 'react'
import GridItem from './primitives/GridItem'
import ScrollArea from './primitives/ScrollArea'
import axios from 'axios'
import colors from 'tailwindcss/colors'
import { IoTrashOutline } from "react-icons/io5"
import { IoSync } from "react-icons/io5"

const colorsList = [
  [colors.yellow[100], colors.yellow[300]],
  [colors.green[100], colors.green[300]],
  [colors.blue[100], colors.blue[300]],
  [colors.purple[100], colors.purple[300]],
  [colors.pink[100], colors.pink[300]],
  [colors.gray[100], colors.gray[300]],
]


const Note = ({ widgetProps, appState }) => {

  const { noteListDispatch, widgetsDispatch, user } = appState

  const [ title, setTitle ] = useState('')
  const [ content, setContent ] = useState('')
  
  const [ loading, setLoading ] = useState(true)
  const [ syncTimeoutId, setSyncTimeoutId ] = useState(0)

  // load note if id present, otherwise post new note
  useEffect(() => {
    if (widgetProps.noteId) {
      // load note
      axios.get(`${import.meta.env.VITE_SERVER_URI}/api/notes/${widgetProps.noteId}`)
        .then(res => {
          const note = res.data.note
          setTitle(note.title)
          setContent(note.content)
          widgetsDispatch({type: "UPDATE", reactId: widgetProps.reactId, payload: {
            titleBgColor: note.titleBgColor,
            contentBgColor: note.contentBgColor
          }})
          setLoading(false)
        })
    } else if (user.id && !widgetProps.noSync) {
      // post new note, save note id
      axios.post(`${import.meta.env.VITE_SERVER_URI}/api/notes`, { title, content })
      .then(res => {
        noteListDispatch({type: "CREATE", payload: {
          id: res.data, title, content
        }})
        widgetsDispatch({type: "UPDATE", reactId: widgetProps.reactId, payload: {noteId: res.data}})
        setLoading(false)
      })
    } else {
      if (widgetProps.content) {
        setTitle(widgetProps.title)
        setContent(widgetProps.content)
      } else {
        setContent('Please sign in or enter as guest to continue.')
      }
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
      if (widgetProps.noteId && !widgetProps.noSync) {
        const newProps = {title, content, contentBgColor: widgetProps.contentBgColor, titleBgColor: widgetProps.titleBgColor, ...newData}
        axios.put(`${import.meta.env.VITE_SERVER_URI}/api/notes/${widgetProps.noteId}`, newProps)
          .then(() => {
            setSyncTimeoutId(0)
          })
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
    if (user.id) {
      axios.delete(`${import.meta.env.VITE_SERVER_URI}/api/notes/${widgetProps.noteId}`)
        .then(res => {
          noteListDispatch({
            type: "DELETE",
            id: widgetProps.noteId,
          })
          widgetsDispatch({type: "DELETE_BY_NOTE_ID", noteId: widgetProps.noteId})
        }).catch(err => console.log(err))
    } else {
      widgetsDispatch({type: "DELETE", reactId: widgetProps.reactId})
    }
  }
  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      title={title}
      titleChange={loading ? null : titleChange}
      titleLeft={
        <IoSync className={`w-7 text-slate-500 animate-spin transition-opacity duration-700 ${((!loading && syncTimeoutId===0) || widgetProps.noSync) && 'opacity-0'}`} />
      }
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

      <div className='h-full mr-[3px]'>
        { loading && !widgetProps.noSync ?
          <div
            className='h-full p-3 bg-transparent text-slate-800 text-sm outline-0'
          >{content}</div>
        :
          <textarea
            className='h-full p-3 thin-scrollbar bg-transparent text-slate-800 text-sm outline-0 block w-full resize-none overflow-auto'
            onChange={(e) => contentChange(e.target.value)}
            value={content}
            maxLength={1e4}
            disabled={widgetProps.noSync}
          ></textarea>
          // <div
          //   className='h-full p-3 bg-transparent text-slate-800 text-sm outline-0 block w-full resize-none'
          //   onInput={(e) => {
          //       console.log(e.target.innerText)
          //       contentChange(e.target.innerText)
          //     }}
          //   contentEditable
          //   maxLength={1e4}
          //   // disabled={widgetProps.noSync}
          // >{content}</div>
        }

        {/* {
          content.split("\n").map((string, i) => <input type="text" value={string} onKeyDown={e => {
            console.log(e.key)
            console.log(e.target.selectionStart, e.target.selectionEnd)
          }} />)
        } */}
      </div>
      
    </GridItem>
  )
}

export default Note