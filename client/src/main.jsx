import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import * as RTooltip from '@radix-ui/react-tooltip'
import axios from 'axios';

// CSRF protection
// https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#custom-request-headers
axios.defaults.headers.common['X-WEBSPACE-CSRF-PROTECTION'] = '1'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    {/* <React.StrictMode> */}
      <RTooltip.Provider>
        <App />
      </RTooltip.Provider>
    {/* </React.StrictMode> */}
  </>
)
