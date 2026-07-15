import fs from 'node:fs'
import path from 'node:path'

const TITLE_MAP = {
  'requirement.md': { title: '需求文件', weight: 1 },
  'design.md': { title: '系統設計文件', weight: 2 },
  'tasks-frontend.md': { title: '開發任務清單（前端）', weight: 3 },
  'tasks-backend.md': { title: '開發任務清單（後端）', weight: 4 },
  'tasks-qa.md': { title: '開發任務清單（QA）', weight: 5 },
  'tasks-devops.md': { title: '開發任務清單（DevOps）', weight: 6 },
}

export function syncDocs({ specDir, contentDir }) {
  if (!fs.existsSync(specDir)) return

  for (const feature of fs.readdirSync(specDir, { withFileTypes: true })) {
    if (!feature.isDirectory()) continue

    const featureSrcDir = path.join(specDir, feature.name)
    const featureDstDir = path.join(contentDir, feature.name)
    fs.mkdirSync(featureDstDir, { recursive: true })

    // 沒有 _index.md，hugo-book 就無法把這個目錄辨識成獨立區塊，
    // 選單會攤平成同一層、只照 weight 排序，不分功能分組。
    fs.writeFileSync(
      path.join(featureDstDir, '_index.md'),
      `---\ntitle: "${feature.name}"\nbookCollapseSection: true\n---\n`
    )

    for (const filename of fs.readdirSync(featureSrcDir)) {
      if (!filename.endsWith('.md')) continue

      const content = fs.readFileSync(path.join(featureSrcDir, filename), 'utf-8')
      const meta = TITLE_MAP[filename] || { title: filename.replace(/\.md$/, ''), weight: 99 }
      const frontMatter = `---\ntitle: "${meta.title}"\nweight: ${meta.weight}\n---\n\n`

      fs.writeFileSync(path.join(featureDstDir, filename), frontMatter + content)
    }
  }
}
