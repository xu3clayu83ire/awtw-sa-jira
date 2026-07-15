import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RequirementForm from './RequirementForm'

describe('RequirementForm', () => {
  it('應該_送出需求後觸發文件產出_當表單內容合法', () => {
    const onSubmit = vi.fn()
    render(<RequirementForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('需求描述'), {
      target: { value: '建立一個自動化開票工具' },
    })
    fireEvent.click(screen.getByRole('button', { name: '送出需求' }))

    expect(onSubmit).toHaveBeenCalledWith('建立一個自動化開票工具')
    expect(screen.getByText('產出中...')).toBeInTheDocument()
  })

  it('應該_阻擋送出_當需求描述為空', () => {
    const onSubmit = vi.fn()
    render(<RequirementForm onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: '送出需求' }))

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
