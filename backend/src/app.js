import express from 'express'
import cors from 'cors'
import fs from 'node:fs'
import path from 'node:path'

function defaultSpecDir() {
  return path.join(process.cwd(), '..', '_spec')
}

export function createApp(options = {}) {
  const specDir = options.specDir || defaultSpecDir()
  const app = express()
  app.use(cors())

  app.get('/api/jira/issue/:key', async (req, res) => {
    const { key } = req.params
    const siteUrl = process.env.JIRA_SITE_URL
    const email = process.env.JIRA_EMAIL
    const token = process.env.JIRA_API_TOKEN
    const auth = Buffer.from(`${email}:${token}`).toString('base64')

    const response = await fetch(`${siteUrl}/rest/api/3/issue/${key}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
      },
    })
    const body = await response.json()

    if (!response.ok) {
      res.status(response.status).json({ error: body.errorMessages || 'Jira API 查詢失敗' })
      return
    }

    res.json({
      key: body.key,
      summary: body.fields?.summary,
      status: body.fields?.status?.name,
    })
  })

  app.get('/api/features', (req, res) => {
    if (!fs.existsSync(specDir)) {
      res.json([])
      return
    }
    const features = fs
      .readdirSync(specDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
    res.json(features)
  })

  app.get('/api/documents/:feature', (req, res) => {
    const featureDir = path.join(specDir, req.params.feature)
    if (!fs.existsSync(featureDir)) {
      res.status(404).json({ error: '找不到這個功能' })
      return
    }

    const documents = {}
    for (const filename of fs.readdirSync(featureDir)) {
      if (filename.endsWith('.md')) {
        documents[filename] = fs.readFileSync(path.join(featureDir, filename), 'utf-8')
      }
    }
    res.json(documents)
  })

  app.get('/api/features/:feature/issues', (req, res) => {
    const issuesFile = path.join(specDir, req.params.feature, 'jira-issues.json')
    if (!fs.existsSync(issuesFile)) {
      res.json({ created: 0, issues: [] })
      return
    }
    const content = JSON.parse(fs.readFileSync(issuesFile, 'utf-8'))
    res.json(content)
  })

  return app
}
