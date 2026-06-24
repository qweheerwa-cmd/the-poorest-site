#!/bin/bash

# ==================== 全网最穷站 - PM2 部署脚本 ====================
# 
# 功能:
# 1. 安装 PM2
# 2. 构建应用
# 3. 启动应用 (多进程模式)
# 4. 配置开机自启
# 5. 设置监控告警
#
# 使用方法:
# chmod +x DEPLOYMENT_PM2_SETUP.sh
# ./DEPLOYMENT_PM2_SETUP.sh

set -e

echo "=========================================="
echo "全网最穷站 - PM2 部署脚本"
echo "=========================================="

# 配置变量
APP_NAME="poorest-site"
APP_PATH="/home/ubuntu/the-poorest-site"
NODE_ENV="production"
PORT=3000

# ==================== 第一步: 安装 PM2 ====================

echo ""
echo "[1/5] 检查 PM2 安装..."

if ! command -v pm2 &> /dev/null; then
    echo "PM2 未安装，正在安装..."
    sudo npm install -g pm2 --silent
    echo "✓ PM2 安装完成"
else
    echo "✓ PM2 已安装: $(pm2 --version)"
fi

# ==================== 第二步: 构建应用 ====================

echo ""
echo "[2/5] 构建应用..."

cd "$APP_PATH"

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "安装 npm 依赖..."
    pnpm install --frozen-lockfile
fi

# 构建前端和后端
echo "构建应用..."
pnpm build

echo "✓ 应用构建完成"

# ==================== 第三步: 启动应用 ====================

echo ""
echo "[3/5] 启动应用..."

# 停止已有的应用
pm2 stop "$APP_NAME" 2>/dev/null || true
pm2 delete "$APP_NAME" 2>/dev/null || true

# 启动应用 (多进程模式)
# -i max: 自动使用所有 CPU 核心
# --max-memory-restart: 内存超过 500MB 自动重启
pm2 start "$APP_PATH/dist/index.js" \
    --name "$APP_NAME" \
    --env "$NODE_ENV" \
    -i max \
    --max-memory-restart 500M \
    --merge-logs \
    --log-date-format "YYYY-MM-DD HH:mm:ss Z"

echo "✓ 应用已启动"

# ==================== 第四步: 配置开机自启 ====================

echo ""
echo "[4/5] 配置开机自启..."

# 生成 PM2 启动脚本
pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

# 保存 PM2 配置
pm2 save

echo "✓ 开机自启已配置"

# ==================== 第五步: 设置监控告警 ====================

echo ""
echo "[5/5] 设置监控..."

# 创建监控脚本
cat > "$APP_PATH/pm2-monitor.sh" << 'EOF'
#!/bin/bash

# PM2 监控脚本
# 检查应用状态，如果出现问题则发送告警

APP_NAME="poorest-site"
LOG_FILE="/var/log/poorest-site-monitor.log"

# 检查应用是否运行
if ! pm2 list | grep -q "$APP_NAME"; then
    echo "[$(date)] 应用未运行，正在重启..." >> "$LOG_FILE"
    pm2 start "$APP_NAME"
fi

# 检查内存使用
MEMORY=$(pm2 show "$APP_NAME" | grep "memory" | awk '{print $NF}' | sed 's/M//')
if (( $(echo "$MEMORY > 600" | bc -l) )); then
    echo "[$(date)] 内存使用过高: ${MEMORY}MB，正在重启..." >> "$LOG_FILE"
    pm2 restart "$APP_NAME"
fi

# 检查 CPU 使用
CPU=$(pm2 show "$APP_NAME" | grep "cpu" | awk '{print $NF}' | sed 's/%//')
if (( $(echo "$CPU > 80" | bc -l) )); then
    echo "[$(date)] CPU 使用过高: ${CPU}%，请检查应用状态" >> "$LOG_FILE"
fi
EOF

chmod +x "$APP_PATH/pm2-monitor.sh"

# 添加定时任务 (每 5 分钟检查一次)
(crontab -l 2>/dev/null | grep -v "pm2-monitor.sh"; echo "*/5 * * * * $APP_PATH/pm2-monitor.sh") | crontab -

echo "✓ 监控已配置"

# ==================== 完成 ====================

echo ""
echo "=========================================="
echo "✓ PM2 部署完成！"
echo "=========================================="
echo ""
echo "应用信息:"
echo "  名称: $APP_NAME"
echo "  路径: $APP_PATH"
echo "  端口: $PORT"
echo "  环境: $NODE_ENV"
echo ""
echo "常用命令:"
echo "  查看状态:     pm2 status"
echo "  查看日志:     pm2 logs $APP_NAME"
echo "  监控应用:     pm2 monit"
echo "  重启应用:     pm2 restart $APP_NAME"
echo "  停止应用:     pm2 stop $APP_NAME"
echo "  删除应用:     pm2 delete $APP_NAME"
echo ""
echo "访问地址: http://localhost:$PORT"
echo ""
