import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import App from '@/App'
import { queryClient } from './setup'

describe('Routing Tests', () => {
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )

  test('renders home page by default', () => {
    render(<App />, { wrapper })
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  test('protects private routes when not authenticated', () => {
    render(<App />, { wrapper })
    // Navigate to protected route
    window.history.pushState({}, '', '/profile')
    expect(screen.getByText(/login required/i)).toBeInTheDocument()
  })

  test('handles 404 pages', () => {
    render(<App />, { wrapper })
    window.history.pushState({}, '', '/nonexistent')
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })
}) 