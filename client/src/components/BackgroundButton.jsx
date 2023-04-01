import React, { useState } from 'react'
import { IoImageOutline } from 'react-icons/io5'
import ButtonPopover from './primitives/ButtonPopover'

// note: large images already preloaded
const images = ['green-grass-lg','green-leaf-lg','ocean-lg']

const BackgroundButton = ({ appState }) => {
  const { setBackgroundImage } = appState
  
  const [open, setOpen] = useState(false)

  return (
    <ButtonPopover
      icon={<IoImageOutline />}
      closeButton={false}
      hoverText='Background Image'
      open={open}
      setOpen={setOpen}
    >
      <div className='pb-4 px-4'>
        { images.map(image => (
          <img
            key={image.name}
            className='pt-4 w-48'
            src={`${process.env.PUBLIC_URL}/img/${image}.jpg`}
            alt=""
            onClick={() => {
              setBackgroundImage(image)
              localStorage.setItem('webspace_backgroundImage', image)
            }}
          />))
        }
      </div>
    </ButtonPopover>
  )
}

export default BackgroundButton