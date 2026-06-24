import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { Trash2, Eye, BarChart3, Users, FileText, AlertCircle } from "lucide-react";

const mockPosts = [
  {
    id: 1,
    title: "我的创业失败经历：从梦想到破产",
    author: "穷人甲",
    category: "失败博物馆",
    likes: 234,
    comments: 45,
    views: 1200,
    status: "approved",
    createdAt: "2026-06-23 14:30",
  },
  {
    id: 2,
    title: "月入2000的我如何通过副业增收到5000",
    author: "穷人乙",
    category: "搞钱路子",
    likes: 567,
    comments: 89,
    views: 3400,
    status: "approved",
    createdAt: "2026-06-23 12:15",
  },
  {
    id: 3,
    title: "今天只花了5块钱吃了一整天",
    author: "穷人丙",
    category: "穷人日常",
    likes: 892,
    comments: 156,
    views: 5600,
    status: "pending",
    createdAt: "2026-06-23 10:00",
  },
];

const mockUsers = [
  {
    id: 1,
    name: "穷人甲",
    email: "user1@example.com",
    role: "user",
    joinDate: "2026-01-15",
    posts: 12,
    comments: 34,
    status: "active",
  },
  {
    id: 2,
    name: "穷人乙",
    email: "user2@example.com",
    role: "user",
    joinDate: "2026-02-20",
    posts: 8,
    comments: 23,
    status: "active",
  },
  {
    id: 3,
    name: "穷人丙",
    email: "user3@example.com",
    role: "user",
    joinDate: "2026-03-10",
    posts: 5,
    comments: 12,
    status: "inactive",
  },
];

const mockStats = {
  totalUsers: 1234,
  totalPosts: 5678,
  totalComments: 12345,
  activeUsers: 456,
  pendingPosts: 12,
};

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "posts" | "users">("dashboard");
  const [posts, setPosts] = useState(mockPosts);
  const [users, setUsers] = useState(mockUsers);

  // 检查是否是管理员
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center border-border max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-foreground text-lg mb-2">无权访问</p>
          <p className="text-muted-foreground mb-6">只有管理员才能访问后台管理系统</p>
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                登录
              </Button>
            </a>
          )}
          {isAuthenticated && (
            <Link href="/">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                返回首页
              </Button>
            </Link>
          )}
        </Card>
      </div>
    );
  }

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleApprovePost = (id: number) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, status: "approved" as const } : p))
    );
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">¥</span>
              </div>
              <span className="text-xl font-bold text-primary">全网最穷站</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/community">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                社区
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                个人中心
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-primary mb-2">后台管理</h1>
        <p className="text-muted-foreground mb-8">管理网站内容和用户</p>

        {/* 标签页 */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "dashboard"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            仪表板
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "posts"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            帖子管理
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "users"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            用户管理
          </button>
        </div>

        {/* 仪表板 */}
        {activeTab === "dashboard" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">总用户数</p>
                  <p className="text-3xl font-bold text-primary">{mockStats.totalUsers}</p>
                </div>
                <Users className="w-12 h-12 text-primary/20" />
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">总帖子数</p>
                  <p className="text-3xl font-bold text-primary">{mockStats.totalPosts}</p>
                </div>
                <FileText className="w-12 h-12 text-primary/20" />
              </div>
            </Card>

            <Card className="p-6 border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">总评论数</p>
                  <p className="text-3xl font-bold text-primary">{mockStats.totalComments}</p>
                </div>
                <Eye className="w-12 h-12 text-primary/20" />
              </div>
            </Card>

            <Card className="p-6 border-border border-destructive/50 bg-destructive/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">待审核帖子</p>
                  <p className="text-3xl font-bold text-destructive">{mockStats.pendingPosts}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-destructive/20" />
              </div>
            </Card>
          </div>
        )}

        {/* 帖子管理 */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">帖子列表</h2>
              <div className="text-sm text-muted-foreground">
                共 {posts.length} 篇帖子
              </div>
            </div>

            {posts.map((post) => (
              <Card key={post.id} className="p-6 border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                          post.status === "approved"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {post.status === "approved" ? "已批准" : "待审核"}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                      <span>作者: {post.author}</span>
                      <span>分类: {post.category}</span>
                      <span>{post.createdAt}</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <span className="text-foreground">👁️ {post.views} 浏览</span>
                      <span className="text-foreground">❤️ {post.likes} 点赞</span>
                      <span className="text-foreground">💬 {post.comments} 评论</span>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {post.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-green-600 text-white hover:bg-green-700"
                        onClick={() => handleApprovePost(post.id)}
                      >
                        批准
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 用户管理 */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">用户列表</h2>
              <div className="text-sm text-muted-foreground">
                共 {users.length} 个用户
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      用户名
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      邮箱
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      加入日期
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      帖子数
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      评论数
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      状态
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-card/50">
                      <td className="px-4 py-3 text-foreground font-semibold">{user.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.joinDate}</td>
                      <td className="px-4 py-3 text-foreground">{user.posts}</td>
                      <td className="px-4 py-3 text-foreground">{user.comments}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            user.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-gray-500/20 text-gray-500"
                          }`}
                        >
                          {user.status === "active" ? "活跃" : "不活跃"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
