import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DocumentViewer from './DocumentViewer'

describe('DocumentViewer', () => {
  it('應該_顯示空狀態不報錯_當文件尚未產出', () => {
    render(<DocumentViewer documents={{}} />)
    expect(screen.getByText('尚未產出文件')).toBeInTheDocument()
  })

  it('應該_正確渲染文件內容_當文件已產出', () => {
    const documents = {
      requirement: '# 需求文件\n\n測試內容',
      design: '# 系統設計文件\n\n測試內容',
    }
    render(<DocumentViewer documents={documents} />)

    expect(screen.getByRole('heading', { name: '需求文件' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '系統設計文件' })).toBeInTheDocument()
  })
})
