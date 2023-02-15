import { useState } from 'react'
import { Responsive, WidthProvider } from "react-grid-layout"
// import styled from "styled-components"
import "/node_modules/react-grid-layout/css/styles.css";
import "../index.css"

const ResponsiveGridLayout = WidthProvider(Responsive)


// const GridItemWrapper = styled.div`
//   background: #f5f5f5;
//   border-radius: 10px;
// `
// const GridItemContent = styled.div`
//   // padding: 80px;
//   border-radius: 10px;
// `
// const GridItemTitle = styled.div`
//   display: flex;
//   justify-content: center;
//   padding: 5px ;
//   background: lightBlue;
//   border-radius: 10px;
// `
// const Root = styled.div`
//   margin: 0 auto;
//   max-width: 1500px;
// `

const ResponsiveGrid = () => {
  const [transparentSelection, setTransparentSelection] = useState(true)
  
  const layout = [
    { i: "key1", x: 0, y: 0, w: 1, h: 4 },
    { i: "key2", x: 1, y: 0, w: 1, h: 4 },
    { i: "key3", x: 2, y: 0, w: 1, h: 3 },
    { i: "key4", x: 3, y: 0, w: 1, h: 4 },
    { i: "key5", x: 4, y: 0, w: 1, h: 3 }
  ]
  // for (let i = 6; i < 11; i++) {
  //   layout.push(
  //     { i: `key${i}`, w: 1, h: 3 }
  //   )
    
  // }
  return (
      <ResponsiveGridLayout
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 5, md: 4, sm: 3, xs: 2, xxs: 1 }}
        rowHeight={100}
        // width={100}
        draggableHandle=".grid-item__title"
        onDragStart={() => {setTransparentSelection(true)}}
        onDragStop={() => {setTransparentSelection(false)}}
        onResizeStart={() => {setTransparentSelection(true)}}
        onResizeStop={() => {setTransparentSelection(false)}}
        className={`App ${transparentSelection && 'react-draggable-transparent-selection'}`}
      >
        {Array(15).fill().map((item, i) =>
          <div key={`key${i}`} className='bg-[#f5f5f5] border rounded-md'>
            <div className="grid-item__title flex justify-center p-1 rounded-md bg-blue-200">
              <span className='text'>DRAG ME</span>
            </div>
            <div className='text'>
              My ID is {i}.
            </div>
          </div>
        )}
        {/* <GridItemWrapper key="key2">
          <GridItemContent>
            Not You Gee Oh
          </GridItemContent>
        </GridItemWrapper>
        <GridItemWrapper key="key3">
          <GridItemContent>Not You Gee Oh</GridItemContent>
        </GridItemWrapper>
        <GridItemWrapper key="key4">
          <GridItemContent>Not You Gee Oh</GridItemContent>
        </GridItemWrapper>
        <GridItemWrapper key="key5">
          <GridItemContent>Not You Gee Oh</GridItemContent>
        </GridItemWrapper> */}
      </ResponsiveGridLayout>
  )
}

export default ResponsiveGrid