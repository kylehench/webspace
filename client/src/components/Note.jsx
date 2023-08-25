import { useEffect, useState } from 'react'
import GridItem from './primitives/GridItem'
import axios from 'axios'
import colors from 'tailwindcss/colors'
import { IoTrashOutline, IoSync } from "react-icons/io5"
import TaskList from './TaskList'

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

  const [ checkboxesVisible, setCheckboxesVisible ] = useState(false)
  const [ checked, setChecked ] = useState('')
  
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
          setCheckboxesVisible(note.checkboxes_visible)
          setChecked(note.checked || '')
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

  const updateTitle = (value) => {
    setTitle(value)
    syncHandler({title: value})
  }
  const updateContent = (value) => {
    setContent(value)
    syncHandler({content: value})
  }
  const updateCheckboxesVisible = (value) => {
    setCheckboxesVisible(value)
    setChecked('')
    syncHandler({checkboxes_visible: value, checked: ''})
  }
  const updateColor = (newData) => {
    syncHandler(newData)
    widgetsDispatch({
      type: "UPDATE",
      reactId: widgetProps.reactId,
      payload: newData
    })
  }
  
  // syncs note with server
  const [ syncDataQueue, setSyncDataQueue ] = useState({}) // used to save data in canceled or unsuccessful sync event
  const syncHandler = (newData) => {
    if (syncTimeoutId) clearTimeout(syncTimeoutId)
    newData = {...syncDataQueue, ...newData}
    setSyncDataQueue(newData)
    setSyncTimeoutId(setTimeout(() => {
      if (widgetProps.noteId && !widgetProps.noSync) {
        newData = {contentBgColor: widgetProps.contentBgColor, titleBgColor: widgetProps.titleBgColor, ...newData}
        axios.patch(`${import.meta.env.VITE_SERVER_URI}/api/notes/${widgetProps.noteId}`, newData)
          .then(() => {
            setSyncTimeoutId(0)
            setSyncDataQueue({})
          })
        noteListDispatch({
          type: "UPDATE",
          id: widgetProps.noteId,
          payload: newData
        })
      }
    }, 1500))
  }

  // delete note
  const deleteNote = () => {
    if (user.id) {
      axios.delete(`${import.meta.env.VITE_SERVER_URI}/api/notes/${widgetProps.noteId}`)
        .then(() => {
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

  // toggle checkboxes
  const toggleCheckboxes = () => {
    updateCheckboxesVisible(!checkboxesVisible)
  }
  
  return (
    <GridItem
      widgetProps={{...widgetProps}}
      title={title}
      titleChange={loading ? null : updateTitle}
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
                onClick={() => updateColor({contentBgColor, titleBgColor})}
              ></button>
            }
            )}
          </div>

          {/* show/hide checkboxes */}
          <button className="flex items-center px-4 text-center mx-auto justify-center text-[15px] leading-none font-medium h-[35px] w-full bg-gray5 text-gray11 hover:bg-gray7 outline-none cursor-default" onClick={toggleCheckboxes}>
          <div className='pl-2'>{ checkboxesVisible ? "Hide" : "Show"} Checkboxes</div>
          </button>
          {/* delete note */}
          <button className="flex items-center px-4 text-center mx-auto justify-center rounded-b text-[15px] leading-none font-medium h-[35px] w-full bg-red5 text-red11 hover:bg-red6 outline-none cursor-default" onClick={deleteNote}>
            <IoTrashOutline /><div className='pl-2'>Delete</div>
          </button>

        </div>
      }
    >

      <div className='h-full thin-scrollbar-parent'>
        
        
        { (loading && !widgetProps.noSync) ?
          <div
            className='h-full p-3 bg-transparent text-slate-800 text-sm outline-0'
          >{content}</div>
        :
          ( checkboxesVisible ?
            <div className="h-full overflow-auto thin-scrollbar">
              <TaskList
                content={content}
                setContent={setContent}
                checked={checked}
                syncHandler={syncHandler}
              />
            </div>
          :
            <textarea
              className='h-full p-3 bg-transparent text-slate-800 text-sm outline-0 block w-full resize-none thin-scrollbar overflow-auto'
              onChange={(e) => updateContent(e.target.value)}
              value={content}
              maxLength={1e4}
              disabled={widgetProps.noSync}
            ></textarea>
          )
        }

        
      </div>
      
    </GridItem>
  )
}

Note.propTypes = {
  widgetProps: Object,
  appState: Object
}

export default Note