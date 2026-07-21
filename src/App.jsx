
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/shared/LandingPage.jsx'
import './App.css'
import Properties from './pages/Propperties.jsx'

function App() {
  

  return (
   <>
   <div>
    <Routes>
      <Route path='/' element={<LandingPage/>} />
      <Route path='/properties' element={<Properties/>} />
    </Routes>
   
   </div>
  
   </>
  )
}

export default App
