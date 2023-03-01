import { useEffect, useState } from 'react'
import { Responsive, WidthProvider } from "react-grid-layout"
import "/node_modules/react-grid-layout/css/styles.css";
import "../index.css"
import Note from './Note'
import widgetDefaults from '../config/widgetDefaults';

const ResponsiveGridLayout = WidthProvider(Responsive)

const Grid = ({ appState }) => {
  const [transparentSelection, setTransparentSelection] = useState(true)
  const [layout, setLayout] = useState([])

  // initial load layout
  useEffect(() => {
    setLayout(JSON.parse(localStorage.getItem('webspaceLayout')) || [])
    appState.widgetsDispatch({type: 'LOCAL_STORAGE_GET'})
  }, [])

  // layout change handler
  const handleLayoutChange = layout => {
    setLayout(layout)
    localStorage.setItem('webspaceLayout', JSON.stringify(layout))
    appState.widgetsDispatch({type: 'LOCAL_STORAGE_SET'})
  }
  

  const widgetMap = {
    'note': (widgetProps) => <Note widgetProps={widgetProps} appState={appState} />,
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
        {appState.widgets.map((widget, i) => {
          for (let key of ['titleBgColor', 'contentBgColor']) {
            if (!widget[key]) delete widget[key]
          }
          const widgetProps = {...widgetDefaults[widget.type], ...widget, index: i}
          return (
            <div
              key={`${widget.reactId}`}
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