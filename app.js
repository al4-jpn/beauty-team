// ===== Google OAuth 2.0 設定 =====
// https://console.cloud.google.com でプロジェクトを作成し、
// OAuth 2.0 クライアント ID を取得してください
const CLIENT_ID = '891563721553-i4cnihl7829u6bucsb7c14j71cvq57t8.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

let tokenClient;
let accessToken = null;
let images = []; // { id, name, url(blob URL), driveUrl }
let currentPreviewIndex = 0;

// ===== 初期化 =====
window.addEventListener('load', () => {
    initializeGoogleSignIn();
    checkAuthStatus();
});

// Google Sign-In の初期化
function initializeGoogleSignIn() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: handleTokenResponse,
    });
}

// トークンレスポンスの処理
function handleTokenResponse(response) {
    accessToken = response.access_token;
    updateUIAfterLogin();
}

// Google でログイン
function loginWithGoogle() {
    if (accessToken) {
        logout();
    } else {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    }
}

// ログアウト
function logout() {
    accessToken = null;
    revokeAllImageUrls();
    images = [];
    document.getElementById('mainContent').style.display = 'none';
    document.getElementById('notLoggedIn').style.display = 'block';
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    google.accounts.id.disableAutoSelect();
}

// 認証ステータスを確認
function checkAuthStatus() {
    if (accessToken) {
        updateUIAfterLogin();
    } else {
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('notLoggedIn').style.display = 'block';
    }
}

// ログイン後 UI を更新
function updateUIAfterLogin() {
    document.getElementById('mainContent').style.display = 'grid';
    document.getElementById('notLoggedIn').style.display = 'none';
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    document.getElementById('userInfo').style.display = 'block';

    // ユーザー情報を取得（簡略化）
    document.getElementById('userName').textContent = 'ログイン中';
}

// ===== Google Drive API =====

/**
 * 既存のBlob URLをすべて解放する（メモリリーク防止）
 */
function revokeAllImageUrls() {
    images.forEach(img => {
        if (img.url && img.url.startsWith('blob:')) {
            URL.revokeObjectURL(img.url);
        }
    });
}

/**
 * Drive上の画像本体を取得し、Blob URLを返す
 * （drive.google.com/uc?... は認証付きimgタグからは読み込めないため、
 *   APIのalt=mediaエンドポイントからAuthorizationヘッダー付きで取得する）
 */
async function fetchImageAsBlobUrl(fileId) {
    const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        }
    );

    if (!response.ok) {
        throw new Error(`画像取得エラー (${fileId}): ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

/**
 * フォルダから画像を読み込む
 */
async function loadImagesFromFolder() {
    const folderId = document.getElementById('folderIdInput').value.trim();

    if (!folderId) {
        showStatus('error', 'フォルダ ID を入力してください');
        return;
    }

    if (!accessToken) {
        showStatus('error', 'ログインが必要です');
        return;
    }

    showStatus('loading', '画像一覧を取得中...');

    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=trashed=false and '${folderId}' in parents and mimeType contains 'image/'&fields=files(id,name,mimeType,webViewLink)&pageSize=100`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                logout();
                showStatus('error', 'トークンが無効です。再度ログインしてください');
                return;
            }
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // 既存のBlob URLを解放してから上書きする
        revokeAllImageUrls();

        if (!data.files || data.files.length === 0) {
            showStatus('error', 'フォルダに画像が見つかりません');
            images = [];
            renderImageGrid();
            return;
        }

        showStatus('loading', `画像データを取得中... (0 / ${data.files.length})`);

        // 各画像の本体をAPI経由で取得し、Blob URL化する
        const loaded = [];
        let doneCount = 0;

        for (const file of data.files) {
            try {
                const blobUrl = await fetchImageAsBlobUrl(file.id);
                loaded.push({
                    id: file.id,
                    name: file.name,
                    url: blobUrl,
                    driveUrl: file.webViewLink
                });
            } catch (err) {
                console.error('画像取得失敗:', file.name, err);
            }
            doneCount++;
            showStatus('loading', `画像データを取得中... (${doneCount} / ${data.files.length})`);
        }

        images = loaded;

        if (images.length === 0) {
            showStatus('error', '画像の取得に失敗しました');
            renderImageGrid();
            return;
        }

        showStatus('success', `${images.length} 個の画像を読み込みました`);
        renderImageGrid();
        startPreview();
        document.getElementById('generateBtn').disabled = false;

    } catch (error) {
        console.error('Error:', error);
        showStatus('error', `エラーが発生しました: ${error.message}`);
    }
}

