import React from 'react'
import ButtonPopover from './primitives/ButtonPopover'
import { FaRegStickyNote } from 'react-icons/fa'
import { BsPlusCircle } from 'react-icons/bs'
import ScrollArea from './primitives/ScrollArea'

// const TAGS = []
const TAGS = Array.from({ length: 1 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

const NotepadButton = () => {
  
  
  return (
    <ButtonPopover
      icon={<FaRegStickyNote />}
      closeButton={false}
    >
      <ScrollArea
        height={TAGS.length < 8 ? 'auto' : '360px'}
      >
        <div className="py-[15px] px-5">
          <button className="flex items-center text-cyan11 text-[15px] leading-[18px] font-medium">
            <BsPlusCircle />
            <span className='ml-1'>Create new note</span>
          </button>
          <div className="text-mauve11 text-[13px] leading-[18px] mt-2.5 pt-2.5 border-t border-t-mauve8">
            Open note
          </div>
          {TAGS.map((tag) => (
            <div
              className="text-cyan11 text-[15px] leading-[18px] font-medium mt-1.5 pt-2.5 border-t border-t-mauve5"
              key={tag}
            >
              {tag}
            </div>
          ))}
        </div>
      </ScrollArea>
    </ButtonPopover>
  )
}

export default NotepadButton