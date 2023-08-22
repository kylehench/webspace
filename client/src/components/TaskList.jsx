import { useEffect, useRef, useState } from 'react'
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons'
import axios from 'axios'
import { current } from 'tailwindcss/colors'

const getRandomId = () => Math.random().toString().slice(2)

const Checkboxes = ({ widgetProps, content, setContent, checked, checkedChange, syncHandler }) => {
  // task content stored in useRef to prevent rendering issues
  const taskContentRef = useRef(content.split('\n').map(line => {
    return {
      reactId: getRandomId(),
      content: line
    }
  }))
  // references to editable divs
  const inputRefs = useRef([])
  const checkedSet = new Set(checked.split(','))
  const [ taskState, setTaskState ] = useState(
    taskContentRef.current.map(({reactId}, i) => {
      return {
        reactId,
        checked: checkedSet.has(i.toString()),
      }
    })
  )
  const [ focusIndex, setFocusIndex ] = useState(0)

  // sets checkbox focus when focusIndex is modified
  useEffect(() => {
    inputRefs[focusIndex].focus()
    // inputRefs[i+1].setSelectionRange(2,4)
  }, [focusIndex])

  const onKeyDown = (e, i) => {
    // console.log(e.key)
    // console.log(e.target.selectionStart, e.target.selectionEnd)
    let newTaskState
    switch (e.key) {
      case 'Enter': {
        e.preventDefault()
        const reactId = getRandomId()
        taskContentRef.current.splice(i+1, 0, {reactId: reactId, content: ''})
        newTaskState = [...taskState]
        newTaskState.splice(i+1, 0, {reactId: reactId, checked: false})
        setTaskState(newTaskState)

        // onBlur(e, i)
        
        syncContentChecked(newTaskState)
        
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
        if (i<taskState.length-1) setFocusIndex(i+1)
        break
        
      case 'Backspace':
        // delete task if text length == 0
        if (e.target.textContent.length>0 || taskContentRef.current.length==1) break

        // onBlur(e, i)
        
        taskContentRef.current = taskContentRef.current.filter((task, idx) => idx != i)
        newTaskState = taskState.filter((task, idx) => idx != i)
        setTaskState(newTaskState)
        syncContentChecked(newTaskState)
        if (i>0) setFocusIndex(i-1)
        break
        
      default:
        break
    }

  }


  // const syncHandler = (newData, i) => {
  //   if (syncTimeoutId) clearTimeout(syncTimeoutId)
  //   setSyncTimeoutId(setTimeout(() => {
  //     if (widgetProps.noteId && !widgetProps.noSync) {
  //       axios.put(`${import.meta.env.VITE_SERVER_URI}/api/notes/${widgetProps.noteId}`, newData)
  //         .then(() => setSyncTimeoutId(0))
  //     }
  //   }, 1500))
  // }

  const dumpChecked = (taskState) => {
    const newChecked = []
    taskState.forEach((task, i) => {
      if (task.checked) newChecked.push(i)
    })
    return newChecked.join(',')
  }
  
  const syncContentChecked = (taskState=taskState) => {
    const newContent = taskContentRef.current.map(item => item.content).join('\n')
    syncHandler({content: newContent, checked: dumpChecked(taskState)})
  }

  const onBlur = (e, i) => {
    // updates taskContentRef data if text has changed, calls sync
    if (taskContentRef.current[i].content === e.target.textContent) return
    taskContentRef.current[i].content = e.target.textContent
    const text = taskContentRef.current.map(item => item.content).join('\n')
    setContent(text)
    syncHandler({content: text})
    // syncHandler({content: text, checked: dumpChecked(taskState)})
  }

  const toggleCheck = i => {
    const newTaskState = [...taskState]
    newTaskState[i].checked = !newTaskState[i].checked
    setTaskState(newTaskState)
    syncHandler({checked: dumpChecked(newTaskState)})
  }
  
  
  return ( <>
    {taskState.map(({reactId, checked}, i) => 
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
          //   // setTaskState(text => {
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
          {taskContentRef.current[i].content}
        </div>
      </div>
    )}
  </>
    
  )
}

export default Checkboxes