// ===== UI レンダリング =====

/**
 * 画像グリッドを描画
 */
function renderImageGrid() {
    const grid = document.getElementById('imageGrid');
    grid.innerHTML = '';

    images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.draggable = true;
        item.dataset.index = index;

        item.innerHTML = `
            <img src="${img.url}" alt="${img.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2212%22 fill=%22%23999%22%3E画像未読込%3C/text%3E%3C/svg%3E'">
            <div class="index">${index + 1}</div>
        `;

        // ドラッグ&ドロップ
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);

        grid.appendChild(item);
    });
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();

    if (draggedElement === this) return;

    const allItems = document.querySelectorAll('.image-item');
    const draggedIndex = Array.from(allItems).indexOf(draggedElement);
    const targetIndex = Array.from(allItems).indexOf(this);

    // 配列を並び替え
    const [movedImage] = images.splice(draggedIndex, 1);
    images.splice(targetIndex, 0, movedImage);

    renderImageGrid();
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

// ===== プレビュー =====

let previewInterval;

function startPreview() {
    if (images.length === 0) return;

    const preview = document.getElementById('preview');
    currentPreviewIndex = 0;

    const updatePreview = () => {
        preview.innerHTML = `
            <img src="${images[currentPreviewIndex].url}" alt="slide">
            <div class="slide-counter">${currentPreviewIndex + 1} / ${images.length}</div>
        `;
        currentPreviewIndex = (currentPreviewIndex + 1) % images.length;
    };

    updatePreview();
    clearInterval(previewInterval);

    const duration = parseInt(document.getElementById('slideDuration').value) * 1000;
    previewInterval = setInterval(updatePreview, duration);
}

// ===== 埋め込みリンク生成 =====

/**
 * fileIdから「リンクを知っている全員が表示可能」な直接表示用URLを作る
 * （このURLは認証トークンなしで画像として開けるため、
 *   コピペしてAIへの指示や他のHTML/Markdownに直接貼り付けられる）
 */
function buildPublicImageUrl(fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
}

/**
 * 現在の並び順のまま、画像の埋め込みリンク一覧をテキストで生成する
 */
function generateEmbedLinks() {
    if (images.length === 0) {
        showStatus('error', '画像を読み込んでください');
        return;
    }

    // 並び替え後の順番のまま、1行1リンクのテキストを作る
    const linksText = images
        .map((img, idx) => `${idx + 1}. ${buildPublicImageUrl(img.id)}`)
        .join('\n');

    const downloadSection = document.getElementById('downloadSection');
    downloadSection.innerHTML = `
        <p style="margin-bottom:8px; font-size:13px; color:#666;">
            ※ 各ファイルをGoogle Driveで「リンクを知っている全員が表示可能」に共有設定してください。
            未設定の場合、リンクが開けないことがあります。
        </p>
        <textarea id="embedLinksTextarea" readonly style="width:100%; min-height:160px; font-family:monospace; font-size:13px; padding:8px;">${linksText}</textarea>
        <div class="download-link" onclick="copyEmbedLinks()" style="margin-top:10px;">
            📋 リンクをコピー
        </div>
    `;

    showStatus('success', `${images.length} 件の埋め込みリンクを生成しました`);
}

/**
 * テキストエリアの内容をクリップボードにコピーする
 */
async function copyEmbedLinks() {
    const textarea = document.getElementById('embedLinksTextarea');
    if (!textarea) return;

    try {
        await navigator.clipboard.writeText(textarea.value);
        showStatus('success', 'クリップボードにコピーしました');
    } catch (err) {
        // クリップボードAPIが使えない場合は選択状態にしてフォールバック
        textarea.select();
        showStatus('error', 'コピーに失敗しました。選択した状態のテキストを手動でコピーしてください');
    }
}

/**
 * （未使用・参考用）スライドショー HTML を生成するコア関数
 * 必要になった場合のために残していますが、現在は呼び出されていません
 */
