# 全网最穷站 - 项目完整指南

## 项目概述

**全网最穷站**是一个为穷人打造的互助社区网站，采用 Next.js + SQLite 技术栈构建。网站的核心目标是聚集穷人，一起建站，一起搞钱，一起分享失败经历。

### 核心特性

- **荧光绿配色主题**：采用 #39FF14 荧光绿作为主色调，配合深色背景，形成高反差视觉冲击
- **三个社区分类**：失败博物馆、搞钱路子、穷人日常
- **穷籍等级系统**：根据用户活跃度计算穷籍等级（Lv.1-10）
- **工具箱功能**：极简记账本、"今天吃什么"随机决定器
- **排行榜系统**：最惨失败榜、最强搞钱榜、穷籍等级榜
- **后台管理系统**：帖子审核、用户管理、站点统计

## 技术栈

- **前端**：React 19 + Tailwind CSS 4 + TypeScript
- **后端**：Express 4 + tRPC 11
- **数据库**：SQLite (MySQL 兼容)
- **认证**：Manus OAuth
- **部署**：Manus 自动化部署

## 项目结构

```
the-poorest-site/
├── client/                    # 前端代码
│   ├── src/
│   │   ├── pages/            # 页面组件
│   │   │   ├── Home.tsx      # 首页
│   │   │   ├── Community.tsx # 社区列表
│   │   │   ├── PostDetail.tsx# 帖子详情
│   │   │   ├── Tools.tsx     # 工具箱
│   │   │   ├── Leaderboard.tsx# 排行榜
│   │   │   ├── Profile.tsx   # 个人中心
│   │   │   └── Admin.tsx     # 后台管理
│   │   ├── components/       # UI 组件
│   │   ├── lib/              # 工具函数
│   │   └── App.tsx           # 路由配置
│   └── public/               # 静态文件
│       ├── robots.txt        # SEO 配置
│       └── sitemap.xml       # 网站地图
├── server/                    # 后端代码
│   ├── routers/              # tRPC 路由
│   │   ├── community.ts      # 社区功能
│   │   └── tools.ts          # 工具箱功能
│   ├── db.ts                 # 数据库查询
│   └── routers.ts            # 路由整合
├── drizzle/                   # 数据库 schema
│   └── schema.ts             # 表定义
└── todo.md                    # 项目任务列表
```

## 核心功能模块

### 1. 首页（Home.tsx）

- Hero 区域：高视觉冲击的荧光绿配色和自嘲文案
- 特性介绍卡片：展示网站的三个核心特性
- 社区分类展示：三个分类的快速导航
- FAQ 折叠区：常见问题解答
- QQ 群引流：引导用户加入 QQ 群

### 2. 社区系统（Community.tsx + PostDetail.tsx）

**社区列表页面**
- 三个分类导航：失败博物馆、搞钱路子、穷人日常
- 帖子列表展示：支持搜索和分类过滤
- 帖子卡片：显示作者、时间、分类、点赞、评论、浏览数

**帖子详情页面**
- 完整帖子内容展示
- 作者信息和发布时间
- 点赞、评论、分享交互
- 评论列表和嵌套回复
- 评论表单（已登录用户可评论）

### 3. 工具箱（Tools.tsx）

**极简记账本**
- 支持分类选择（食物、交通、娱乐等）
- 金额输入和描述
- 显示今日总支出
- 分类统计

**"今天吃什么"随机决定器**
- 预设食物选项
- 点击随机选择
- 支持自定义选项

### 4. 排行榜（Leaderboard.tsx）

**最惨失败榜**
- 按点赞数排序
- 展示帖子标题、作者、点赞数、浏览量

**最强搞钱榜**
- 按浏览量排序
- 展示高收入相关的帖子

**穷籍等级榜**
- 按穷籍等级排序
- 展示用户等级、积分、等级进度

### 5. 个人中心（Profile.tsx）

- 用户基本信息展示
- 穷籍等级和等级进度条
- 用户统计（发帖、评论、获赞、收藏）
- 最近发帖列表
- 最近活动记录
- 用户成就展示

### 6. 后台管理（Admin.tsx）

**管理员仪表板**
- 总用户数、总帖子数、总评论数
- 待审核帖子数

**帖子管理**
- 帖子列表
- 批准/删除帖子功能

**用户管理**
- 用户列表
- 删除用户功能

## 数据库架构

### 核心表

