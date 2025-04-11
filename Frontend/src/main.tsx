import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import router from './routes/Routes.tsx'
import { RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode >,
)
