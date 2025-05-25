@echo off
chcp 65001 >nul
title 德国骨科医院检验大数据中心系统

echo.
echo 🏥 德国骨科医院检验大数据中心系统
echo ==================================
echo.
echo 正在启动HTTP服务器...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：未找到Python，请先安装Python
    pause
    exit /b 1
)

echo 🚀 服务器启动成功！
echo.
echo 📱 访问地址：
echo    登录页面: http://localhost:8001/login.html
echo    主页面:   http://localhost:8001/index.html
echo.
echo 🔐 登录信息：
echo    用户名: admin
echo    密码:   test123
echo.
echo 💡 提示：
echo    - 按 Ctrl+C 停止服务器
echo    - 首次访问请使用登录页面
echo    - 浏览器会自动打开登录页面
echo.
echo ==================================
echo.

REM 启动浏览器（可选）
start http://localhost:8001/login.html

REM 启动服务器
python -m http.server 8001

pause 