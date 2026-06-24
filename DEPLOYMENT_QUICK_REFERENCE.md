# 全网最穷站 - 快速参考卡片

## 🚀 一键部署

```bash
# 1. 进入项目目录
cd /home/ubuntu/the-poorest-site

# 2. 运行部署脚本
chmod +x DEPLOYMENT_PM2_SETUP.sh
./DEPLOYMENT_PM2_SETUP.sh

# 3. 配置 Nginx
sudo cp DEPLOYMENT_NGINX.conf /etc/nginx/sites-enabled/shipinzs-nodejs
sudo nginx -t
sudo systemctl restart nginx

# 4. 验证
pm2 status
curl http://localhost:8080
```

---

## 📊 常用命令速查表

### PM2 命令

| 命令 | 说明 |
|------|------|
| `pm2 status` | 查看应用状态 |
| `pm2 logs poorest-site` | 查看日志 |
| `pm2 monit` | 实时监控 |
| `pm2 restart poorest-site` | 重启应用 |
| `pm2 stop poorest-site` | 停止应用 |
| `pm2 delete poorest-site` | 删除应用 |
| `pm2 show poorest-site` | 查看应用详情 |

### Nginx 命令

| 命令 | 说明 |
|------|------|
| `sudo nginx -t` | 测试配置 |
| `sudo systemctl restart nginx` | 重启 Nginx |
| `sudo systemctl status nginx` | 查看状态 |
| `tail -f /var/log/nginx/poorest_site_error.log` | 查看错误日志 |
| `sudo rm -rf /var/cache/nginx/poorest_site/*` | 清理缓存 |

### 系统命令

| 命令 | 说明 |
|------|------|
| `top` | 查看系统资源 |
| `df -h` | 查看磁盘使用 |
| `free -h` | 查看内存使用 |
| `netstat -an \| grep 3000` | 查看端口监听 |
| `lsof -i :3000` | 查看端口占用 |

---

## 🔍 故障排查

### 问题: 502 Bad Gateway

```bash
# 1. 检查 Node.js 是否运行
pm2 status

# 2. 如果未运行，重启
pm2 restart poorest-site

# 3. 查看日志
pm2 logs poorest-site
```

### 问题: 内存不足

```bash
# 1. 查看内存使用
pm2 show poorest-site | grep memory

# 2. 重启应用
pm2 restart poorest-site

# 3. 检查是否有内存泄漏
pm2 logs poorest-site | grep -i error
```

### 问题: 高 CPU 使用率

```bash
# 1. 查看 CPU 使用
pm2 monit

# 2. 查看日志找出原因
pm2 logs poorest-site

# 3. 重启应用
pm2 restart poorest-site
```

### 问题: 缓存问题

```bash
# 1. 清理 Nginx 缓存
sudo rm -rf /var/cache/nginx/poorest_site/*

# 2. 重启 Nginx
sudo systemctl restart nginx

# 3. 验证
curl -I http://localhost:8080/
```

---

## 📈 性能指标

### 目标指标

| 指标 | 目标 | 检查命令 |
|------|------|---------|
| 首页加载时间 | <1.5s | `curl -w "@curl-format.txt" http://localhost:8080/` |
| API 响应时间 | <200ms | `pm2 logs poorest-site` |
| 缓存命中率 | >80% | `grep "X-Cache-Status" /var/log/nginx/poorest_site_access.log` |
| 内存使用 | <500MB | `pm2 show poorest-site` |
| CPU 使用率 | <50% | `pm2 monit` |

### 性能测试

```bash
# 安装 Apache Bench
sudo apt install apache2-utils

# 测试首页性能
ab -n 1000 -c 10 http://localhost:8080/

# 测试 API 性能
ab -n 1000 -c 10 http://localhost:8080/api/trpc/community.getPosts
```

---

## 🔐 安全检查清单

- [ ] 更新系统: `sudo apt update && sudo apt upgrade -y`
- [ ] 配置防火墙: `sudo ufw enable`
- [ ] 开放必要端口: `sudo ufw allow 80/tcp`, `sudo ufw allow 443/tcp`
- [ ] 配置 HTTPS: 申请 SSL 证书 (Let's Encrypt)
- [ ] 定期备份数据库: `cp data.db data.db.bak`
- [ ] 监控错误日志: `pm2 logs poorest-site --err`
- [ ] 设置日志轮转: `logrotate`

---

## 📅 定期维护计划

### 每天
- 检查应用状态: `pm2 status`
- 查看错误日志: `pm2 logs poorest-site --err`

### 每周
- 检查磁盘使用: `df -h`
- 检查内存使用: `free -h`
- 查看缓存命中率

### 每月
- 更新依赖: `pnpm update`
- 重新构建: `pnpm build`
- 重启应用: `pm2 restart poorest-site`
- 备份数据库

### 每季度
- 更新系统: `sudo apt upgrade -y`
- 更新 Node.js
- 更新 Nginx
- 安全审计

---

## 💾 备份和恢复

### 备份

```bash
# 备份数据库
cp /home/ubuntu/the-poorest-site/data.db /backup/data.db.$(date +%Y%m%d)

# 备份应用代码
tar -czf /backup/poorest-site-$(date +%Y%m%d).tar.gz /home/ubuntu/the-poorest-site

# 备份 Nginx 配置
cp /etc/nginx/sites-enabled/shipinzs-nodejs /backup/nginx-$(date +%Y%m%d).conf
```

### 恢复

```bash
# 恢复数据库
cp /backup/data.db.20260623 /home/ubuntu/the-poorest-site/data.db

# 恢复应用
tar -xzf /backup/poorest-site-20260623.tar.gz -C /

# 恢复 Nginx 配置
cp /backup/nginx-20260623.conf /etc/nginx/sites-enabled/shipinzs-nodejs
sudo systemctl restart nginx
```

---

## 📞 获取帮助

### 查看日志

```bash
# PM2 日志
pm2 logs poorest-site

# Nginx 错误日志
tail -f /var/log/nginx/poorest_site_error.log

# 系统日志
journalctl -u pm2-ubuntu -n 50
```

### 常见问题

1. **应用无法启动**: 检查 `pm2 logs poorest-site`
2. **502 错误**: 检查 Node.js 是否运行 `pm2 status`
3. **高内存使用**: 重启应用 `pm2 restart poorest-site`
4. **缓存问题**: 清理缓存 `sudo rm -rf /var/cache/nginx/poorest_site/*`

---

**最后更新**: 2026-06-23
**版本**: 1.0
