document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('messageForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 防止表單的默認提交行為

        const message = document.getElementById('message').value;

        // 創建 JSZip 實例
        const zip = new JSZip();

        // 創建 firebaseConfig.js 內容，並在開頭添加 export
        const firebaseConfigContent = `export ${message};\n\n`;

        // 定義其他文件的 URL
        const files = {
            'app.js': 'download/app.js',
            'dashboard.js': 'download/dashboard.js',
            'dashboard.html': 'download/dashboard.html',
            'index.html': 'download/index.html',
            'register.html': 'download/register.html',
            'reset-password.html': 'download/reset-password.html',
            'styles.css': 'download/styles.css'
        };

        // 創建一個用於異步操作的數組
        const promises = [];

        // 將 firebaseConfig.js 內容添加到 ZIP
        zip.folder('download').file('firebaseConfig.js', firebaseConfigContent);

        // 遍歷文件 URL，獲取內容並添加到 ZIP
        for (const [filename, url] of Object.entries(files)) {
            const promise = fetch(url)
                .then(response => response.text())
                .then(content => {
                    zip.folder('download').file(filename, content);
                })
                .catch(error => {
                    console.error(`Failed to fetch ${filename}:`, error);
                });
            promises.push(promise);
        }

        // 等待所有文件加載完成
        Promise.all(promises).then(() => {
            // 生成 ZIP 檔案並提供下載
            zip.generateAsync({ type: 'blob' }).then(function(blob) {
                const url = URL.createObjectURL(blob);
                const downloadLink = document.getElementById('downloadLink');
                downloadLink.href = url;
                downloadLink.download = 'firebase登入系統.zip';
                downloadLink.textContent = '點擊這裡下載 firebase登入系統.zip';
                downloadLink.style.display = 'block';
            });
        });
    });
});
