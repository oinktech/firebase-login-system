import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { firebaseConfig } from './firebaseConfig.js'; // 引入 Firebase 配置文件

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
    const userEmailElement = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout');
    const changePasswordButton = document.getElementById('change-password');
    const changePasswordForm = document.getElementById('change-password-form');
    const submitPasswordChangeButton = document.getElementById('submit-password-change');
    
    // 確保元素存在
    if (!userEmailElement || !logoutButton || !changePasswordButton || !changePasswordForm || !submitPasswordChangeButton) {
        console.error('頁面元素缺失');
        return;
    }

    onAuthStateChanged(auth, (user) => {
        if (user) {
            userEmailElement.textContent = `歡迎，${user.email}`;

            // 如果使用 Google 登入，隱藏更改密碼按鈕
            if (user.providerData.some((provider) => provider.providerId === 'google.com')) {
                changePasswordButton.style.display = 'none';
                changePasswordForm.style.display = 'none';
            } else {
                changePasswordButton.style.display = 'inline-block';
                changePasswordForm.style.display = 'inline-block';
            }
        } else {
            window.location.href = 'index.html';
        }
    });

    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'index.html';
        }).catch((error) => {
            alert('登出時出錯，請稍後再試。');
            console.error('登出時出錯', error);
        });
    });

    changePasswordButton.addEventListener('click', () => {
        changePasswordForm.classList.toggle('hidden');
    });

    submitPasswordChangeButton.addEventListener('click', () => {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;

        // 簡單驗證
        if (!currentPassword || !newPassword) {
            alert('請填寫所有欄位。');
            return;
        }

        if (newPassword.length < 6) {
            alert('新密碼長度至少為 6 個字符。');
            return;
        }

        const user = auth.currentUser;

        if (user) {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            reauthenticateWithCredential(user, credential).then(() => {
                updatePassword(user, newPassword).then(() => {
                    alert('密碼已更改');
                    changePasswordForm.classList.add('hidden');
                }).catch((error) => {
                    alert('更改密碼時出錯，請稍後再試。');
                    console.error('更改密碼時出錯', error);
                });
            }).catch((error) => {
                alert('重新驗證時出錯，請檢查當前密碼是否正確。');
                console.error('重新驗證時出錯', error);
            });
        }
    });
});
