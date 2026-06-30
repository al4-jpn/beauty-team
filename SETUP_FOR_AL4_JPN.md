# 🎬 beauty-team スライドショー管理画面 セットアップガイド

**あなたのリポジトリ**: `https://github.com/al4-jpn/beauty-team`

このガイドは `beauty-team` リポジトリ用にカスタマイズされています。

---

## 📋 セットアップ全体フロー

```
1. Google OAuth 2.0 設定（10分）
   ↓
2. beauty-team リポジトリ に ファイルをアップロード（5分）
   ↓
3. GitHub Pages を有効化（2分）
   ↓
4. 完成！管理画面にアクセス（5分待機）
```

---

## 🔐 ステップ 1️⃣: Google OAuth 2.0 を設定

### 1.1 Google Cloud Console でプロジェクトを作成

1. https://console.cloud.google.com/ にアクセス
2. 新しいプロジェクトを作成（プロジェクト名: 例「Beauty Team Slideshow」）
3. Google Drive API を有効化

### 1.2 OAuth 2.0 クライアント ID を取得

**API とサービス** > **認証情報** > **OAuth 2.0 クライアント ID を作成**

以下の設定を入力:

| 項目 | 値 |
|------|-----|
| アプリケーションタイプ | ウェブアプリケーション |
| 名前 | Beauty Team Slideshow |
| **認可済みの JavaScript 生成元** | `https://al4-jpn.github.io` |
| **認可済みの JavaScript 生成元** | `https://al4-jpn.github.io/beauty-team` |

**⚠️ 重要**: この 2 つの URL を**両方**追加してください！

### 1.3 クライアント ID をコピー

```
123456789-abcdefghijklmnop.apps.googleusercontent.com
```

この長い ID をメモしておきます。

---

## 📁 ステップ 2️⃣: beauty-team にファイルをアップロード

### 2.1 beauty-team リポジトリをクローン

```bash
cd ~/Desktop  # または好きなフォルダ
git clone https://github.com/al4-jpn/beauty-team.git
cd beauty-team
```

### 2.2 5 つのファイルをコピー

以下のファイルを `beauty-team` フォルダにコピー:

- `index.html`
- `app.js`
- `README.md`
- `OAUTH_SETUP.md`
- `.gitignore`

**フォルダ構成:**
```
beauty-team/
├── .git/
├── index.html          ← コピー
├── app.js              ← コピー
├── README.md           ← コピー（既存のあれば置き換え）
├── OAUTH_SETUP.md      ← コピー
├── .gitignore          ← コピー（既存のあれば置き換え）
└── （その他既存ファイル）
```

### 2.3 app.js にクライアント ID を設定 ⚠️ 重要

`app.js` をテキストエディタで開いて、先頭の以下の部分を修正:

```javascript
// 【修正前】
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';

// 【修正後】ステップ 1.3 でコピーした ID を貼り付け
const CLIENT_ID = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
```

**⚠️ これを忘れると管理画面が動きません！**

### 2.4 GitHub にアップロード

```bash
# ファイルをステージング
git add .

# コミット
git commit -m "Add: Google Drive slideshow manager"

# プッシュ
git push origin main
```

GitHub にログインを求められたら、パスワードまたは Personal Access Token を入力。

---

## 🌐 ステップ 3️⃣: GitHub Pages を有効化

### 3.1 beauty-team が Public（公開）か確認

1. https://github.com/al4-jpn/beauty-team を開く
2. **Settings** タブをクリック
3. **Visibility** を確認
   - Public ✓ 
   - Private だったら「Make public」をクリック

### 3.2 Pages を設定

1. Settings > **Pages** を開く
2. **Build and deployment** セクション:
   - Source: `Deploy from a branch` ✓
   - Branch: `main` ✓
   - Folder: `/ (root)` ✓
3. **Save** をクリック

### 3.3 デプロイ完了を待つ

5～10 分待つと、以下のようなメッセージが表示:

```
✅ Your site is live at 
   https://al4-jpn.github.io/beauty-team
```

---

## 🚀 完成！管理画面にアクセス

以下の URL で管理画面にアクセス:

```
https://al4-jpn.github.io/beauty-team
```

**ブックマークに登録しておくと便利！** 🔖

---

## 📖 使い方（基本的な流れ）

