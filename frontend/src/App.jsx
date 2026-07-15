import { useState } from 'react'
import DocumentViewer from './components/DocumentViewer'
import ProgressDashboard from './components/ProgressDashboard'

function App() {
  const [documents] = useState({})

  return (
    <main>
      <h1>SA 文件產出與 Jira 自動開票工具</h1>
      <DocumentViewer documents={documents} />
      <ProgressDashboard issueKeys={['ASJ-115']} />
    </main>
  )
}

export default App
