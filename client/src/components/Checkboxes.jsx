import { useEffect, useRef, useState } from 'react'
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { current } from 'tailwindcss/colors'

const getRandomId = () => Math.random().toString().slice(2)

const Checkboxes = ({ widgetProps, content, setContent }) => {
  const textRef = useRef(content.split('\n').map(line => {
    return {reactId: getRandomId(),
      content: line
    }
  }))
  const inputRefs = useRef([])
  const [ textArray, setTextArray ] = useState(
    textRef.current.map(({reactId}) => {
      return {
        reactId,
        checked: false,
      }
    })
  )
  const [ focusIndex, setFocusIndex ] = useState(0)
  const [ syncTimeoutId, setSyncTimeoutId ] = useState(0)

  // sets checkbox focus when focusIndex is modified
  useEffect(() => {
    inputRefs[focusIndex].focus()
    // inputRefs[i+1].setSelectionRange(2,4)
  }, [focusIndex])

  const onKeyDown = (e, i) => {
    // console.log(e.key)
    // console.log(e.target.selectionStart, e.target.selectionEnd)
    switch (e.key) {
      case 'Enter': {
        e.preventDefault()
        const reactId = getRandomId()
        textRef.current.splice(i+1, 0, {reactId: reactId, content: ''})
        setTextArray(textArray => {
          const newTextArray = [...textArray]
          newTextArray.splice(i+1, 0, {reactId: reactId, checked: false})
          return newTextArray
        })

        onBlur(e, i)
        
        setFocusIndex(i+1)
        break
      }

      case 'ArrowUp':
        // move cursor to previous task
        onBlur(e, i)
        if (i>0) setFocusIndex(i-1)
        break

      case 'ArrowDown':
        // move cursor to next task
        onBlur(e, i)
        if (i<textArray.length-1) setFocusIndex(i+1)
        break
        
      case 'Backspace':
        // delete task if text length == 0
        if (e.target.textContent.length>0 || textRef.current.length==1) break

        onBlur(e, i)
        
        textRef.current = textRef.current.filter((task, idx) => idx != i)
        setTextArray(textArray => textArray.filter((task, idx) => idx != i))
        if (i>0) setFocusIndex(i-1)
        break
        
      default:
        break
    }

  }


  const syncHandler = (newData, i) => {
    if (syncTimeoutId) clearTimeout(syncTimeoutId)
    setSyncTimeoutId(setTimeout(() => {
      if (widgetProps.noteId && !widgetProps.noSync) {
        axios.put(`${import.meta.env.VITE_SERVER_URI}/api/notes/${widgetProps.noteId}`, newData)
          .then(() => setSyncTimeoutId(0))
      }
    }, 1500))
  }

  const onBlur = (e, i) => {
    if (textRef.current[i].content === e.target.textContent) return
    textRef.current[i].content = e.target.textContent
    const text = textRef.current.map(item => item.content).join('\n')
    setContent(text)
    syncHandler({content: text}, i)
  }

  const toggleCheck = i => {
    setTextArray(textArray => {
      const newTextArray = [...textArray]
      newTextArray[i].checked = !newTextArray[i].checked
      return newTextArray
    })
  }
  
  
  return ( <>
    {textArray.map(({reactId, checked}, i) => 
      <div
        key={reactId}
        className='p-1 flex items-center border-b-[1px] border-gray-500 bg-transparent text-slate-800 text-sm resize-none thin-scrollbar overflow-auto'
      >
        <button className='px-2' onClick={() => toggleCheck(i)}>
          { checked ? 
            <CheckCircledIcon className='h-5 w-5 text-gray-500' />
          :
            <CircleIcon className='h-5 w-5 text-gray-500' />
          }
        </button>
        
        <div
          className={`py-2 flex-grow outline-0 overflow-clip ${checked && 'line-through text-gray-500'}`}
          // rows={1}
          contentEditable="plaintext-only"
          ref={(ref) => inputRefs[i] = ref}
          type="text"
          onBlur={e => onBlur(e, i)}
          // onInput={e => {
          //   // setCursor(window.getSelection().anchorOffset)
          //   onInput(e, i)
          // }}
          // onChange={e => {
          //   console.log(e)
          //   // setTextArray(text => {
          //   //   const newText = [...text]
          //   //   newText[i] = e.target.value
          //   //   return newText
          //   // })
          //   // e.target.selectionStart = 2
          //   // e.target.selectionEnd = 2
            
          //   // inputRefs[1].selectionStart = 2
          //   // inputRefs[1].selectionEnd = 2
          //   // inputRefs[1].current.setSelectionRange(2, 2)
          // }}
          // onKeyDown={e => e.preventDefault()}
          // onKeyDownCapture={e => e.preventDefault()}
          onKeyDown={e => onKeyDown(e, i)}
          // onKeyUp={e => onKeyUp(e, i)}
          // onBlur={() => inputRef.current.setSelectionRange(cursorPosition, cursorPosition)}
          suppressContentEditableWarning={true}
        >
          {textRef.current[i].content}
        </div>
      </div>
    )}
  </>
    
  )
}

export default Checkboxes