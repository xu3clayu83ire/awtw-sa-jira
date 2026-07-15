import { useEffect, useState } from 'react'
import DocumentViewer from './components/DocumentViewer'
import ProgressDashboard from './components/ProgressDashboard'

const PROXY_BASE_URL = import.meta.env.VITE_PROXY_BASE_URL || 'http://localhost:3001'

function App() {
  const [features, setFeatures] = useState([])
  const [selectedFeature, setSelectedFeature] = useState('')
  const [documents, setDocuments] = useState({})
  const [issueKeys, setIssueKeys] = useState([])

  useEffect(() => {
    fetch(`${PROXY_BASE_URL}/api/features`)
      .then((res) => res.json())
      .then((list) => {
        setFeatures(list)
        if (list.length > 0) {
          setSelectedFeature(list[0])
        }
      })
  }, [])

  useEffect(() => {
    if (!selectedFeature) return

    fetch(`${PROXY_BASE_URL}/api/documents/${selectedFeature}`)
      .then((res) => res.json())
      .then(setDocuments)

    fetch(`${PROXY_BASE_URL}/api/features/${selectedFeature}/issues`)
      .then((res) => res.json())
      .then((data) => setIssueKeys((data.issues || []).map((issue) => issue.key)))
  }, [selectedFeature])

  return (
    <main>
      <h1>SA 文件產出與 Jira 自動開票工具</h1>

      <label htmlFor="feature-select">選擇功能</label>
      <select
        id="feature-select"
        value={selectedFeature}
        onChange={(e) => setSelectedFeature(e.target.value)}
      >
        {features.map((feature) => (
          <option key={feature} value={feature}>
            {feature}
          </option>
        ))}
      </select>

      <DocumentViewer documents={documents} />
      <ProgressDashboard issueKeys={issueKeys} />
    </main>
  )
}

export default App
