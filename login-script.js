// 登录页面JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const errorMessage = document.getElementById('errorMessage');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // 预定义的登录凭据
    const validCredentials = {
        username: 'admin',
        password: 'test123'
    };

    // 密码显示/隐藏切换
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });

    // 输入框焦点效果
    const inputs = [usernameInput, passwordInput];
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            hideErrorMessage();
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });

        // 输入时隐藏错误消息
        input.addEventListener('input', function() {
            hideErrorMessage();
        });
    });

    // 表单提交处理
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        // 基本验证
        if (!username || !password) {
            showErrorMessage('请填写用户名和密码');
            return;
        }

        // 显示加载动画
        showLoading();

        // 模拟登录验证延迟
        setTimeout(() => {
            if (validateCredentials(username, password)) {
                // 登录成功
                handleSuccessfulLogin(username);
            } else {
                // 登录失败
                hideLoading();
                showErrorMessage('用户名或密码错误，请重试');
                
                // 清空密码字段
                passwordInput.value = '';
                passwordInput.focus();
                
                // 添加震动效果
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
            }
        }, 1500); // 模拟网络延迟
    });

    // 验证登录凭据
    function validateCredentials(username, password) {
        return username === validCredentials.username && password === validCredentials.password;
    }

    // 处理成功登录
    function handleSuccessfulLogin(username) {
        // 如果选择了记住我，保存到localStorage
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        // 保存登录状态
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', username);
        sessionStorage.setItem('loginTime', new Date().toISOString());

        // 显示成功消息
        showSuccessMessage();

        // 延迟跳转到主页面
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // 显示成功消息
    function showSuccessMessage() {
        hideLoading();
        
        // 创建成功消息元素
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>登录成功！正在跳转...</span>
        `;
        
        // 添加成功消息样式
        successMessage.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            color: #27ae60;
            font-size: 14px;
            margin-top: 16px;
            padding: 12px;
            background: rgba(39, 174, 96, 0.1);
            border-radius: 6px;
            border-left: 4px solid #27ae60;
            animation: slideIn 0.3s ease-out;
        `;

        // 插入成功消息
        loginForm.appendChild(successMessage);
    }

    // 显示错误消息
    function showErrorMessage(message) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
        errorMessage.style.animation = 'slideIn 0.3s ease-out';
    }

    // 隐藏错误消息
    function hideErrorMessage() {
        errorMessage.style.display = 'none';
    }

    // 显示加载动画
    function showLoading() {
        loadingOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // 隐藏加载动画
    function hideLoading() {
        loadingOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // 页面加载时检查是否有记住的用户名
    function checkRememberedUser() {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        if (rememberedUsername) {
            usernameInput.value = rememberedUsername;
            rememberMeCheckbox.checked = true;
            usernameInput.parentElement.classList.add('focused');
            passwordInput.focus();
        }
    }

    // 检查是否已经登录
    function checkLoginStatus() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            // 如果已经登录，直接跳转到主页面
            window.location.href = 'index.html';
        }
    }

    // 添加键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Enter键提交表单
        if (e.key === 'Enter' && (usernameInput === document.activeElement || passwordInput === document.activeElement)) {
            loginForm.dispatchEvent(new Event('submit'));
        }
        
        // Escape键清除错误消息
        if (e.key === 'Escape') {
            hideErrorMessage();
        }
    });

    // 添加震动动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .shake {
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // 初始化
    checkLoginStatus();
    checkRememberedUser();

    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // 页面重新可见时，检查登录状态
            checkLoginStatus();
        }
    });

    // 防止表单自动填充时的样式问题
    setTimeout(() => {
        inputs.forEach(input => {
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });
    }, 100);

    // 添加输入验证
    usernameInput.addEventListener('input', function() {
        const value = this.value;
        // 移除特殊字符，只允许字母、数字和下划线
        this.value = value.replace(/[^a-zA-Z0-9_]/g, '');
    });

    // 密码强度提示（可选功能）
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const container = this.parentElement;
        
        // 移除之前的强度指示器
        const existingIndicator = container.querySelector('.password-strength');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        if (password.length > 0 && password.length < 6) {
            const indicator = document.createElement('div');
            indicator.className = 'password-strength';
            indicator.style.cssText = `
                position: absolute;
                right: 45px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                color: #e74c3c;
                pointer-events: none;
            `;
            indicator.textContent = '密码太短';
            container.appendChild(indicator);
        }
    });

    console.log('登录页面初始化完成');
    console.log('测试账户: admin / test123');
}); 