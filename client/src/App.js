import { useState } from 'react'
import ResponsiveGrid from './components/ResponsiveGrid';

function App() {
  const [transparentSelection, setTransparentSelection] = useState(true)
  
  return (
    <div className={`App ${transparentSelection && 'react-draggable-transparent-selection'}`}>
      <ResponsiveGrid setTransparentSelection={setTransparentSelection} />
    </div>
  );
}

export default App;