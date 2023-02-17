import { useState } from 'react'
import { Responsive, WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css";
import "../index.css"
import colors from 'tailwindcss/colors'

const ResponsiveGridLayout = WidthProvider(Responsive)

const Grid = () => {
  const [transparentSelection, setTransparentSelection] = useState(true)

  const defaultConfig = {
    note: {
      title: '',
      titleBgColor: colors.yellow[300],
      content: <div className='p-5'>'why hello there'</div>,
      contentBgColor: colors.yellow[200],
    },
  }

  const gridItems = [
    {
      title: 'DRAG ME NEW',
      titleBgColor: colors.yellow[300],
      content: <div className='p-5'>'why hello there'</div>,
      contentBgColor: colors.yellow[200],
    },
    {
      title: 'DRAG ME NEW',
      titleBgColor: colors.yellow[300],
      content: <div className='p-5'>'why hello there'</div>,
      contentBgColor: colors.yellow[200],
    },
    {}
  ]
  
  const layout = [
    { i: "key1", x: 0, y: 0, w: 1, h: 4 },
    { i: "key2", x: 1, y: 0, w: 1, h: 4 },
    { i: "key3", x: 2, y: 0, w: 1, h: 3 },
    { i: "key4", x: 3, y: 0, w: 1, h: 4 },
    { i: "key5", x: 4, y: 0, w: 1, h: 3 }
  ]

  return (
      <ResponsiveGridLayout
      className={`${transparentSelection && 'react-draggable-transparent-selection'} max-w-[1600px] mx-auto`}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        rowHeight={100}
        // width={100}
        draggableHandle=".grid-item__title"
        margin={[15,15]}
        onDragStart={() => {setTransparentSelection(true)}}
        onDragStop={() => {setTransparentSelection(false)}}
        onResizeStart={() => {setTransparentSelection(true)}}
        onResizeStop={() => {setTransparentSelection(false)}}
      >
        {gridItems.map((item, i) =>
          <div 
            key={`key${i}`} 
            className='rounded-md bg-slate-100'
              style={{backgroundColor: item.contentBgColor}}
          >
            <div className="grid-item__title flex justify-between p-1 rounded-t-md"
              style={{backgroundColor: item.titleBgColor}}
            >
              <div className='flex-1'>{item.titleLeft}</div>
              <div className='flex-2 min-h-[20px]'>{item.title}</div>
              <div className='flex-1 flex justify-end'>
                <div>{item.titleRight}</div>
                <div>{item.titleRight}</div>
              </div>
            </div>
            <div className='text'>
              {item.content}
            </div>
          </div>
        )}
      </ResponsiveGridLayout>
  )
}

export default Grid