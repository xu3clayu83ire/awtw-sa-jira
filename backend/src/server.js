import 'dotenv/config'
import { createApp } from './app.js'

const port = process.env.PORT || 3001
createApp().listen(port, () => {
  console.log(`Jira proxy listening on port ${port}`)
})
