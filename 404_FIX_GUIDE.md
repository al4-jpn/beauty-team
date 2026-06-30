# 🆘 404 エラー 対処ガイド

**エラー**: `404 File not found`  
**原因**: index.html がリポジトリに見つからない

---

## ⚡ クイック診断

### 問題 1: ファイルがアップロードされていない

**確認方法:**
1. https://github.com/al4-jpn/beauty-team を開く
2. **Code** タブを見る
3. `index.html` が見えている？

```
見える場合 → 問題 2 へ進む
見えない場合 → 以下の対処をする
```

**対処方法:**

```bash
# 1. beauty-team をクローン
git clone https://github.com/al4-jpn/beauty-team.git
cd beauty-team

# 2. 以下のファイルをフォルダにコピー:
# - index.html
# - app.js
# - README.md
# - OAUTH_SETUP.md
# - .gitignore

# 3. ステージング
git add .

# 4. コミット
git commit -m "Add: slideshow manager files"

# 5. プッシュ
git push origin main
```

**プッシュ後:**
- GitHub のリポジトリページをリロード
- `index.html` が見えるはず ✅

---

### 問題 2: Pages 設定が間違っている

**確認方法:**
1. https://github.com/al4-jpn/beauty-team/settings/pages を開く
2. 以下を確認:

```
Source: Deploy from a branch ✓
Branch: main ✓
Folder: / (root) ✓  ← ここが重要！
```

**❌ よくある間違い:**

```
Folder: /docs  ← これは違う
Folder: /public  ← これも違う
Folder: (blank) ← これも違う
```

**修正方法:**

1. Folder のドロップダウンをクリック
2. **`/ (root)`** を選択
3. **Save** をクリック

**修正後:**
- 数分待つ（5～10分）
- 再度アクセス

---

## 🔍 より詳しい診断

### ステップ 1: GitHub に正しくファイルがアップロードされているか確認

**URL:** https://github.com/al4-jpn/beauty-team

**見るべきもの:**
```
📁 beauty-team
  📄 README.md
  📄 index.html    ← これが見えるか？
  📄 app.js        ← これが見えるか？
  📄 OAUTH_SETUP.md
  📄 .gitignore
  📁 .git
```

**見えない場合:**

```bash
# リポジトリをクローン
git clone https://github.com/al4-jpn/beauty-team.git
cd beauty-team

# ファイルをコピー（OSのファイルマネージャーで実行）
# index.html, app.js, README.md などをコピー

# Git で追加
git add index.html
git add app.js
git add README.md
git add OAUTH_SETUP.md
git add .gitignore

# コミット
git commit -m "Add slideshow manager"

# プッシュ
git push origin main
```

### ステップ 2: GitHub Pages が正しく設定されているか確認

**URL:** https://github.com/al4-jpn/beauty-team/settings/pages

**確認項目:**

```
☑️ Build and deployment
    Source: Deploy from a branch
    
☑️ Branch
    [main ▼]
    [/ (root) ▼]
    
☑️ [Save] ボタンをクリック済み
```

**設定が違う場合:**

1. Folder のドロップダウンで **`/ (root)`** を選択
2. **Save** をクリック
3. 5～10分待つ

### ステップ 3: ビルド状況を確認

**URL:** https://github.com/al4-jpn/beauty-team/actions

**見るべきもの:**

```
【ビルド成功】✅
Deploy to GitHub Pages
└─ ✅ (緑色のチェック)

【ビルド失敗】❌
Deploy to GitHub Pages
└─ ❌ (赤色のバツ)
   └─ 詳細を見て原因を確認
```

**失敗している場合:**
- エラーメッセージを読む
- 最も多いエラー: ファイルが見つからない
- 対処: ステップ 1 を実行

---

## 🚀 完全な修正手順（確実に治す）

### 1. Git をインストール確認

```bash
git --version
# バージョンが表示されたら OK
```

### 2. ローカルで clone

```bash
# デスクトップに移動（例）
cd ~/Desktop

# クローン
git clone https://github.com/al4-jpn/beauty-team.git
cd beauty-team

# 現在のファイルを確認
ls
# または Windows PowerShell:
# dir
```

### 3. ファイルをコピー

**以下の 5 つのファイルを** `beauty-team` フォルダにコピー:

1. `index.html`
2. `app.js`
3. `README.md`
4. `OAUTH_SETUP.md`
5. `.gitignore`

**コピー方法:**
- Windows/Mac: ファイルマネージャーでドラッグ&ドロップ
- または `cp` コマンド

### 4. Git にステージング

```bash
# 全ファイルをステージング
git add .

# または個別に
git add index.html
git add app.js
```

### 5. Git でコミット

```bash
git commit -m "Add: Google Drive slideshow manager"
```

### 6. GitHub にプッシュ

```bash
git push origin main
```

**ログイン情報を求められたら:**
- Username: `al4-jpn`
- Password: GitHub のパスワード または Personal Access Token

### 7. GitHub で確認

```
https://github.com/al4-jpn/beauty-team
```

- Code タブで `index.html` が見えるか確認 ✅

### 8. Pages を設定

```
Settings > Pages
Source: Deploy from a branch ✓
Branch: main ✓
Folder: / (root) ✓
Save ✓
```

### 9. デプロイを待つ

```
5～10分待つ
Actions タブで ✅ 成功を確認
```

### 10. ブラウザキャッシュをクリア

```
Ctrl + Shift + Delete
または
Cmd + Shift + Delete (Mac)
```

### 11. URL にアクセス

```
https://al4-jpn.github.io/beauty-team
```

---

## ⚠️ よくある失敗パターン

### パターン 1: ファイルをコピーしたが git add を忘れた

```bash
# 修正:
git add .
git commit -m "Add files"
git push origin main
```

### パターン 2: Folder が / (root) になっていない

```
Settings > Pages
Folder: /docs ← これは違う
Folder: / (root) ← これに変更
Save をクリック
```

### パターン 3: ブラウザキャッシュが古い

```
Ctrl + Shift + Delete でキャッシュをクリア
または
シークレットウィンドウで開く
```

### パターン 4: リポジトリが Private

```
Settings > Visibility
Private ← これは違う
Public ← これに変更
```

---

## ✅ チェックリスト

- [ ] GitHub で index.html が見えている
- [ ] GitHub Pages Source = "Deploy from a branch"
- [ ] GitHub Pages Branch = main
- [ ] GitHub Pages Folder = / (root)
- [ ] Actions で ✅ 成功している
- [ ] ブラウザキャッシュをクリアした
- [ ] 5～10分以上待った
- [ ] URL: https://al4-jpn.github.io/beauty-team にアクセス

---

## 🎯 URL の最終確認

**管理画面 URL:**
```
https://al4-jpn.github.io/beauty-team
```

**ここにアクセスできたら成功です！** 🎉

---

## 💬 それでも動かない場合

以下の情報を確認:

1. **GitHub 側:**
   - リポジトリ: https://github.com/al4-jpn/beauty-team
   - Code タブで index.html が見える？
   - Actions で最新ビルドが ✅ 成功？

2. **Pages 設定:**
   - https://github.com/al4-jpn/beauty-team/settings/pages
   - Source, Branch, Folder が正しい？

3. **ブラウザ:**
   - URL が正しい？
   - キャッシュをクリアした？
   - 別のブラウザで試した？

これらを全て確認した上で、再度アクセスしてください。
