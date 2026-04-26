import { useState } from 'react'
import {BrowserRouter as Router, Route,Routes} from 'react-router-dom'
import Login from './pages/user-ligin/Login'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-black text-white'>
      <Router>
        <Routes>
          <Route path='/user-login' element={<Login}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
