import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState({
    totalReceipts: 0,
    totalItems: 0,
    glutenFreeItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/receipts')
        const receipts = response.data

        let totalItems = 0
        let glutenFreeItems = 0

        // Fetch details for each receipt to count items
        for (const receipt of receipts) {
          try {
            const details = await axios.get(`/api/receipts/${receipt.id}`)
            totalItems += details.data.items.length
            glutenFreeItems += details.data.items.filter(item => item.gluten_free).length
          } catch (err) {
            console.error(`Error fetching receipt ${receipt.id}:`, err)
          }
        }

        setStats({
          totalReceipts: receipts.length,
          totalItems: totalItems,
          glutenFreeItems: glutenFreeItems,
        })
        setError(null)
      } catch (err) {
        setError('Failed to load statistics')
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="dashboard"><p>Loading statistics...</p></div>
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Receipts</h3>
          <p className="stat-number">{stats.totalReceipts}</p>
        </div>

        <div className="stat-card">
          <h3>Total Items Analyzed</h3>
          <p className="stat-number">{stats.totalItems}</p>
        </div>

        <div className="stat-card gluten-free">
          <h3>Gluten-Free Items</h3>
          <p className="stat-number">{stats.glutenFreeItems}</p>
        </div>

        <div className="stat-card">
          <h3>Accuracy Rate</h3>
          <p className="stat-number">
            {stats.totalItems > 0 
              ? ((stats.glutenFreeItems / stats.totalItems) * 100).toFixed(1) 
              : 0}%
          </p>
        </div>
      </div>

      <div className="welcome-section">
        <h3>Welcome to Celiac App</h3>
        <p>
          This application helps you identify gluten-free products from your shopping receipts.
        </p>
        <ul>
          <li>📸 Upload receipt images</li>
          <li>🤖 AI-powered product analysis</li>
          <li>📊 Track your purchases</li>
          <li>✅ Gluten-free identification</li>
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
