import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { JazzProvider } from "jazz-react";  
import { JazzInspector } from "jazz-inspector";

import './index.css'
import App from './App.tsx'

//const url = new URL(window.location.href);
//const defaultProfileName = url.searchParams.get("user") ?? 'Max';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JazzProvider
    //sync={{peer:"ws://127.0.0.1:4200"}}
    sync={{peer:"wss://cloud.jazz.tools/?key=jazz.test.001@yopmail.com"}}
    //defaultProfileName={defaultProfileName}
    >
      <JazzInspector />
      <App />
    </JazzProvider>
  </StrictMode>,
)
