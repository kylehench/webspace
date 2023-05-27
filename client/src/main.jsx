import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as RTooltip from '@radix-ui/react-tooltip'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <React.StrictMode>
      <RTooltip.Provider>
        <App />
      </RTooltip.Provider>
    </React.StrictMode>
  </>
)
