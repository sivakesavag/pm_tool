import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignIn from '@/app/(auth)/signin/page'
import { useAuthStore } from '@/store/authStore'

// Mock the auth store
jest.mock('@/store/authStore')

describe('SignIn Component', () => {
  const mockLogin = jest.fn()
  const mockClearError = jest.fn()

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Mock the auth store implementation
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      error: null,
      clearError: mockClearError,
      isLoading: false,
    }))
  })

  it('renders sign in form', () => {
    render(<SignIn />)
    
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('handles successful login', async () => {
    render(<SignIn />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123')
    })
  })

  it('displays error message when login fails', async () => {
    const errorMessage = 'Invalid credentials'
    
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      error: errorMessage,
      clearError: mockClearError,
      isLoading: false,
    }))

    render(<SignIn />)
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('shows loading state during login', () => {
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      error: null,
      clearError: mockClearError,
      isLoading: true,
    }))

    render(<SignIn />)
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  it('clears error when input changes', () => {
    (useAuthStore as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      error: 'Initial error',
      clearError: mockClearError,
      isLoading: false,
    }))

    render(<SignIn />)
    
    const usernameInput = screen.getByPlaceholderText(/username/i)
    fireEvent.change(usernameInput, { target: { value: 'newuser' } })

    expect(mockClearError).toHaveBeenCalled()
  })
})
