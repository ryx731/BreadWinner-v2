import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './History.css'

function History() {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/receipts')
        setReceipts(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to load receipt history')
        console.error('Error fetching receipts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReceipts()
  }, [])

  const handleReceiptClick = async (receiptId) => {
    try {
      const response = await axios.get(`/api/receipts/${receiptId}`)
      setSelectedReceipt(response.data)
    } catch (err) {
      setError('Failed to load receipt details')
      console.error('Error fetching receipt details:', err)
    }
  }

  const handleClose = () => {
    setSelectedReceipt(null)
  }

  if (loading) {
    return <div className="history-container"><p>Loading history...</p></div>
  }

  if (receipts.length === 0) {
    return (
      <div className="history-container">
        <h2>Receipt History</h2>
        <p className="empty-state">No receipts found. Start by uploading a receipt!</p>
      </div>
    )
  }

  return (
    <div className="history-container">
      <h2>Receipt History</h2>

      {error && <div className="error-message">{error}</div>}

      {!selectedReceipt ? (
        <div className="receipts-grid">
          {receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="receipt-card"
              onClick={() => handleReceiptClick(receipt.id)}
            >
              <h3>Receipt #{receipt.id}</h3>
              <p className="receipt-date">
                {new Date(receipt.created_at).toLocaleDateString()}
              </p>
              <p className="items-count">{receipt.items_count} items</p>
              <button className="view-btn">View Details →</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="receipt-detail">
          <button className="back-btn" onClick={handleClose}>
            ← Back to List
          </button>

          <h3>Receipt #{selectedReceipt.id}</h3>
          <p className="detail-date">
            {new Date(selectedReceipt.created_at).toLocaleString()}
          </p>

          <div className="raw-text-section">
            <h4>Extracted Text:</h4>
            <p className="raw-text">{selectedReceipt.raw_text}</p>
          </div>

          <div className="items-section">
            <h4>Items:</h4>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Gluten-Free</th>
                </tr>
              </thead>
              <tbody>
                {selectedReceipt.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td className={item.gluten_free ? 'yes' : 'no'}>
                      {item.gluten_free ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="summary">
            <p>
              <strong>Total Items:</strong> {selectedReceipt.items.length}
            </p>
            <p>
              <strong>Gluten-Free Items:</strong>{' '}
              {selectedReceipt.items.filter(item => item.gluten_free).length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default History
