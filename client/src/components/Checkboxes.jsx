import { useEffect, useRef, useState } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckCircledIcon, CircleIcon } from '@radix-ui/react-icons';



const Checkboxes = ({  }) => {
  const textRef = useRef([
    {reactId: 1, content: 'hello, world1'},
    {reactId: 2, content: 'hello, world2'},
    {reactId: 3, content: 'hello, world3'},
  ])
  const inputRefs = useRef([])
  const [ textArray, setTextArray ] = useState([
    {reactId: 1, checked: false}, 
    {reactId: 2, checked: false}, 
    {reactId: 3, checked: false},
  ])
  const [ focusIndex, setFocusIndex ] = useState(0)

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
        const reactId = Math.random().toString().slice(2)
        textRef.current.splice(i+1, 0, {reactId: reactId, content: ''})
        setTextArray(textArray => {
          const newTextArray = [...textArray]
          newTextArray.splice(i+1, 0, {reactId: reactId, checked: false})
          return newTextArray
        })
        setFocusIndex(i+1)
        break
      }

      case 'ArrowUp':
        // move cursor to previous task
        if (i>0) setFocusIndex(i-1)
        break

      case 'ArrowDown':
        // move cursor to next task
        if (i<textArray.length-1) setFocusIndex(i+1)
        break
        
      case 'Backspace':
        // delete task if text length == 0
        if (textRef.current[i].content.length>0) break
        textRef.current = textRef.current.filter((task, idx) => idx != i)
        setTextArray(textArray => textArray.filter((task, idx) => idx != i))
        if (i>0) setFocusIndex(i-1)
        break
        
      default:
        // console.log(e.target.innerText)
        // setTextArray(textArray => {
        //   const newTextArray = [...textArray]
        //   newTextArray[i].content = e.target.innerText
        //   return newTextArray
        // })
        break
    }

  }

  const onKeyUp = (e, i) => {
    // console.log(e.target.textContent)
    // if (e.key === 'Backspace' && textArray[i].content.length==0) {
    //   console.log('HERE!!!!!!');
    //   console.log(textArray[i].content);
    //   e.preventDefault()
    //   // delete task if text length == 0
    //   setTextArray(textArray => textArray.filter(idx => idx != i))
    //   if (i>0) setFocusIndex(i-1)
    // }
  }

  const onInput = (e, i) => {
    textRef.current[i].content = e.target.textContent
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
        {/* <Checkbox.Root
          className="hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white outline-none"
          defaultChecked
          id="c1"
        >
          <Checkbox.Indicator className="text-violet11">
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root> */}

        <button className='px-2' onClick={() => toggleCheck(i)}>
          { checked ? 
            <CheckCircledIcon className='h-5 w-5 text-gray-500' />
          :
            <CircleIcon className='h-5 w-5 text-gray-500' />
          }
        </button>
        
        <div
          className={`py-2 flex-grow outline-0 ${checked && 'line-through'}`}
          // rows={1}
          contentEditable="plaintext-only"
          ref={(ref) => inputRefs[i] = ref}
          type="text"
          onInput={e => {
            onInput(e, i)
          }}
          // onChange={e => {
          //   setTextArray(text => {
          //     const newText = [...text]
          //     newText[i] = e.target.value
          //     return newText
          //   })
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
        >
          {textRef.current[i].content}
        </div>
      </div>
    )}
  </>
    
  )
}

export default Checkboxes