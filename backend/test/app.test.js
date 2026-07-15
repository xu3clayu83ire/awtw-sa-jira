import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'

describe('GET /api/jira/issue/:key', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    process.env.JIRA_SITE_URL = 'https://example.atlassian.net'
    process.env.JIRA_EMAIL = 'test@example.com'
    process.env.JIRA_API_TOKEN = 'fake-token'
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('應該_回傳票狀態_當查詢有效的Jira票號', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        key: 'ASJ-115',
        fields: {
          summary: '測試任務',
          status: { name: 'To Do' },
          labels: ['backend', 'AI'],
        },
      }),
    })

    const app = createApp()
    const res = await request(app).get('/api/jira/issue/ASJ-115')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      key: 'ASJ-115',
      summary: '測試任務',
      status: 'To Do',
      role: 'backend',
      executorType: 'AI',
    })

    const [calledUrl, calledOptions] = global.fetch.mock.calls[0]
    expect(calledUrl).toBe('https://example.atlassian.net/rest/api/3/issue/ASJ-115')
    // 憑證不可外流：確認呼叫時是走 Authorization header，不是把 token 拼進 URL
    expect(calledOptions.headers.Authorization).toMatch(/^Basic /)
    expect(calledUrl).not.toContain('fake-token')
  })

  it('應該_回傳404與明確錯誤_當Jira票不存在', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ errorMessages: ['Issue does not exist'] }),
    })

    const app = createApp()
    const res = await request(app).get('/api/jira/issue/NOTFOUND-1')

    expect(res.status).toBe(404)
    expect(res.body.error).toBeDefined()
  })
})
