import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import RedesignApp from './redesign/RedesignApp'

const isRedesign = new URLSearchParams(window.location.search).get('v') === 'new'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isRedesign ? <RedesignApp /> : <App />}
  </StrictMode>,
)
