# JnL1024

J 與 L 的婚禮網站。賓客可以查看放在 Google Drive 的婚照、瀏覽座位表，並用姓名或稱呼找到自己的桌次。

日期、姓名、照片與座位都在 `wedding-data.js`。

## 接上 Google Drive 婚照

1. 在 Google Drive 建立資料夾，上傳照片。
2. 點「共用」，把一般存取權改成「知道連結的任何人」，身分選「檢視者」。
3. 複製資料夾連結，貼到 `wedding-data.js` 的 `driveFolder`。

網站會嵌入這個資料夾。若嵌入後是空白或要求登入，代表存取權仍限於特定帳號；請改成知道連結的任何人都能檢視。也可以把每一張照片的分享連結放進 `photos`，網站會排成照片牆：

```js
driveFolder: "https://drive.google.com/drive/folders/你的資料夾ID",
photos: [
  "https://drive.google.com/file/d/照片ID/view",
  { url: "https://drive.google.com/file/d/另一張ID/view", caption: "海邊" },
],
```

## 更換座位表

座位以 Google 試算表為準，`wedding-data.js` 的 `seatingSheetId` 指向那份表。網站每次開啟都會讀取最新列，所以改完試算表、重新整理頁面就會同步。`tables` 只在試算表讀不到時備用。

姓名欄寫賓客會看到的本名或稱位。暱稱放在括號裡，搜尋得到，但頁面上不顯示，例如 `吳政霖 (毛毛)`。括號裡只有數字代表人數，例如 `雪岑姊姊 (3)`。`小劉(佩妘老公)` 這種關係稱位仍會顯示。飲食備註寫在第四欄。

座位名單會跟著網站一起公開。若不想公開某位賓客的名字，不要寫進試算表。

## 本機預覽

在專案資料夾執行：

```bash
py -m http.server 8765
```

然後開啟 `http://127.0.0.1:8765/`。
