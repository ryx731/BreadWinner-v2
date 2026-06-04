import React, { useState } from 'react';
import axios from 'axios';
import './Upload.css';

function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setFile(selectedFile);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a receipt image');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/api/receipts/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setResult(response.data);
      setSuccess('Receipt processed successfully!');
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload receipt');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="upload-container">
      <h2>Upload Receipt</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {!result ? (
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="file-input-wrapper">
            <label htmlFor="file-input" className="file-input-label">
              {preview ? (
                <img src={preview} alt="Preview" className="preview-image" />
              ) : (
                <div className="file-input-placeholder">
                  <span className="upload-icon">📸</span>
                  <p>Click to select or drag and drop</p>
                </div>
              )}
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden-input"
              disabled={loading}
            />
          </div>
          {file && (
            <div className="file-info">
              <p><strong>Selected:</strong> {file.name}</p>
            </div>
          )}
          <div className="button-group">
            <button type="submit" disabled={!file || loading} className="btn btn-primary">
              {loading ? 'Processing...' : 'Upload and Analyze'}
            </button>
          </div>
        </form>
      ) : (
        <div className="results">
          <h3>Analysis Results</h3>
          <div className="items-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {result && Array.isArray(result.items) ? (
                  result.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item?.name || 'Unknown Item'}</td>
                      <td>{item?.quantity || 1}</td>
                      <td>${typeof item?.unit_price === 'number' ? item.unit_price.toFixed(2) : '0.00'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No items parsed.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button onClick={handleReset} className="btn btn-primary">Upload Another</button>
        </div>
      )}
    </div>
  );
}

export default Upload;