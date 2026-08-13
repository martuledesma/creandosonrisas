import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app'
import './index.css'

const animatedSelector = [
  '.home-quick-action', '.home-pillar-card', '.home-impact-section', '.news-template-section',
  '.feature-card', '.page-intro', '.nosotros-intro-collage', '.nosotros-intro-copy',
  '.nosotros-value-card', '.nosotros-professional-card', '.nosotros-group-photo',
  '.sumate-way-card', '.sumate-intro-copy', '.sumate-campaign-image', '.sumate-contact-actions',
  '.sumate-contact-band', '.footer'
].join(',')

function MotionObserver({ children }) {
  React.useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' })

    const register = () => {
      document.querySelectorAll(animatedSelector).forEach((element, index) => {
        if (element.dataset.motionReady) return
        element.dataset.motionReady = 'true'
        element.classList.add('motion-reveal')
        element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 70}ms`)
        observer.observe(element)
      })
    }

    register()
    const mutations = new MutationObserver(register)
    mutations.observe(document.getElementById('root'), { childList: true, subtree: true })
    return () => {
      mutations.disconnect()
      observer.disconnect()
    }
  }, [])

  return children
}

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
        <MotionObserver><App /></MotionObserver>
      </BrowserRouter>
    </AppErrorBoundary>
  </React.StrictMode>,
)
