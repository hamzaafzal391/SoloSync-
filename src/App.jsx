import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthInitializer } from './components/AuthInitializer.jsx'
import { Layout } from './components/Layout.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import { Home } from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'

export default function App() {
  return (
    <>
      <AuthInitializer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
