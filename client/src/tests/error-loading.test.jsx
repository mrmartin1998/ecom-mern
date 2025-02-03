import { render, screen, waitFor } from '@testing-library/react'
import LoadingSpinner from '@/components/common/ui/LoadingSpinner'
import { useQueryState } from '@/hooks/useQueryState'

describe('Error and Loading States Tests', () => {
  test('displays loading spinner', () => {
    render(<LoadingSpinner />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  test('handles and displays errors', async () => {
    const TestComponent = () => {
      const { error, isLoading } = useQueryState('error-test', '/api/error')
      if (isLoading) return <LoadingSpinner />
      if (error) return <div>Error: {error.message}</div>
      return null
    }

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/error:/i)).toBeInTheDocument()
    })
  })
}) 