# 會議錄音本機轉逐字稿 — DevOps 任務

## 前置閱讀
- `_spec/whisperx-transcription/requirement.md`
- `_spec/whisperx-transcription/design.md`（已知風險與對策）

---

## Phase 0 — 環境安裝（~1h）

### T01 — 安裝 PyTorch 與 WhisperX ⬜　🤖 AI 執行

依 `design.md` CLI 參數契約，確認硬體是否有 NVIDIA GPU（及 CUDA 版本），安裝對應的 PyTorch 版本，再安裝 WhisperX。

```bash
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu124   # 有 GPU
# 或
pip install torch torchaudio   # 只有 CPU

pip install whisperx
```

**完成定義**：
- 🟢 綠燈確認：`python -c "import whisperx"` 不報錯

---

### T02 — 申請 Hugging Face token 並同意模型使用條款（僅需語者分離時） ⬜　👤 手動執行

**依賴**：無（若確定不需要語者分離，可完全跳過本任務，執行時加 `--no-diarize`）

1. 至 https://huggingface.co 註冊帳號
2. 至以下兩個模型頁面各自同意使用條款（兩個都要，漏一個會出現 401 錯誤）：
   - https://huggingface.co/pyannote/speaker-diarization-3.1
   - https://huggingface.co/pyannote/segmentation-3.0
3. 至 https://huggingface.co/settings/tokens 建立一組 token

> 👤 手動原因：需要個人帳號登入、同意條款，AI 無法代勞。

**完成定義**：
- 🟢 綠燈確認：`transcribe.py` 帶 `--hf-token` 執行語者分離不出現 401 錯誤

---

## ⏳ 待人工處理

- [ ] T02 — 申請 Hugging Face token（僅需語者分離時才要做，不阻塞 T01 與其他不需要語者分離的使用情境）
