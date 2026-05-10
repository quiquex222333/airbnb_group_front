import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './routers/AppRouter'
import { Toaster } from '@/components/ui/sonner'
// interceptor necesita cargarse en memoria primero para acoplarse a axios
import './features/auth/interceptor'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
    <Toaster position="top-right" richColors closeButton />
  </StrictMode>,
)
