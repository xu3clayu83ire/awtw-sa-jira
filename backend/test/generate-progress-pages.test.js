import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { generateProgressPages } from '../scripts/generate-progress-pages.js'

describe('generateProgressPages', () => {
  let specDir
  let contentDir

  beforeEach(() => {
    specDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-src-'))
    contentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-dst-'))
    fs.mkdirSync(path.join(specDir, 'feature-a'))
    fs.mkdirSync(path.join(contentDir, 'feature-a'))
  })

  afterEach(() => {
    fs.rmSync(specDir, { recursive: true, force: true })
    fs.rmSync(contentDir, { recursive: true, force: true })
  })

  it('應該_產出進度儀表板頁面_當功能目錄存在', () => {
    generateProgressPages({ specDir, contentDir, apiBaseUrl: 'http://localhost:3001' })

    const progressPath = path.join(contentDir, 'feature-a', 'progress.md')
    expect(fs.existsSync(progressPath)).toBe(true)

    const content = fs.readFileSync(progressPath, 'utf-8')
    expect(content).toContain('title: "進度儀表板"')
    expect(content).toContain("dashboard('feature-a'")
    expect(content).toContain('http://localhost:3001')
    expect(content).toContain('x-data')
  })
})
