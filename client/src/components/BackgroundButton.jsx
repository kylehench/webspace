import React, { useState } from 'react'
import { IoImageOutline } from 'react-icons/io5'
import ButtonPopover from './primitives/ButtonPopover'
import GrassImg from '../img/green-grass-sm.jpg'
import GreenLeafImg from '../img/green-leaf-sm.jpg'
import OceanImg from '../img/ocean-sm.jpg'

const images = [
  { thumbnail: GrassImg,
    name: 'green-grass-lg' },
  { thumbnail: GreenLeafImg,
    name: 'green-leaf-lg' },
  { thumbnail: OceanImg,
    name: 'ocean-lg' },
]


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
            src={image.thumbnail}
            alt=""
            onClick={() => {
              setBackgroundImage(image.name)
              localStorage.setItem('webspace_backgroundImage', image.name)
            }}
          />))
        }
      </div>
    </ButtonPopover>
  )
}

export default BackgroundButton