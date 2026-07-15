import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { syncDocs } from '../scripts/sync-docs.js'

describe('syncDocs', () => {
  let specDir
  let contentDir

  beforeEach(() => {
    specDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-src-'))
    contentDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-dst-'))
    fs.mkdirSync(path.join(specDir, 'feature-a'))
    fs.writeFileSync(path.join(specDir, 'feature-a', 'requirement.md'), '# 需求內容')
    fs.writeFileSync(path.join(specDir, 'feature-a', 'design.md'), '# 設計內容')
    fs.writeFileSync(path.join(specDir, 'feature-a', 'jira-issues.json'), '{}')
  })

  afterEach(() => {
    fs.rmSync(specDir, { recursive: true, force: true })
    fs.rmSync(contentDir, { recursive: true, force: true })
  })

  it('應該_同步文件並補上front matter_當_spec目錄存在對應功能', () => {
    syncDocs({ specDir, contentDir })

    const requirementPath = path.join(contentDir, 'feature-a', 'requirement.md')
    const designPath = path.join(contentDir, 'feature-a', 'design.md')

    expect(fs.existsSync(requirementPath)).toBe(true)
    expect(fs.existsSync(designPath)).toBe(true)

    const requirementContent = fs.readFileSync(requirementPath, 'utf-8')
    expect(requirementContent).toMatch(/^---\ntitle: "需求文件"\nweight: \d+\n---\n\n# 需求內容/)

    // jira-issues.json 不是文件，不該被同步
    expect(fs.existsSync(path.join(contentDir, 'feature-a', 'jira-issues.json'))).toBe(false)
  })

  it('應該_產出_index.md讓Hugo辨識為區塊_當同步功能目錄', () => {
    syncDocs({ specDir, contentDir })

    const indexPath = path.join(contentDir, 'feature-a', '_index.md')
    expect(fs.existsSync(indexPath)).toBe(true)

    const content = fs.readFileSync(indexPath, 'utf-8')
    expect(content).toContain('title: "feature-a"')
  })
})
