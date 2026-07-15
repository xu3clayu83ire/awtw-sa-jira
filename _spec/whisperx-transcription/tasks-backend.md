# 會議錄音本機轉逐字稿 — Backend 任務

## 前置閱讀
- `_spec/whisperx-transcription/requirement.md`
- `_spec/whisperx-transcription/design.md`（CLI 參數契約、資料模型）
- `_spec/whisperx-transcription/tasks-devops.md`（Phase 0 環境安裝）

---

## Phase 1 — CLI 工具實作（~2h）

### T01 — 實作 `transcribe.py`：讀取音檔並執行語音辨識 ⬜　🤖 AI 執行

**依賴**：`tasks-devops.md` T01

依 `design.md` CLI 參數契約，支援單一檔案與資料夾兩種輸入模式，呼叫 WhisperX 完成語音辨識與時間戳對齊。

**完成定義**：
- 測試命名：`應該_產出逐字稿segments_當提供合法音檔`
- 🔴 紅燈確認：腳本未實作前，無法產出任何輸出檔案
- 🟢 綠燈確認：提供測試音檔，產出的 `TranscriptOutput` JSON 的 `segments` 內容與時間戳正確對應語音內容
- 單元測試覆蓋率 100%

---

### T02 — 加入語者分離（可選） ⬜　🤖 AI 執行

**依賴**：T01、`tasks-devops.md` T02（僅測試語者分離路徑時需要）

依 `--hf-token`／`--no-diarize` 參數決定是否執行 pyannote 語者分離，結果併入 `TranscriptSegment.speaker` 欄位。

**完成定義**：
- 測試命名：`應該_標示語者_當啟用語者分離`
- 測試命名：`應該_跳過語者分離_當帶有no-diarize參數`
- 🔴 紅燈確認：語者分離未實作前，`segments` 沒有 `speaker` 欄位
- 🟢 綠燈確認：兩種情境皆符合預期（啟用時有 `speaker` 標籤，跳過時正常產出但無此欄位）
- 單元測試覆蓋率 100%

---

### T03 — 輸出三種格式檔案（txt／srt／json） ⬜　🤖 AI 執行

**依賴**：T01、T02

依 `TranscriptOutput` 資料，產出人類可讀逐字稿（`.txt`）、字幕檔（`.srt`，含時間碼）、結構化資料（`.json`）。

**完成定義**：
- 測試命名：`應該_產出三種格式檔案_當轉錄完成`
- 🔴 紅燈確認：輸出模組未實作前，`--output-dir` 底下沒有對應檔案
- 🟢 綠燈確認：三個檔案都存在，`.srt` 含正確時間碼格式，`.json` 符合 `TranscriptOutput` schema
- 單元測試覆蓋率 100%
