---
title: "進度儀表板"
weight: 7
bookToC: false
---

<div x-data="dashboard('sa-doc-jira-ticketing', 'http://localhost:3001')" x-init="load()">
  <div class="progress-summary">
    <div><span x-text="issues.length"></span><label>總票數</label></div>
    <div><span x-text="countByStatus('待辦事項')"></span><label>待辦事項</label></div>
    <div><span x-text="countByStatus('進行中')"></span><label>進行中</label></div>
    <div class="accent"><span x-text="countByStatus('完成')"></span><label>已完成</label></div>
  </div>

  <div class="progress-table-wrap">
    <table class="progress-table">
      <thead>
        <tr><th>票號</th><th>任務</th><th>角色</th><th>執行方式</th><th>狀態</th></tr>
      </thead>
      <tbody>
        <template x-for="issue in issues" :key="issue.key">
          <tr>
            <td><span class="progress-key" x-text="issue.key"></span></td>
            <td x-text="issue.summary"></td>
            <td><span class="progress-role" x-text="issue.role"></span></td>
            <td x-text="issue.executorType === 'manual' ? '👤 手動' : (issue.executorType ? '🤖 AI' : '')"></td>
            <td>
              <span class="progress-status"
                    :class="{
                      'todo': issue.status === '待辦事項',
                      'progress': issue.status === '進行中',
                      'done': issue.status === '完成'
                    }"
                    x-text="issue.status"></span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</div>

<script>
function dashboard(feature, apiBaseUrl) {
  return {
    issues: [],
    async load() {
      const listRes = await fetch(`${apiBaseUrl}/api/features/${feature}/issues`)
      const list = await listRes.json()
      const details = await Promise.all(
        (list.issues || []).map((issue) =>
          fetch(`${apiBaseUrl}/api/jira/issue/${issue.key}`).then((r) => r.json())
        )
      )
      // jira-issues.json 的順序取決於 n8n 併發建票時的回應順序，不等於票號順序，
      // 顯示前依票號數字排序
      this.issues = details.sort((a, b) => {
        const numA = parseInt(a.key.split('-')[1], 10)
        const numB = parseInt(b.key.split('-')[1], 10)
        return numA - numB
      })
      setTimeout(() => this.load(), 30000)
    },
    countByStatus(status) {
      return this.issues.filter((issue) => issue.status === status).length
    },
  }
}
</script>