| 表名 | 说明 |
|------|------|
| users | 用户表（包含角色字段） |
| posts | 帖子表（支持三个分类） |
| comments | 评论表（支持嵌套回复） |
| likes | 点赞表（支持帖子和评论） |
| favorites | 收藏表 |
| userActivity | 用户活动日志（用于计算等级） |
| userProfiles | 用户扩展信息（穷籍等级） |
| expenses | 支出记录表 |

## 后端 API 路由

### 社区功能（community.*）

```typescript
community.getPostsByCategory()      // 获取分类下的帖子
community.getPostDetail()           // 获取单个帖子详情
community.createPost()              // 创建新帖子
community.getComments()             // 获取帖子评论
community.createComment()           // 创建评论
community.likeTarget()              // 点赞帖子或评论
community.favoritePost()            // 收藏帖子
community.getUserFavorites()        // 获取用户收藏
community.getUserPosts()            // 获取用户帖子
```

### 工具箱功能（tools.*）

```typescript
tools.createExpense()               // 创建支出记录
tools.getUserExpenses()             // 获取用户支出列表
tools.getTodayExpenses()            // 获取今日支出
tools.getExpensesByCategory()       // 获取分类统计
```

## SEO 优化

### 已配置的 SEO 元素

- **robots.txt**：搜索引擎爬虫配置
- **sitemap.xml**：网站地图
- **Meta 标签**：title、description、keywords、og:* 标签
- **动态 SEO 工具**：`client/src/lib/seo.ts` 提供 SEO 配置生成函数

### SEO 配置函数

```typescript
// 首页 SEO
DEFAULT_SEO

// 帖子页面 SEO
getPostSEO(post)

// 分类页面 SEO
getCategorySEO(category)

// 用户页面 SEO
getUserSEO(user)

// 更新页面 Meta 标签
updatePageMeta(config)
```

## 设计系统

### 色彩方案

- **主色调**：荧光绿 (#39FF14)
- **背景色**：深色（#0a0a0a）
- **文本色**：浅色（#f5f5f5）
- **边框色**：深灰色（#2a2a2a）

### 字体

- **中文**：Noto Sans SC（Google Fonts）
- **英文**：Inter（Google Fonts）

### 响应式设计

- 移动优先设计
- 支持所有主流设备尺寸
- 触摸友好的交互

## 开发指南

### 添加新功能

1. **定义数据库 schema**（drizzle/schema.ts）
2. **生成数据库迁移**（pnpm drizzle-kit generate）
3. **应用数据库迁移**（webdev_execute_sql）
4. **添加数据库查询函数**（server/db.ts）
5. **创建 tRPC 路由**（server/routers/*.ts）
6. **整合路由**（server/routers.ts）
7. **创建前端页面**（client/src/pages/*.tsx）
8. **在 App.tsx 中注册路由**

### 编写测试

使用 Vitest 编写单元测试：

```bash
pnpm test
```

### 本地开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 部署指南

### 发布网站

1. 在 Manus 管理界面中创建 checkpoint
2. 点击 Publish 按钮
3. 选择发布配置
4. 确认发布

### 自定义域名

1. 在 Settings → Domains 中管理域名
2. 支持购买新域名或绑定现有域名

## 常见问题

### Q: 如何修改主色调？
A: 修改 `client/src/index.css` 中的 CSS 变量 `--primary` 值。

### Q: 如何添加新的社区分类？
A: 修改 `drizzle/schema.ts` 中 posts 表的 category 枚举，然后生成迁移并应用。

### Q: 如何计算穷籍等级？
A: 根据 userActivity 表中的用户活动积分计算，在 userProfiles 表中存储。

### Q: 如何管理后台权限？
A: 在 users 表中设置 role 字段为 "admin"，后台会自动检查权限。

## 性能优化建议

1. **启用缓存**：使用 Redis 缓存热门帖子
2. **数据库索引**：为常用查询字段添加索引
3. **CDN**：使用 CDN 加速静态资源
4. **图片优化**：使用 WebP 格式和响应式图片
5. **代码分割**：使用动态导入优化包大小

## 安全建议

1. **输入验证**：所有用户输入都应该验证
2. **SQL 注入防护**：使用 Drizzle ORM 的参数化查询
3. **XSS 防护**：对用户生成的内容进行转义
4. **CSRF 防护**：使用 tRPC 的内置 CSRF 防护
5. **速率限制**：对 API 端点进行速率限制

## 支持和反馈

如有问题或建议，请通过以下方式联系：

- QQ 群：[在首页中配置]
- 邮件：[在设置中配置]
- GitHub Issues：[如果有 GitHub 仓库]

## 许可证

MIT License

---

**最后更新**：2026-06-23
**版本**：1.0.0
