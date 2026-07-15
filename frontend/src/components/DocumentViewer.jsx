import ReactMarkdown from 'react-markdown'

export default function DocumentViewer({ documents }) {
  const entries = Object.entries(documents || {})

  if (entries.length === 0) {
    return <p>尚未產出文件</p>
  }

  return (
    <div>
      {entries.map(([key, content]) => (
        <article key={key}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      ))}
    </div>
  )
}
