import apiClient from '@/services/api/client'
import { vi } from 'vitest'

describe('API Service Tests', () => {
  test('adds auth token to requests', async () => {
    localStorage.setItem('token', 'test-token')
    const requestSpy = vi.spyOn(apiClient, 'request')
    
    await apiClient.get('/test')
    
    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token'
        })
      })
    )
  })

  test('handles request retry logic', async () => {
    const mockError = { response: { status: 500 } }
    vi.spyOn(apiClient, 'request')
      .mockRejectedValueOnce(mockError)
      .mockResolvedValueOnce({ data: 'success' })
    
    const result = await apiClient.get('/test')
    expect(result).toBe('success')
    expect(apiClient.request).toHaveBeenCalledTimes(2)
  })
}) 