import { useState } from 'react'
import { Responsive, WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css";
import "../index.css"
import Note from './Note'
import widgetDefaults from '../config/widgetDefaults';

const ResponsiveGridLayout = WidthProvider(Responsive)

const Grid = ({ appState }) => {
  const [transparentSelection, setTransparentSelection] = useState(true)

  const layout = [
    // { i: "key1", x: 0, y: 0, w: 1, h: 4 },
    // { i: "key2", x: 1, y: 0, w: 1, h: 4 },
    // { i: "key3", x: 2, y: 0, w: 1, h: 3 },
    // { i: "key4", x: 3, y: 0, w: 1, h: 4 },
    // { i: "key5", x: 4, y: 0, w: 1, h: 3 }
  ]

  const widgetMap = {
    'note': (widgetProps) => <Note widgetProps={widgetProps} appState={appState} />,
  }

  return (
      <ResponsiveGridLayout
        className={`${transparentSelection && 'react-draggable-transparent-selection'} max-w-[1600px] mx-auto`}
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        rowHeight={100}
        // width={100}
        draggableHandle=".grid-item__title"
        style={{zIndex:'0'}}
        margin={[15,15]}
        containerPadding={[15,15]}
        onDragStart={() => {setTransparentSelection(true)}}
        onDragStop={() => {setTransparentSelection(false)}}
        onResizeStart={() => {setTransparentSelection(true)}}
        onResizeStop={() => {setTransparentSelection(false)}}
      >
        {appState.widgets.map((widget, i) => {
          const widgetProps = {...widgetDefaults[widget.type], ...widget, index: i}
          return (
            <div 
              key={`${widget.reactId}`}
              className='grid-cell flex flex-col h-full rounded-md bg-slate-100 '
              style={{backgroundColor: widgetProps.contentBgColor}}
            >
              {widgetMap[widget.type](widgetProps)}
            </div>
          )
        })}
      </ResponsiveGridLayout>
  )
}

export default Grid