function generateSlideshowHTML_UNUSED(imageUrls, options = {}) {
    const {
        duration = 3,
        transition = 'fade',
        autoPlay = true,
        title = 'スライドショー'
    } = options;

    const transitionCSS = getTransitionCSS(transition, duration);

    return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            width: 100%;
            height: 100vh;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }

        .slideshow-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .slide {
            display: none;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
        }

        .slide.active {
            display: block;
        }

        .slide img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            ${transitionCSS}
        }

        .slide.active img {
            animation: slideIn ${duration}s ease-in-out forwards;
        }

        ${getKeyframesCSS(transition)}

        .controls {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 15px;
            background: rgba(0, 0, 0, 0.7);
            padding: 15px 25px;
            border-radius: 50px;
            z-index: 100;
        }

        button {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.4);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.3s;
        }

        button:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .slide-counter {
            position: absolute;
            top: 20px;
            right: 20px;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px 15px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
        }

        .progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: #667eea;
            animation: progress ${duration}s linear forwards;
        }

        @keyframes progress {
            from {
                width: 0%;
            }
            to {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="slideshow-container">
        ${imageUrls.map((url, idx) => `
        <div class="slide ${idx === 0 ? 'active' : ''}">
            <img src="${url}" alt="Slide ${idx + 1}">
        </div>
        `).join('\n')}

        <div class="slide-counter">
            <span id="current">1</span> / <span id="total">${imageUrls.length}</span>
        </div>

        <div class="controls">
            <button onclick="prevSlide()">❮</button>
            <button id="playPauseBtn" onclick="togglePlayPause()">⏸</button>
            <button onclick="nextSlide()">❯</button>
        </div>

        <div class="progress-bar" id="progressBar"></div>
    </div>

    <script>
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        let currentSlide = 0;
        let isPlaying = ${autoPlay ? 'true' : 'false'};
        let autoPlayInterval;
        const slideDuration = ${duration} * 1000;

        const updatePlayPauseButton = () => {
            document.getElementById('playPauseBtn').textContent = isPlaying ? '⏸' : '▶';
        };

        const showSlide = (n) => {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[n].classList.add('active');
            document.getElementById('current').textContent = n + 1;

            // プログレスバーをリセット
            const progressBar = document.getElementById('progressBar');
            progressBar.style.animation = 'none';
            setTimeout(() => {
                progressBar.style.animation = 'progress ${duration}s linear forwards';
            }, 10);
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
            resetAutoPlay();
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
            resetAutoPlay();
        };

        const togglePlayPause = () => {
            isPlaying = !isPlaying;
            updatePlayPauseButton();
            if (isPlaying) {
                startAutoPlay();
            } else {
                clearInterval(autoPlayInterval);
            }
        };

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, slideDuration);
        };

        const resetAutoPlay = () => {
            if (isPlaying) {
                clearInterval(autoPlayInterval);
                startAutoPlay();
            }
        };

        const init = () => {
            showSlide(0);
            updatePlayPauseButton();
            if (isPlaying) {
                startAutoPlay();
            }
        };

        // キーボード操作
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === ' ') {
                e.preventDefault();
                togglePlayPause();
            }
        });

        init();
    </script>
</body>
</html>`;
}

/**
 * トランジション CSS を取得
 */
function getTransitionCSS(type, duration) {
    switch (type) {
        case 'slide':
            return `
                animation: slideOut ${duration}s ease-in-out forwards;
            `;
        case 'zoom':
            return `
                animation: zoomOut ${duration}s ease-in-out forwards;
            `;
        case 'fade':
        default:
            return `
                opacity: 0;
            `;
    }
}

/**
 * キーフレーム CSS を取得
 */
function getKeyframesCSS(type) {
    switch (type) {
        case 'slide':
            return `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-100%);
                        opacity: 0;
                    }
                }
            `;
        case 'zoom':
            return `
                @keyframes slideIn {
                    from {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                @keyframes zoomOut {
                    from {
                        transform: scale(1);
                        opacity: 1;
                    }
                    to {
                        transform: scale(0.8);
                        opacity: 0;
                    }
                }
            `;
        case 'fade':
        default:
            return `
                @keyframes slideIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `;
    }
}

// ===== ダウンロード =====

function downloadHTML(url) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'slideshow.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function previewHTML(url) {
    window.open(url, '_blank');
}

// ===== ヘルパー関数 =====

function showStatus(type, message) {
    const statusEl = document.getElementById('loadStatus');
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
    statusEl.style.display = 'block';

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}
