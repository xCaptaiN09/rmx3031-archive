import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { DataProvider } from './hooks/use-data'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <DataProvider>
      <App />
    </DataProvider>
  </BrowserRouter>,
)