### 1. ログイン
```
「Google でログイン」ボタンをクリック
→ Google アカウントを選択
→ ログイン完了 ✅
```

### 2. Google Drive のフォルダ ID を入力
```
Drive のスライドショー用フォルダを開く
→ URL から ID をコピー
   https://drive.google.com/drive/folders/【このID】/
→ 管理画面に貼り付け
→ 「画像を読み込む」をクリック
```

### 3. 画像を並び替え
```
グリッドの画像をドラッグ&ドロップ
→ リアルタイムプレビューで確認
```

### 4. 設定を調整
```
・スライド表示時間: 1～30 秒
・トランジション: フェード / スライド / ズーム
・自動再生: オン/オフ
```

### 5. HTML を生成
```
「HTML を生成」をクリック
→ 「slideshow.html をダウンロード」をクリック
→ ファイルが保存される
```

### 6. スライドショーを使用
```
ダウンロードした slideshow.html をブラウザで開く
→ フルスクリーンのスライドショーが表示
→ 矢印キーで操作、スペースで再生/一時停止
```

---

## 🎮 スライドショーの操作方法

### キーボード
| キー | 操作 |
|------|------|
| `→` | 次のスライド |
| `←` | 前のスライド |
| `Space` | 再生/一時停止 |

### マウス
- **❮ ボタン**: 前のスライド
- **⏸ ボタン**: 再生/一時停止
- **❯ ボタン**: 次のスライド

---

## 📚 詳しい情報

各ファイルを参照:

- `README.md` - 全体的な説明
- `OAUTH_SETUP.md` - Google OAuth の詳細設定
- `GITHUB_GUIDE.md` - GitHub の詳細操作
- `GITHUB_QUICKSTART.md` - コマンド集

---

## 🆘 トラブルシューティング

### ❌「login でログインできない」

**原因**: Client ID が間違っている、または設定されていない

**対処**:
1. `app.js` の `CLIENT_ID` を確認
2. `YOUR_CLIENT_ID` をそのままにしていないか
3. ファイルを保存後、ブラウザを **強制リロード** (Ctrl+Shift+R)

### ❌「フォルダに画像が見つかりません」

**原因**: Google Drive のフォルダ ID が間違っている

**対処**:
1. Google Drive でフォルダを開く
2. URL の `folders/` の後ろの部分をコピー
   ```
   https://drive.google.com/drive/folders/1abc-xyz-123/
                                           ↑ この部分
   ```
3. 最後の `/` は不要
4. 管理画面に貼り付け直す

### ❌「GitHub Pages が 404 で表示されない」

**対処**:
1. `https://al4-jpn.github.io/beauty-team` が正しいか確認
2. ブラウザキャッシュをクリア (Ctrl+Shift+Delete)
3. Settings > Pages で Source が正しく設定されているか確認
4. Actions タブでビルドが成功しているか確認（✅ 緑色）
5. 5～10 分経過しているか確認

### ❌「app.js の Client ID が反映されない」

**対処**:
```bash
# ファイルを再度プッシュ
git add app.js
git commit -m "Update: Client ID"
git push origin main

# ブラウザを強制リロード
Ctrl + Shift + R
```

---

## 📝 今後の更新方法

ファイルを修正したとき:

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Update: 説明"

# プッシュ
git push origin main
```

例:
```bash
git add index.html
git commit -m "Update: UI styling"
git push origin main
```

---

## 🔒 セキュリティ確認

✅ **安全です**:
- Client ID は公開情報です
- シークレットキーは使用していません
- Google OAuth 認証は安全です

❌ **しないこと**:
- シークレットキーを GitHub にコミットしない
- API キーを他の人に教えない

---

## 💡 カスタマイズ例

### 背景色を変更
`index.html` の CSS を編集:
```css
/* 前 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* 後（例：ピンク） */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
```

### デフォルト設定を変更
```javascript
<!-- スライド表示時間（デフォルト 3秒） -->
<input type="number" id="slideDuration" value="5" min="1" max="30">

<!-- 自動再生（デフォルト ON） -->
<input type="checkbox" id="autoPlayCheckbox" checked>
```

---

## 🎉 完了！

管理画面: https://al4-jpn.github.io/beauty-team

何か問題があれば、このガイドの該当セクションを参照してください！
