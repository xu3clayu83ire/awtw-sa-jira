import express from 'express'

export function createApp() {
  const app = express()

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

  return app
}
