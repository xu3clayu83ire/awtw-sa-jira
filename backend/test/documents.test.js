import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createApp } from '../src/app.js'

describe('GET /api/features', () => {
  let tempSpecDir

  beforeEach(() => {
    tempSpecDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-test-'))
    fs.mkdirSync(path.join(tempSpecDir, 'feature-a'))
    fs.mkdirSync(path.join(tempSpecDir, 'feature-b'))
  })

  afterEach(() => {
    fs.rmSync(tempSpecDir, { recursive: true, force: true })
  })

  it('應該_回傳功能清單_當_spec目錄下有子資料夾', async () => {
    const app = createApp({ specDir: tempSpecDir })
    const res = await request(app).get('/api/features')

    expect(res.status).toBe(200)
    expect(res.body.sort()).toEqual(['feature-a', 'feature-b'])
  })
})

describe('GET /api/documents/:feature', () => {
  let tempSpecDir

  beforeEach(() => {
    tempSpecDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-test-'))
    fs.mkdirSync(path.join(tempSpecDir, 'feature-a'))
    fs.writeFileSync(path.join(tempSpecDir, 'feature-a', 'requirement.md'), '# 需求')
    fs.writeFileSync(path.join(tempSpecDir, 'feature-a', 'design.md'), '# 設計')
    fs.writeFileSync(path.join(tempSpecDir, 'feature-a', 'jira-issues.json'), '[]')
  })

  afterEach(() => {
    fs.rmSync(tempSpecDir, { recursive: true, force: true })
  })

  it('應該_回傳該功能所有文件內容_當功能存在', async () => {
    const app = createApp({ specDir: tempSpecDir })
    const res = await request(app).get('/api/documents/feature-a')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      'requirement.md': '# 需求',
      'design.md': '# 設計',
    })
    // jira-issues.json 不是文件，不該混進來
    expect(res.body['jira-issues.json']).toBeUndefined()
  })

  it('應該_回傳404_當功能不存在', async () => {
    const app = createApp({ specDir: tempSpecDir })
    const res = await request(app).get('/api/documents/no-such-feature')

    expect(res.status).toBe(404)
  })
})

describe('GET /api/features/:feature/issues', () => {
  let tempSpecDir

  beforeEach(() => {
    tempSpecDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-test-'))
    fs.mkdirSync(path.join(tempSpecDir, 'feature-a'))
  })

  afterEach(() => {
    fs.rmSync(tempSpecDir, { recursive: true, force: true })
  })

  it('應該_回傳票號清單_當jira-issues.json存在', async () => {
    fs.writeFileSync(
      path.join(tempSpecDir, 'feature-a', 'jira-issues.json'),
      JSON.stringify({ created: 1, issues: [{ key: 'ASJ-999', url: 'x' }] })
    )
    const app = createApp({ specDir: tempSpecDir })
    const res = await request(app).get('/api/features/feature-a/issues')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ created: 1, issues: [{ key: 'ASJ-999', url: 'x' }] })
  })

  it('應該_回傳空陣列_當jira-issues.json不存在', async () => {
    const app = createApp({ specDir: tempSpecDir })
    const res = await request(app).get('/api/features/feature-a/issues')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ created: 0, issues: [] })
  })
})
