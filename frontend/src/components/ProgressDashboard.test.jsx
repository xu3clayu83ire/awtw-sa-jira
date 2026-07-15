import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import ProgressDashboard from './ProgressDashboard'

describe('ProgressDashboard', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('應該_顯示Jira票即時狀態_當呼叫Jira API成功', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ key: 'ASJ-115', summary: '測試任務', status: '待辦事項' }),
    })

    render(<ProgressDashboard issueKeys={['ASJ-115']} />)

    await waitFor(() => {
      expect(screen.getByText('ASJ-115')).toBeInTheDocument()
      expect(screen.getByText('待辦事項')).toBeInTheDocument()
    })

    // 只讀不寫：只呼叫 proxy 的查詢端點，沒有任何 POST/PUT 寫入呼叫
    const calls = global.fetch.mock.calls
    expect(calls.every(([, options]) => !options || !options.method || options.method === 'GET')).toBe(true)
  })
})
