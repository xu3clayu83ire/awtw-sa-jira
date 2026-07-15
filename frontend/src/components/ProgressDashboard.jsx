import { useEffect, useState } from 'react'

const PROXY_BASE_URL = import.meta.env.VITE_PROXY_BASE_URL || 'http://localhost:3001'

export default function ProgressDashboard({ issueKeys }) {
  const [issues, setIssues] = useState([])

  useEffect(() => {
    let cancelled = false

    Promise.all(
      issueKeys.map((key) =>
        fetch(`${PROXY_BASE_URL}/api/jira/issue/${key}`).then((res) => res.json())
      )
    ).then((results) => {
      if (!cancelled) {
        setIssues(results)
      }
    })

    return () => {
      cancelled = true
    }
  }, [issueKeys])

  return (
    <ul>
      {issues.map((issue) => (
        <li key={issue.key}>
          <span>{issue.key}</span>
          <span>{issue.summary}</span>
          <span>{issue.status}</span>
        </li>
      ))}
    </ul>
  )
}
