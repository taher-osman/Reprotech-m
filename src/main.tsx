import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppIncrementalTest from './AppIncrementalTest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppIncrementalTest />
  </StrictMode>,
)
