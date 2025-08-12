import React, { Component, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // important!

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here if needed
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          backgroundColor: '#121212',
          color: '#f44336',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
          fontSize: '1.5rem',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div>
            <h1>Something went wrong.</h1>
            <p>Please try refreshing the page, or contact support if the problem persists.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const rootEl = document.getElementById('root')

if (!rootEl) {
  console.error('Root element not found')
} else {
  ReactDOM.createRoot(rootEl).render(
    // To avoid React.StrictMode double invokes during development,
    // you can comment out <React.StrictMode> below.
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  )
}