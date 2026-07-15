import fs from 'node:fs'
import path from 'node:path'

const TITLE_WEIGHT = {
  'requirement.md': 1,
  'design.md': 2,
  'tasks-frontend.md': 3,
  'tasks-backend.md': 4,
  'tasks-qa.md': 5,
  'tasks-devops.md': 6,
}

export function syncDocs({ specDir, contentDir }) {
  if (!fs.existsSync(specDir)) return

  for (const feature of fs.readdirSync(specDir, { withFileTypes: true })) {
    if (!feature.isDirectory()) continue

    const featureSrcDir = path.join(specDir, feature.name)
    const featureDstDir = path.join(contentDir, feature.name)
    fs.mkdirSync(featureDstDir, { recursive: true })

    for (const filename of fs.readdirSync(featureSrcDir)) {
      if (!filename.endsWith('.md')) continue

      const content = fs.readFileSync(path.join(featureSrcDir, filename), 'utf-8')
      const title = filename.replace(/\.md$/, '')
      const weight = TITLE_WEIGHT[filename] || 99
      const frontMatter = `---\ntitle: "${title}"\nweight: ${weight}\n---\n\n`

      fs.writeFileSync(path.join(featureDstDir, filename), frontMatter + content)
    }
  }
}
