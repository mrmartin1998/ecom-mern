import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useQueryState } from '@/hooks/useQueryState'
import { AuthProvider, useAuth } from '@/context/AuthContext'

describe('State Management Tests', () => {
  test('useLocalStorage persists and retrieves data', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initial'))
    
    act(() => {
      result.current[1]('updated value')
    })
    
    expect(result.current[0]).toBe('updated value')
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('updated value'))
  })

  test('useQueryState manages server state', async () => {
    const { result, waitFor } = renderHook(
      () => useQueryState('test', '/api/test'),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      }
    )

    await waitFor(() => result.current.isSuccess)
    expect(result.current.data).toBeDefined()
  })
}) 