import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/Dashboard'
import TicketManager from './pages/TicketManager'
// import './index.css'

export default function App() {
  return (

    <Router>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='auth/Login' element={<Login/>}/>
        <Route path='auth/Signup' element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tickets" element={<TicketManager />} />
       
      
      </Routes>
      
    </Router>
  )
}
