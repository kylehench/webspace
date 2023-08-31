import { useEffect, useRef, useState } from 'react'
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons'

const getRandomId = () => Math.random().toString().slice(2)

const Checkboxes = ({ content, setContent, checked, syncHandler }) => {

  // task content stored in useRef to prevent rendering issues in editable div
  const taskContentRef = useRef(content.split('\n').map(line => {
    return {
      reactId: getRandomId(),
      content: line
    }
  }))
  // task completion status (checked state)
  const [ checkedState, setCheckedState ] = useState(() => {
    const checkedSet = new Set(checked.split(','))
    return taskContentRef.current.map(({reactId}, i) => {
      return {
        reactId,
        checked: checkedSet.has(i.toString()),
      }
    })
  })
  // references to editable divs (used for focusing)
  const inputRefs = useRef([])
  // index of task to focus (move cursor)
  const [ focusIndex, setFocusIndex ] = useState()
  const [ cursorPosition, setCursorPosition ] = useState({node: null, position: null, callFocus: false})

  const updateCursorPosition = (node, position) => {
    if (!node.firstChild) return
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(node.firstChild, position);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range)
  }
  
  // sets checkbox focus when focusIndex is modified
  useEffect(() => {
    if (!focusIndex) return
    const divRef = inputRefs[focusIndex]
    divRef.focus()
    setFocusIndex(null)
    // if (divRef.firstChild) updateCursorPosition(divRef, taskContentRef.current[focusIndex].content.length-1)
  }, [focusIndex])

  useEffect(() => {
    const { node, position, callFocus} = cursorPosition
    if (!node) return
    if (callFocus) node.focus()
    updateCursorPosition(node, position)
    setCursorPosition({})
  }, [cursorPosition])

  const dumpChecked = (checkedState) => {
    const newChecked = []
    checkedState.forEach((task, i) => {
      if (task.checked) newChecked.push(i)
    })
    return newChecked.join(',')
  }
  
  // syncs content (tasks) and check status
  const syncContentChecked = (checkedState=checkedState) => {
    const newContent = taskContentRef.current.map(item => item.content).join('\n')
    syncHandler({content: newContent, checked: dumpChecked(checkedState)})
  }

  const onKeyDown = (e, i) => {
    let newCheckedState
    let position
    switch (e.key) {
      case 'Enter': {
        e.preventDefault()
        const reactId = getRandomId()
        const position = window.getSelection().anchorOffset
        const taskContent = taskContentRef.current[i].content
        console.log(taskContent.slice(position));
        taskContentRef.current.splice(i+1, 0, {
          reactId: reactId,
          content: taskContent.slice(position)
        })
        taskContentRef.current[i].content = taskContent.slice(0, position)
        newCheckedState = [...checkedState]
        newCheckedState.splice(i+1, 0, {reactId: reactId, checked: false})
        setCheckedState(newCheckedState)
        syncContentChecked(newCheckedState)
        setFocusIndex(i+1)
        break
      }

      case 'ArrowUp':
        // move cursor to previous task
        if (i>0) setFocusIndex(i-1)
        break

      case 'ArrowDown':
        // move cursor to next task
        if (i<checkedState.length-1) setFocusIndex(i+1)
        break
        
      case 'Backspace':
        // delete task if text length == 0 and at least 1 task present
        if (i===0 || window.getSelection().anchorOffset!==0) break
        e.preventDefault()
        position = taskContentRef.current[i-1].content.length
        taskContentRef.current[i-1].content += taskContentRef.current[i].content
        taskContentRef.current = taskContentRef.current.filter((task, idx) => idx != i)
        newCheckedState = checkedState.filter((task, idx) => idx != i)
        setCheckedState(newCheckedState)
        syncContentChecked(newCheckedState)
        // setFocusIndex(i-1)
        // console.log(inputRefs[i-1], position)
        // updateCursorPosition([, position])
        inputRefs.current = inputRefs.current.filter(idx => idx !== i)
        setCursorPosition({node: inputRefs[i-1], position, callFocus: true})
        break
        
      default:
        break
    }
  }

  // updates taskContentRef data if text has changed, calls syncHandler
  const onBlur = (e, i) => {
    if (taskContentRef.current[i].content === e.target.textContent) return
    taskContentRef.current[i].content = e.target.textContent
    const text = taskContentRef.current.map(item => item.content).join('\n')
    setContent(text)
    syncHandler({content: text})
    setCursorPosition({node: inputRefs[i], position: window.getSelection().anchorOffset})
  }

  const toggleCheck = i => {
    const newCheckedState = [...checkedState]
    newCheckedState[i].checked = !newCheckedState[i].checked
    setCheckedState(newCheckedState)
    syncHandler({checked: dumpChecked(newCheckedState)})
  }
  
  
  return ( <>
    {checkedState.map(({reactId, checked}, i) => 
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
          className={`py-1.5 flex-grow outline-0 overflow-clip ${checked && 'line-through text-gray-500'}`}
          contentEditable="plaintext-only"
          ref={(ref) => inputRefs[i] = ref}
          type="text"
          // onBlur={e => onBlur(e, i)}
          onInput={e => onBlur(e, i)}
          onKeyDown={e => onKeyDown(e, i)}
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