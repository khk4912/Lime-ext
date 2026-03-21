import React from 'react'
import ReactDOM from 'react-dom/client'
import { OptionProvider } from '@/providers/OptionProvider'
import App from './App.tsx'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OptionProvider>
      <App />
    </OptionProvider>
  </React.StrictMode>
)
