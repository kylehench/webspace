import React, { useState } from 'react'
import { IoImageOutline } from 'react-icons/io5'
import ButtonPopover from './primitives/ButtonPopover'
import GrassImg from '../img/green-grass-sm.jpg'
import GreenLeafImg from '../img/green-leaf-sm.jpg'
import OceanImg from '../img/ocean-sm.jpg'

const images = [
  { thumbnail: GrassImg,
    link: '/img/green-grass-lg.jpg' },
  { thumbnail: GreenLeafImg,
    link: '/img/green-leaf-lg.jpg' },
  { thumbnail: OceanImg,
    link: '/img/ocean-lg.jpg' },
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
            key={image.link}
            className='pt-4 w-48'
            src={image.thumbnail}
            alt=""
            onClick={() => setBackgroundImage(image.link)}
          />))
        }
      </div>
    </ButtonPopover>
  )
}

export default BackgroundButton