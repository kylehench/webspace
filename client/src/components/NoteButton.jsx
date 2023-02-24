import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ButtonPopover from './primitives/ButtonPopover'
import { FaRegStickyNote } from 'react-icons/fa'
import { BsPlusCircle } from 'react-icons/bs'
import ScrollArea from './primitives/ScrollArea'

const NoteButton = ({ appState }) => {
  const { noteList, setNoteList, user, widgets, setWidgets } = appState

  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    // if user is signed in, get ids and titles of their notes
    if (user.username) {
      axios.get('/api/notes')
        .then(res => setNoteList(res.data))
        .catch(err => console.log(err))
    }
  }, [])

  const addNote = (id, noteListIdx) => {
    setWidgets([...widgets, {
      id,
      noteListIdx,
      user_id: user.user_id,
      type: 'note',
      react_id: Math.random()
    }])
  }
  
  return (
    <ButtonPopover
      icon={<FaRegStickyNote />}
      closeButton={false}
      open={open}
      setOpen={setOpen}
    >
      <ScrollArea
        height={noteList.length < 8 ? 'auto' : '360px'}
      >
        <div className="py-[15px] px-5">
          
          {/* create new note button */}
          <button
            className="flex items-center text-cyan11 text-[15px] leading-[18px] font-medium"
            onClick={() => {
                setOpen(false)
                addNote()
              }
            }
          >
            <BsPlusCircle />
            <span className='ml-2'>Create new note</span>
          </button>

          <div className="text-mauve11 text-[13px] leading-[18px] mt-2.5 pt-2.5 border-t border-t-mauve8">
            Open note
          </div>
          {noteList.map((note, i) => (
            <div
              className="text-cyan11 text-[15px] leading-[18px] font-medium mt-1.5 pt-2.5 border-t border-t-mauve5"
              key={note.id}
            >
              <button
                className='h-6 w-[160px] text-left truncate overflow-hidden'
                onClick={() => {
                  addNote(note.id, i)
                  setOpen(false)
                }}
              >
                {note.title ? note.title : '(untitled)'}
              </button>
              
            </div>
          ))}
        </div>
      </ScrollArea>
    </ButtonPopover>
  )
}

export default NoteButton