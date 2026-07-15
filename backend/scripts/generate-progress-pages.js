import fs from 'node:fs'
import path from 'node:path'

function dashboardTemplate(feature, apiBaseUrl) {
  return `---
title: "進度儀表板"
weight: 7
bookToC: false
---

<div x-data="dashboard('${feature}', '${apiBaseUrl}')" x-init="load()">
  <div class="progress-summary">
    <div><span x-text="issues.length"></span><label>總票數</label></div>
    <div><span x-text="countByStatus('待辦事項')"></span><label>待辦事項</label></div>
    <div><span x-text="countByStatus('進行中')"></span><label>進行中</label></div>
    <div><span x-text="countByStatus('完成')"></span><label>已完成</label></div>
  </div>

  <table class="progress-table">
    <thead>
      <tr><th>票號</th><th>任務</th><th>狀態</th></tr>
    </thead>
    <tbody>
      <template x-for="issue in issues" :key="issue.key">
        <tr>
          <td x-text="issue.key"></td>
          <td x-text="issue.summary"></td>
          <td x-text="issue.status"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

<script>
function dashboard(feature, apiBaseUrl) {
  return {
    issues: [],
    async load() {
      const listRes = await fetch(\`\${apiBaseUrl}/api/features/\${feature}/issues\`)
      const list = await listRes.json()
      const details = await Promise.all(
        (list.issues || []).map((issue) =>
          fetch(\`\${apiBaseUrl}/api/jira/issue/\${issue.key}\`).then((r) => r.json())
        )
      )
      this.issues = details
      setTimeout(() => this.load(), 30000)
    },
    countByStatus(status) {
      return this.issues.filter((issue) => issue.status === status).length
    },
  }
}
</script>
`
}

export function generateProgressPages({ specDir, contentDir, apiBaseUrl }) {
  if (!fs.existsSync(specDir)) return

  for (const feature of fs.readdirSync(specDir, { withFileTypes: true })) {
    if (!feature.isDirectory()) continue

    const featureDstDir = path.join(contentDir, feature.name)
    fs.mkdirSync(featureDstDir, { recursive: true })
    fs.writeFileSync(
      path.join(featureDstDir, 'progress.md'),
      dashboardTemplate(feature.name, apiBaseUrl)
    )
  }
}
