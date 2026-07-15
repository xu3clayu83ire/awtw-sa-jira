---
title: "tasks-qa"
weight: 5
---

# 會議錄音本機轉逐字稿 — QA 驗收任務

## 前置閱讀
- `_spec/whisperx-transcription/requirement.md`（驗收條件表格）
- `_spec/whisperx-transcription/tasks-backend.md`
- `_spec/whisperx-transcription/tasks-devops.md`

**執行時機**：Backend Phase 1 全部任務完成後。

---

| AC | 情境 | 步驟 | 預期結果 | 實際結果 | Pass/Fail |
|----|------|------|---------|---------|-----------|
| AC1 | 單一檔案轉錄 | 1. 提供一個錄音檔<br>2. 執行 `transcribe.py --input <檔案> --output-dir out` | 產生對應的逐字稿，內容與錄音相符 | | ⬜ |
| AC2 | 整批轉錄 | 1. 提供一個裝有多個錄音檔的資料夾<br>2. 執行 `transcribe.py --input <資料夾> --output-dir out` | 每個錄音檔各自產生一份逐字稿 | | ⬜ |
| AC3 | 語者分離 | 1. 完成 `tasks-devops.md` T02（HF token）<br>2. 提供多人對話錄音<br>3. 執行 `transcribe.py --input <檔案> --output-dir out --hf-token <token>` | 逐字稿依語者分段標示 | | ⬜ |
| AC4 | 不啟用語者分離 | 1. 執行 `transcribe.py --input <檔案> --output-dir out --no-diarize` | 正常產出逐字稿，不需 HF token，不出現 401 | | ⬜ |
| AC5 | 中文辨識 | 1. 提供中文錄音<br>2. 執行預設參數（`--language zh`） | 逐字稿正確辨識為中文內容 | | ⬜ |
| AC6 | 全程本機執行 | 1. 執行轉錄過程中監看網路流量 | 沒有任何音檔資料被上傳到外部伺服器 | | ⬜ |
