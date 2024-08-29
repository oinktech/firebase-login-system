import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js';
import { getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { firebaseConfig } from './firebaseConfig.js'; // 載入外部配置文件

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

document.addEventListener('DOMContentLoaded', () => {
    const loginGoogleButton = document.getElementById('login-google');
    const submitLoginButton = document.getElementById('submit-login');
    const submitRegisterButton = document.getElementById('submit-register');
    const submitResetButton = document.getElementById('submit-reset');
    const resetMessage = document.getElementById('reset-message');
    const emailLoginForm = document.getElementById('email-login-form');
    const errorMessage = document.getElementById('error-message'); // 錯誤信息容器

    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const backToLoginLink = document.getElementById('back-to-login');

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block'; // 顯示錯誤信息

        setTimeout(() => {
            errorMessage.textContent = '';
            errorMessage.style.display = 'none'; // 隱藏錯誤信息
        }, 3000); // 3秒後隱藏
    }

    if (loginGoogleButton) {
        loginGoogleButton.addEventListener('click', () => {
            signInWithPopup(auth, googleProvider).then(() => {
                window.location.href = 'dashboard.html';
            }).catch((error) => {
                console.error('Google 登入錯誤:', error);
                showError('Google 登入失敗，請稍後再試');
            });
        });
    }

    if (submitLoginButton) {
        submitLoginButton.addEventListener('click', () => {
            const email = document.getElementById('login-email-input').value;
            const password = document.getElementById('login-password-input').value;
            if (!email || !password) {
                showError('請填寫所有字段');
                return;
            }
            signInWithEmailAndPassword(auth, email, password).then(() => {
                window.location.href = 'dashboard.html';
            }).catch((error) => {
                console.error('登入錯誤:', error);
                showError('登入失敗，請檢查您的電子郵件和密碼');
            });
        });
    }

    if (submitRegisterButton) {
        submitRegisterButton.addEventListener('click', () => {
            const email = document.getElementById('register-email-input').value;
            const password = document.getElementById('register-password-input').value;
            const confirmPassword = document.getElementById('register-confirm-password-input').value;
            if (!email || !password || password !== confirmPassword) {
                showError('請填寫所有字段並確保密碼匹配');
                return;
            }
            createUserWithEmailAndPassword(auth, email, password).then(() => {
                alert('註冊成功');
                emailRegisterForm.classList.add('hidden');
                emailLoginForm.classList.remove('hidden');
            }).catch((error) => {
                console.error('註冊錯誤:', error);
                showError('註冊失敗，請檢查您的電子郵件和密碼');
            });
        });
    }

    if (submitResetButton) {
        submitResetButton.addEventListener('click', () => {
            const email = document.getElementById('reset-email-input').value;
            if (!email) {
                showError('請輸入您的電子郵件');
                return;
            }
            sendPasswordResetEmail(auth, email).then(() => {
                resetMessage.textContent = '重設郵件已發送，請檢查您的電子郵件';
            }).catch((error) => {
                console.error('重設密碼錯誤:', error);
                resetMessage.textContent = '發送失敗，請檢查您的電子郵件';
            });
        });
    }
});
