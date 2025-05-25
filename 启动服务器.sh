#!/bin/bash

echo "🏥 德国骨科医院检验大数据中心系统"
echo "=================================="
echo ""
echo "正在启动HTTP服务器..."
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误：未找到Python3，请先安装Python"
    exit 1
fi

# 检查端口是否被占用
if lsof -i :8001 &> /dev/null; then
    echo "⚠️  端口8001已被占用，尝试使用端口8002..."
    PORT=8002
else
    PORT=8001
fi

echo "🚀 服务器启动成功！"
echo ""
echo "📱 访问地址："
echo "   登录页面: http://localhost:$PORT/login.html"
echo "   主页面:   http://localhost:$PORT/index.html"
echo ""
echo "🔐 登录信息："
echo "   用户名: admin"
echo "   密码:   test123"
echo ""
echo "💡 提示："
echo "   - 按 Ctrl+C 停止服务器"
echo "   - 首次访问请使用登录页面"
echo ""
echo "=================================="

# 启动服务器
python3 -m http.server $PORT 