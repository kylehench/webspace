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
  const [ focusIndex, setFocusIndex ] = useState(0)

  // sets checkbox focus when focusIndex is modified
  useEffect(() => {
    inputRefs[focusIndex].focus()
  }, [focusIndex])

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
    switch (e.key) {
      case 'Enter': {
        e.preventDefault()
        const reactId = getRandomId()
        taskContentRef.current.splice(i+1, 0, {reactId: reactId, content: ''})
        newCheckedState = [...checkedState]
        newCheckedState.splice(i+1, 0, {reactId: reactId, checked: false})
        setCheckedState(newCheckedState)
        syncContentChecked(newCheckedState)
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
        if (i<checkedState.length-1) setFocusIndex(i+1)
        break
        
      case 'Backspace':
        // delete task if text length == 0 and at least 1 task present
        if (e.target.textContent.length>0 || taskContentRef.current.length==1) break
        taskContentRef.current = taskContentRef.current.filter((task, idx) => idx != i)
        newCheckedState = checkedState.filter((task, idx) => idx != i)
        setCheckedState(newCheckedState)
        syncContentChecked(newCheckedState)
        if (i>0) setFocusIndex(i-1)
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
          className={`py-2 flex-grow outline-0 overflow-clip ${checked && 'line-through text-gray-500'}`}
          contentEditable="plaintext-only"
          ref={(ref) => inputRefs[i] = ref}
          type="text"
          onBlur={e => onBlur(e, i)}
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