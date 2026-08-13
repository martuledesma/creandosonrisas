import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app'
import './index.css'

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('Error al iniciar Creando Sonrisas:', error, info)
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="app-recovery-screen">
          <span>Fundación Creando Sonrisas</span>
          <h1>No pudimos cargar la página.</h1>
          <p>Actualizá el sitio para volver a intentarlo.</p>
          <button type="button" onClick={() => window.location.reload()}>Actualizar</button>
        </main>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
)
