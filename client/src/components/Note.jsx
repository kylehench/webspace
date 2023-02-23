import React, { useEffect, useRef, useState } from 'react'
import GridItem from './primitives/GridItem'
import axios from 'axios'

const Note = ({ widgetProps, appState }) => {

  const [ syncTimeoutId, setSyncTimeoutId ] = useState(0)
  const [ title, setTitle ] = useState('')
  const [ content, setContent ] = useState('')
  const titleRef = useRef(title)
  const contentRef = useRef(content)

  const thisState = { title, content }

  // load note if id present, otherwise post new note
  useEffect(() => {
    if (widgetProps.id) {
      // load note
      axios.get(`/api/notes/${widgetProps.id}`)
        .then(res => {
          setTitle(res.data.note.title)
          setContent(res.data.note.content)
        })
    } else {
      // post new note, save note id
      axios.post('/api/notes', { title, content })
        .then(res => widgetProps.id = res.data)
    }
  }, [])

  const titleChange = (value) => {
    setTitle(t => value)
    syncHandler()
  }
  const contentChange = (value) => {
    setContent(c => value)
    syncHandler()
  }
  
  // syncs note with server
  const syncHandler = () => {
    if (syncTimeoutId) clearTimeout(syncTimeoutId)
    setSyncTimeoutId(setTimeout(() => {
      if (widgetProps.id) {
        console.log(title)
        console.log(content)
        axios.put(`/api/notes/${widgetProps.id}`, {
          title: title,
          content: content
        })
      }
    }, 1500))
  }
  
  
  return (

    <GridItem widgetProps={{...widgetProps}} title={title} titleChange={titleChange}>
      <div className='h-full overflow-hidden rounded-md'>
        <textarea
          className='p-3 bg-transparent text-sm outline-0 block h-full w-full resize-none'
          onChange={(e) => contentChange(e.target.value)}
          value={content}
        ></textarea>
      </div>
    </GridItem>
    



  )
}

export default Note