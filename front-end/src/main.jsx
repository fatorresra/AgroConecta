import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './shared/context/theme-provider'
import App from './App.jsx'
import LoginPage from './features/authentication/pages/LoginPage.jsx'
import RegisterPage from './features/authentication/pages/RegisterPage.jsx'
import LandingPage from './features/productManagement/pages/LandingPage.jsx'
import '@/styles/globals.css'
import SearchProductsPage from './features/productManagement/pages/SearchProducts.jsx'

const router = createBrowserRouter([
  {
    path: '/home',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/Products',
    element: <SearchProductsPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
