import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IonApp, setupIonicReact } from '@ionic/react'
import './index.css'
import App from './App.tsx'

import '@ionic/react/css/core.css'

setupIonicReact()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IonApp>
      <App />
    </IonApp>
  </StrictMode>,
)
