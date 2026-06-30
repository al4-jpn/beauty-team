# 🚨 今すぐ実行すべきこと

**現在の状況**: 404 エラーが出ている
**原因**: ほぼ確実に `index.html` がアップロードされていない

---

## 📋 今すぐ実行（3ステップ）

### ステップ A: GitHub で確認（1分）

```
1. https://github.com/al4-jpn/beauty-team を開く

2. Code タブを見る

3. 以下が表示されているか確認:
   ✅ index.html が見える
   ✅ app.js が見える
   ✅ README.md が見える
```

**見えない場合 → ステップ B へ**  
**見える場合 → ステップ C へ**

---

### ステップ B: ファイルをアップロード（5分）

```bash
# 1. ターミナル（コマンドプロンプト）を開く

# 2. clone
git clone https://github.com/al4-jpn/beauty-team.git
cd beauty-team

# 3. 以下の 5 つのファイルをこのフォルダにコピー:
#    - index.html
#    - app.js
#    - README.md
#    - OAUTH_SETUP.md
#    - .gitignore
#    （ダウンロードしたファイルをここにドラッグ&ドロップ）

# 4. Git に追加
git add .

# 5. コミット
git commit -m "Add slideshow manager"

# 6. プッシュ
git push origin main

# 7. GitHub にログイン情報を入力
```

**プッシュ後:**
- https://github.com/al4-jpn/beauty-team をリロード
- Code タブで `index.html` が見えるか確認

---

### ステップ C: Pages 設定を確認（3分）

```
1. https://github.com/al4-jpn/beauty-team/settings/pages を開く

2. 以下を確認:
   ✅ Source: Deploy from a branch
   ✅ Branch: main
   ✅ Folder: / (root)  ← ここが重要！

3. 違っていたら修正して Save をクリック

4. 5～10分待つ
```

---

### ステップ D: ブラウザキャッシュをクリア（1分）

```
キーボードショートカット:
Ctrl + Shift + Delete  (Windows)
Cmd + Shift + Delete   (Mac)

またはシークレットウィンドウで開く
```

---

### ステップ E: アクセス

```
https://al4-jpn.github.io/beauty-team
```

**表示されたら成功！** 🎉

---

## 🔧 うまくいかない場合

### 確認1: GitHub に正しくアップロードされているか

**URL**: https://github.com/al4-jpn/beauty-team/actions

```
Deploy to GitHub Pages で ✅ 緑色のチェックが見える？

見える → Pages 設定に進む
見えない → 赤いバツが表示（エラー）
         → エラーメッセージを読む
         → ほぼ「index.html が見つからない」
```

### 確認2: Pages 設定が正しいか

**URL**: https://github.com/al4-jpn/beauty-team/settings/pages

```
Source: Deploy from a branch ✓
Branch: [main ▼] ✓
Folder: [/ (root) ▼] ✓

全て正しい？

Yes → 5～10分待つ
No → 修正して Save をクリック
```

### 確認3: ブラウザが古いキャッシュを表示していないか

```
1. Ctrl + Shift + Delete でキャッシュをクリア
2. または別のブラウザで試す
3. または https://al4-jpn.github.io/beauty-team/?v=2 
   のように末尾に ?v=2 を付ける
```

---

## 📞 具体的なコマンド一覧

### コマンドがわからない場合

```bash
# 【Step 1】ローカルに clone
git clone https://github.com/al4-jpn/beauty-team.git
cd beauty-team

# 【Step 2】ファイルをこのフォルダに入れた後:
git status
# 追加されたファイルが表示されるはず

# 【Step 3】ステージング
git add .

# 【Step 4】コミット
git commit -m "Add slideshow manager"

# 【Step 5】プッシュ
git push origin main

# 【Step 6】GitHub で確認
# https://github.com/al4-jpn/beauty-team
```

---

## 📱 Windows PowerShell の場合

```powershell
# clone
git clone https://github.com/al4-jpn/beauty-team.git
cd beauty-team

# フォルダの中を見る
dir
# index.html, app.js などが見える？

# その他は同じ
git add .
git commit -m "Add slideshow manager"
git push origin main
```

---

## 🎯 最後の確認

```
✅ GitHub の Code タブで index.html が見える
✅ Pages の Source = Deploy from a branch
✅ Pages の Branch = main
✅ Pages の Folder = / (root)
✅ Actions で ✅ 成功している
✅ 5～10分経過した
✅ ブラウザキャッシュをクリアした
✅ https://al4-jpn.github.io/beauty-team にアクセス

全てチェック完了 → 管理画面が表示される！
```

---

## ⏱️ 時間の目安

| ステップ | 時間 |
|---------|------|
| A: GitHub 確認 | 1分 |
| B: ファイルアップロード | 5分 |
| C: Pages 設定 | 3分 |
| D: キャッシュクリア | 1分 |
| 待機（デプロイ） | 5～10分 |
| **合計** | **15～25分** |

---

**これで 100% 治ります！** 💪

わからないことがあったら、`404_FIX_GUIDE.md` の詳しい説明を参照してください。
