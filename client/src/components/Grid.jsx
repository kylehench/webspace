import { useEffect, useState } from 'react'
import { Responsive, WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css";
import "../index.css"
import Quote from './Quote'
import Note from './Note'
import widgetDefaults from '../config/widgetDefaults';
import welcomeNote from '../config/welcomeNote';

const ResponsiveGridLayout = WidthProvider(Responsive)

const Grid = ({ appState }) => {
  const { user, layout, layoutDispatch, widgets, widgetsDispatch } = appState
  
  const [transparentSelection, setTransparentSelection] = useState(true)

  // initial load layout
  useEffect(() => {
    if (!user.id) {
      const reactId = Math.random().toString()
      widgetsDispatch({type: 'SET', payload: [{...welcomeNote, reactId}]})
      layoutDispatch({type: "CREATE", payload: {i: reactId, w: 2, h: 3}})
    }
  }, [user])

  // layout change handler
  const handleLayoutChange = layout => {
    layoutDispatch({type: "SET", payload: layout})
    if (user.id) {
      localStorage.setItem('webspace_layout', JSON.stringify(layout))
      localStorage.setItem('webspace_widgets', JSON.stringify(widgets))
    }
  }

  const widgetMap = {
    'note': (widgetProps) => <Note widgetProps={widgetProps} appState={appState} />,
    'quote': (widgetProps) => <Quote widgetProps={widgetProps} appState={appState} />,
  }

  return (
      <ResponsiveGridLayout
        className={`${transparentSelection && 'react-draggable-transparent-selection'} max-w-[1600px] mx-auto`}
        layouts={{ lg: layout }}
        onLayoutChange={handleLayoutChange}
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
        {widgets.map((widget, i) => {
          for (let key of ['titleBgColor', 'contentBgColor']) {
            if (!widget[key]) delete widget[key]
          }
          const widgetProps = {...widgetDefaults[widget.type], ...widget, index: i}
          return (
            <div
              key={`${widget.reactId}`}
              height={5}
              className='grid-cell flex flex-col h-full rounded-md bg-slate-100'
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