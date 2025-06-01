import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './features/authentication/pages/LoginPage.jsx'
import RegisterPage from './features/authentication/pages/RegisterPage.jsx'
const router = createBrowserRouter([
  {


    path : '/',
    element: <App />,
    errorElement: <div>Page not found</div>,
  },
  {
    path: '/login',
    element: <><LoginPage></LoginPage></>
  },
  {

    path: '/register',
    element: <><RegisterPage></RegisterPage></>
  }
  



])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    
  </StrictMode>,
)
