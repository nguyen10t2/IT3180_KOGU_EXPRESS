import { BrowserRouter, Route, Routes } from 'react-router'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import HomePage from './pages/HomePage'
import { Toaster } from 'sonner'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { Navigate } from 'react-router'
import OTPPage from './pages/OtpPage'

function App() {
  return (
    <>
      <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path='/signin'
            element={<SignInPage/>}
          />
          <Route
            path='/signup'
            element={<SignUpPage/>}
          />
          <Route
              path='/otp'
              element={<OTPPage/>}
            />
          {/* Protected routes */}
          <Route element={<ProtectedRoute/>}>
            <Route
              path='/home'
              element={<HomePage/>}
            />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path='*' element={<Navigate to='/signin' replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App