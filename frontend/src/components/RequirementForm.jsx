import { useState } from 'react'

export default function RequirementForm({ onSubmit }) {
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description.trim()) {
      return
    }
    onSubmit(description)
    setSubmitting(true)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="requirement-description">需求描述</label>
      <textarea
        id="requirement-description"
        aria-label="需求描述"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">送出需求</button>
      {submitting && <p>產出中...</p>}
    </form>
  )
}
