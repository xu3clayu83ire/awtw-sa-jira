# 會議錄音轉逐字稿(本地端 / WhisperX)

從本地錄音檔產生逐字稿,支援語者分離(標出「誰說了什麼」)。全程在你自己的電腦上執行,音檔不會上傳到任何地方。

## 安裝

```bash
# 1. 安裝 PyTorch(先確認你的 CUDA 版本,或用 CPU 版本)
pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu124   # 有 NVIDIA GPU
# 或
pip install torch torchaudio   # 只有 CPU

# 2. 安裝 WhisperX
pip install whisperx
```

## 語者分離需要的額外設定(可略過)

如果要區分「誰說了什麼」,需要一組 Hugging Face token:

1. 到 https://huggingface.co 註冊免費帳號
2. 到以下兩個模型頁面,各自點選同意使用條款(兩個都要同意,漏一個會出現 401 錯誤):
   - https://huggingface.co/pyannote/speaker-diarization-3.1
   - https://huggingface.co/pyannote/segmentation-3.0
3. 到 https://huggingface.co/settings/tokens 建立一組 token

如果不需要語者分離,加上 `--no-diarize` 參數即可跳過,不需要申請 token。

## 使用方式

```bash
# 單一檔案,含語者分離
python transcribe.py --input meeting.mp3 --output-dir out --hf-token hf_xxxxxxxx

# 整個資料夾(自動找 mp3/wav/m4a/mp4 等格式)
python transcribe.py --input ./recordings --output-dir out --hf-token hf_xxxxxxxx

# 不需要語者分離,速度較快
python transcribe.py --input meeting.mp3 --output-dir out --no-diarize

# 已知會議人數(2~5 人),可提高語者分離準確度
python transcribe.py --input meeting.mp3 --output-dir out --hf-token hf_xxx --min-speakers 2 --max-speakers 5
```

## 輸出

每個音檔會在 `--output-dir` 產生 3 個檔案:

| 檔案 | 內容 |
|---|---|
| `{檔名}.txt` | 人類可讀的逐字稿,依語者分段(`[SPEAKER_00]` 等標籤) |
| `{檔名}.srt` | 字幕格式,含時間碼,可直接用字幕軟體或影片編輯器開啟 |
| `{檔名}.json` | 完整結構化資料(每段文字、時間戳、語者),方便下一步接 Claude API 做摘要整理 |

## 常見參數

| 參數 | 說明 | 預設值 |
|---|---|---|
| `--model` | Whisper 模型大小,越大越準但越慢(tiny/base/small/medium/large-v3) | `large-v3` |
| `--language` | 語言代碼,`zh` 為中文;`--language auto` 自動偵測 | `zh` |
| `--device` | `cuda` 或 `cpu` | 自動偵測 |
| `--batch-size` | GPU 記憶體不足時可調小(例如 4 或 8) | `16` |

## 硬體建議

- 有 NVIDIA GPU(8GB+ VRAM):`large-v3` 模型可用,速度快
- 只有 CPU:建議先用 `--model small` 或 `--model medium` 測試,`large-v3` 在純 CPU 下會非常慢,語者分離尤其明顯

## 下一步

`{檔名}.json` 已經是結構化資料,之後如果要接 Claude API 做會議記錄摘要整理,直接讀這個檔案即可,不需要重新解析 `.txt` 或 `.srt`。
