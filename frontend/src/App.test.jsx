import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('應該_動態顯示選定功能的文件與票號_當API回傳資料', async () => {
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/features/whisperx-transcription/issues')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ created: 1, issues: [{ key: 'ASJ-200', url: 'x' }] }),
        })
      }
      if (url.includes('/api/documents/whisperx-transcription')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ 'requirement.md': '# WhisperX 需求文件' }),
        })
      }
      if (url.includes('/api/features')) {
        return Promise.resolve({
          ok: true,
          json: async () => ['whisperx-transcription'],
        })
      }
      if (url.includes('/api/jira/issue/ASJ-200')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ key: 'ASJ-200', summary: '測試', status: '待辦事項' }),
        })
      }
      return Promise.reject(new Error(`unexpected fetch: ${url}`))
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'WhisperX 需求文件' })).toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByText('ASJ-200')).toBeInTheDocument()
    })
  })
})
