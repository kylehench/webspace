import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ButtonPopover from './primitives/ButtonPopover'
import { FaRegStickyNote } from 'react-icons/fa'
import { BsPlusCircle } from 'react-icons/bs'
import ScrollArea from './primitives/ScrollArea'

// const TAGS = []
const TAGS = Array.from({ length: 1 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

const NoteButton = ({ appState }) => {
  const { user, widgets, setWidgets } = appState

  const [notes, setNotes] = useState([])
  
  useEffect(() => {
    // if user is signed in, get ids and titles of their notes
    if (user.username) {
      axios.get('/api/notes')
        .then(res => setNotes(res.data))
        .catch(err => console.log(err))
    }
  }, [user])

  const addNewNote = () => {

    setWidgets([...widgets, {
      type: 'note',
      id: undefined
    }])
  }
  
  return (
    <ButtonPopover
      icon={<FaRegStickyNote />}
      closeButton={false}
    >
      <ScrollArea
        height={TAGS.length < 8 ? 'auto' : '360px'}
      >
        <div className="py-[15px] px-5">
          <button
            className="flex items-center text-cyan11 text-[15px] leading-[18px] font-medium"
            onClick={() => addNewNote()}
          >
            <BsPlusCircle />
            <span className='ml-2'>Create new note</span>
          </button>
          <div className="text-mauve11 text-[13px] leading-[18px] mt-2.5 pt-2.5 border-t border-t-mauve8">
            Open note
          </div>
          {notes.map((note) => (
            <div
              className="text-cyan11 text-[15px] leading-[18px] font-medium mt-1.5 pt-2.5 border-t border-t-mauve5"
              key={note.id}
            >
              <button>{note.title}</button>
              
            </div>
          ))}
        </div>
      </ScrollArea>
    </ButtonPopover>
  )
}

export default NoteButton