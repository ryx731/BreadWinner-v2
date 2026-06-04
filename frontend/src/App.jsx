import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/pages/Dashboard'
import Upload from './components/pages/Upload'
import History from './components/pages/History'
import Profile from './components/pages/Profile'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>🍞 Celiac App</h1>
            <p>Gluten-Free Receipt Analyzer</p>
          </div>
          <ul className="nav-links">
            <li>
              <Link 
                to="/" 
                className={activeTab === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className={activeTab === 'upload' ? 'active' : ''}
                onClick={() => setActiveTab('upload')}
              >
                Upload Receipt
              </Link>
            </li>
            <li>
              <Link 
                to="/history" 
                className={activeTab === 'history' ? 'active' : ''}
                onClick={() => setActiveTab('history')}
              >
                History
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2024 Celiac App. Always consult nutritional labels for accurate gluten information.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App