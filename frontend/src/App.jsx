import { useState } from 'react'
import RequirementForm from './components/RequirementForm'
import DocumentViewer from './components/DocumentViewer'
import ProgressDashboard from './components/ProgressDashboard'

function App() {
  const [documents, setDocuments] = useState({})

  const handleSubmit = (description) => {
    // 文件產出流程串接留待實際上線環境決定（呼叫 Claude Code / saspec 流程的入口）
    console.log('送出需求：', description)
  }

  return (
    <main>
      <h1>SA 文件產出與 Jira 自動開票工具</h1>
      <RequirementForm onSubmit={handleSubmit} />
      <DocumentViewer documents={documents} />
      <ProgressDashboard issueKeys={['ASJ-115']} />
    </main>
  )
}

export default App
