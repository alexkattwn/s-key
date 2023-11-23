import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import { Tooltip } from 'react-tooltip'

import ToasterProvider from '@/providers/ToasterProvider.tsx'

import 'react-circular-progressbar/dist/styles.css'
import 'react-tooltip/dist/react-tooltip.css'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Tooltip id='tooltip' />
        <ToasterProvider />
        <App />
    </React.StrictMode>
)
