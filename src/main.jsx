import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Fight,Start,Edit} from './components/index.js'
import { BrowserRouter,Routes,Route } from 'react-router'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/main" element={<App />}/>
      <Route path="/edit" element={<Edit />}/>
      <Route path="/fight" element={<Fight />}/>
      <Route path="/" element={<Start />} />
    </Routes>
  </BrowserRouter>
)
