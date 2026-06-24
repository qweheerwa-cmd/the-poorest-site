# 全网最穷站 - 部署和发布指南

## 快速开始

### 1. 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 打开浏览器访问
# http://localhost:3000
```

### 2. 生产构建

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## Manus 部署

### 前置条件

- 已创建 Manus 项目
- 项目已配置数据库（MySQL/TiDB）
- 已配置 OAuth 应用

### 部署步骤

#### 第一步：创建 Checkpoint

在完成所有功能开发后，创建一个 checkpoint 来保存项目状态：

```bash
# 通过 Manus 管理界面创建 checkpoint
# 或使用 webdev_save_checkpoint 命令
```

#### 第二步：发布网站

1. 打开 Manus 管理界面
2. 在项目详情页面，点击右上角的 **Publish** 按钮
3. 选择要发布的 checkpoint 版本
4. 配置发布选项：
   - 选择托管方式（Autoscale 或 Reserved）
   - 配置环境变量
   - 设置自定义域名
5. 点击 **Publish** 确认发布

#### 第三步：配置自定义域名

1. 在 Settings → Domains 中管理域名
2. 选择 "Add Domain"
3. 输入域名（例如：poorest-site.com）
4. 按照提示完成 DNS 配置
5. 等待域名验证完成

### 环境变量配置

项目已预配置以下环境变量：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| DATABASE_URL | 数据库连接字符串 | mysql://user:pass@host/db |
| JWT_SECRET | JWT 签名密钥 | [自动生成] |
| VITE_APP_ID | OAuth 应用 ID | [从 Manus 获取] |
| OAUTH_SERVER_URL | OAuth 服务器地址 | https://api.manus.im |

### 自定义环境变量

如需添加自定义环境变量，使用 `webdev_request_secrets` 命令：

```bash
# 添加新的环境变量
webdev_request_secrets \
  --brief "添加 QQ 群号配置" \
  --secrets '[{"key":"QQ_GROUP_ID","description":"QQ 群号"}]'
```

## 数据库管理

### 数据库初始化

项目使用 Drizzle ORM 管理数据库 schema。所有表已在初始化时创建。

### 数据库迁移

当修改 schema 时：

1. 编辑 `drizzle/schema.ts`
2. 生成迁移文件：
   ```bash
   pnpm drizzle-kit generate
   ```
3. 应用迁移：
   ```bash
   webdev_execute_sql < drizzle/migrations/[migration_file].sql
   ```

### 数据库备份

定期备份数据库：

```bash
# 通过 Manus 管理界面的 Database 面板进行备份
```

## 监控和维护

### 性能监控

- 使用 Manus Dashboard 查看实时流量和性能指标
- 监控数据库查询性能
- 检查错误日志

### 日志查看

```bash
# 查看应用日志
tail -f .manus-logs/devserver.log

# 查看浏览器控制台日志
tail -f .manus-logs/browserConsole.log

# 查看网络请求日志
tail -f .manus-logs/networkRequests.log
```

### 常见问题排查

#### 问题：页面加载缓慢

**解决方案：**
1. 检查数据库查询性能
2. 启用缓存
3. 优化前端资源
4. 考虑升级到 Reserved 托管

#### 问题：数据库连接错误

**解决方案：**
1. 检查 DATABASE_URL 配置
2. 验证数据库连接权限
3. 检查网络连接
4. 查看错误日志获取详细信息

#### 问题：OAuth 登录失败

**解决方案：**
1. 检查 VITE_APP_ID 配置
2. 验证 OAuth 应用设置
3. 检查回调 URL 配置
4. 查看浏览器控制台错误

## 性能优化

### 前端优化

1. **启用 Gzip 压缩**
   ```
   # 自动启用
   ```

2. **优化图片**
   - 使用 WebP 格式
   - 实现响应式图片
   - 使用 CDN 加速

3. **代码分割**
   - 使用动态导入
   - 按路由分割代码

4. **缓存策略**
   - 设置合适的 Cache-Control 头
   - 使用 Service Worker

### 后端优化

1. **数据库优化**
   - 添加索引
   - 优化查询语句
   - 使用连接池

2. **API 优化**
   - 实现分页
   - 使用缓存
   - 限制响应大小

3. **服务器优化**
   - 启用 Keep-Alive
   - 使用 CDN
   - 配置 Reserved 托管以获得更好的性能

## 安全加固

### 认证和授权

- Manus OAuth 已集成
- 所有受保护的 API 都需要认证
- 管理员功能需要 admin 角色

### 数据保护

- 启用 HTTPS（自动）
- 使用环境变量存储敏感信息
- 定期备份数据库

### 输入验证

- 所有用户输入都通过 Zod 验证
- 防止 SQL 注入
- 防止 XSS 攻击

## 扩展和升级

### 升级托管方式

从 Autoscale 升级到 Reserved：

1. 在 Manus 管理界面中选择项目
2. 进入 Settings → General
3. 选择 "Upgrade to Reserved"
4. 按照提示完成升级

### 添加新功能

1. 修改数据库 schema
2. 创建数据库迁移
3. 编写后端 API
4. 开发前端页面
5. 创建新的 checkpoint
6. 重新发布

## 监控和告警

### 设置告警

1. 在 Manus Dashboard 中配置告警规则
2. 设置告警通知方式（邮件、Slack 等）
3. 监控关键指标：
   - 错误率
   - 响应时间
   - 数据库连接
   - 存储空间

## 回滚和恢复

### 回滚到之前的版本

1. 在 Manus 管理界面中查看版本历史
2. 选择要回滚的 checkpoint
3. 点击 "Rollback" 按钮
4. 确认回滚操作

### 数据恢复

1. 从备份恢复数据库
2. 重新发布应用
3. 验证数据完整性

## 成本优化

### Autoscale 托管

- 按使用量计费
- 适合流量变化大的应用
- 自动扩展和缩放

### Reserved 托管

- 固定月费
- 适合高流量应用
- 更好的性能和稳定性

### 成本监控

- 在 Manus Dashboard 中查看成本
- 设置成本告警
- 定期审查使用情况

## 支持和帮助

- **文档**：查看 PROJECT_GUIDE.md
- **问题反馈**：提交 GitHub Issue
- **社区讨论**：加入 QQ 群讨论

---

**最后更新**：2026-06-23
**版本**：1.0.0
