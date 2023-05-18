import { useState } from 'react'
import { IoImageOutline } from 'react-icons/io5'
import ButtonPopover from './primitives/ButtonPopover'
import ImageLoader from './primitives/ImageLoader'
// import ContentLoader from 'react-content-loader'

// note: large images already preloaded
const images = ['green-grass','green-leaf','ocean']

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
          <div
            key={image}
            className='pt-4'
            onClick={() => {
              setBackgroundImage(image)
              localStorage.setItem('webspace_backgroundImage', image)
            }}
          >
            <ImageLoader
              src={`${import.meta.env.BASE_URL}/img/${image}-lg.jpg`}
              width={192}
              height={128}
            />
          </div>
        ))}
      </div>
    </ButtonPopover>
  )
}

export default BackgroundButton