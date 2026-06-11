
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/shared/LandingPage.jsx'
import './App.css'

function App() {
  

  return (
   <>
   <div>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
    </Routes>
   
   </div>
  
   </>
  )
}

export default App
