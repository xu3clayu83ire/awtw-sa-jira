# 網頁 UI 改用文件站樣式呈現 — Backend 任務

## 前置閱讀
- `_spec/hugo-book-ui/requirement.md`
- `_spec/hugo-book-ui/design.md`（模組拆解、已知風險）
- `_spec/hugo-book-ui/tasks-devops.md`（Phase 0 環境建置）

---

## Phase 1 — 文件同步與儀表板頁面（~2h）

### T01 — 撰寫文件同步腳本 ✅　🤖 AI 執行

**依賴**：`tasks-devops.md` T03

讀取 `_spec/<功能>/*.md`，複製到 `hugo-docs/content/docs/<功能>/*.md`，補上 Hugo 需要的 front matter（`title`、`weight`）。實作於 `backend/scripts/sync-docs.js`。

**完成定義**：
- 測試命名：`應該_同步文件並補上front matter_當_spec目錄存在對應功能`
- 🔴 紅燈確認：腳本未實作前，`content/docs/` 底下沒有對應檔案 ✅ 已重現
- 🟢 綠燈確認：執行腳本，`content/docs/<功能>/` 出現對應 `.md` 檔案，開頭有正確的 front matter ✅ 已測試通過
- 單元測試覆蓋率 100% ✅

---

### T02 — 同步既有兩個功能的文件 ⬜　🤖 AI 執行

**依賴**：T01

對 `sa-doc-jira-ticketing`、`whisperx-transcription`（以及本功能 `hugo-book-ui` 自己）執行同步腳本。

**完成定義**：
- 🟢 綠燈確認：`hugo server` 啟動後，左側選單能看到三個功能，點進去能看到對應文件內容

---

### T03 — 實作進度儀表板頁面（Hugo 自訂 layout + Alpine.js） ⬜　🤖 AI 執行

**依賴**：`tasks-devops.md` T03

依 `design.md` 與已確認的 mockup 畫面，做出摘要條（總票數／待辦／進行中／已完成）+ 票號表格（票號、任務、角色、執行方式、狀態），用 Alpine.js `fetch` backend proxy API。

**完成定義**：
- 🔴 紅燈確認：頁面未實作前，選單裡沒有「進度儀表板」連結
- 🟢 綠燈確認：點選任一功能的「進度儀表板」，畫面正確顯示該功能的 Jira 票號、狀態分類數量正確

---

### T04 — 移除 React frontend ⬜　🤖 AI 執行

**依賴**：T02、T03（新方案跑通後才移除舊方案，避免中途沒有任何可用網頁）

刪除 `frontend/` 整個目錄（含其測試）。

**完成定義**：
- 🟢 綠燈確認：`frontend/` 目錄不存在，`hugo-docs/` 為唯一的網頁前端
