import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Edit2, LogOut, Award, TrendingUp, MessageSquare, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center border-border max-w-md">
          <p className="text-foreground text-lg mb-6">请登录后查看个人主页</p>
          <a href={getLoginUrl()}>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              登录
            </Button>
          </a>
        </Card>
      </div>
    );
  }

  // 示例用户数据
  const userProfile = {
    name: user?.name || "穷人用户",
    email: user?.email || "user@example.com",
    bio: "一个在贫困线上挣扎的勇士",
    povertyLevel: 5,
    totalPoints: 2450,
    postCount: 12,
    commentCount: 34,
    likeCount: 156,
    joinDate: "2026-01-15",
    stats: {
      posts: 12,
      comments: 34,
      likes: 156,
      favorites: 23,
    },
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getLevelName = (level: number) => {
    const levels = [
      "穷籍新手",
      "穷籍战士",
      "穷籍高手",
      "穷籍精英",
      "穷籍大师",
      "穷籍传奇",
      "穷籍神话",
      "穷籍至尊",
      "穷籍帝王",
      "穷籍之神",
    ];
    return levels[Math.min(level - 1, levels.length - 1)] || "穷籍新手";
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
            <Link href="/tools">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                工具箱
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 用户信息卡片 */}
        <Card className="p-8 border-border mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 左侧：头像和基本信息 */}
            <div className="flex-shrink-0 text-center">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                alt={userProfile.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h1 className="text-2xl font-bold text-foreground mb-2">{userProfile.name}</h1>
              <p className="text-muted-foreground mb-4">{userProfile.email}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" className="border-border">
                  <Edit2 className="w-4 h-4 mr-2" />
                  编辑资料
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              </div>
            </div>

            {/* 右侧：穷籍等级和统计 */}
            <div className="flex-1">
              {/* 穷籍等级 */}
              <div className="mb-8 p-6 bg-primary/10 border border-primary/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">穷籍等级</p>
                    <h2 className="text-4xl font-bold text-primary">Lv.{userProfile.povertyLevel}</h2>
                    <p className="text-lg font-semibold text-foreground mt-1">
                      {getLevelName(userProfile.povertyLevel)}
                    </p>
                  </div>
                  <Award className="w-16 h-16 text-primary opacity-50" />
                </div>

                {/* 等级进度条 */}
                <div className="space-y-2">
                  <div className="w-full bg-card rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all"
                      style={{ width: `${(userProfile.povertyLevel / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    积分：{userProfile.totalPoints} / {(userProfile.povertyLevel + 1) * 1000}
                  </p>
                </div>
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">发帖数</p>
                  <p className="text-2xl font-bold text-primary">{userProfile.stats.posts}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">评论数</p>
                  <p className="text-2xl font-bold text-primary">{userProfile.stats.comments}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">获赞数</p>
                  <p className="text-2xl font-bold text-primary">{userProfile.stats.likes}</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">收藏数</p>
                  <p className="text-2xl font-bold text-primary">{userProfile.stats.favorites}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 用户活动 */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 最近发帖 */}
          <Card className="p-6 border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              最近发帖
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                <p className="font-semibold text-foreground text-sm line-clamp-2">
                  我的创业失败经历：从梦想到破产
                </p>
                <p className="text-xs text-muted-foreground mt-2">2 小时前</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                <p className="font-semibold text-foreground text-sm line-clamp-2">
                  今天只花了5块钱吃了一整天
                </p>
                <p className="text-xs text-muted-foreground mt-2">1 天前</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                <p className="font-semibold text-foreground text-sm line-clamp-2">
                  分享我的三个副业渠道
                </p>
                <p className="text-xs text-muted-foreground mt-2">3 天前</p>
              </div>
            </div>
            <Link href="/community">
              <Button variant="outline" className="w-full mt-4 border-border">
                查看全部
              </Button>
            </Link>
          </Card>

          {/* 最近活动 */}
          <Card className="p-6 border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary" />
              最近活动
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-card border border-border rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="text-primary font-semibold">点赞</span> 了帖子 "投资失败：被骗走10万块"
                </p>
                <p className="text-xs text-muted-foreground mt-2">2 小时前</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="text-primary font-semibold">评论</span> 了帖子 "月入2000的我如何通过副业增收到5000"
                </p>
                <p className="text-xs text-muted-foreground mt-2">5 小时前</p>
              </div>
              <div className="p-3 bg-card border border-border rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="text-primary font-semibold">收藏</span> 了帖子 "理财小白入门：如何用1000块开始投资"
                </p>
                <p className="text-xs text-muted-foreground mt-2">1 天前</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 用户成就 */}
        <Card className="p-6 border-border">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-primary" />
            用户成就
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm font-semibold text-foreground">首次发帖</p>
              <p className="text-xs text-muted-foreground mt-1">已解锁</p>
            </div>
            <div className="text-center p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-sm font-semibold text-foreground">评论达人</p>
              <p className="text-xs text-muted-foreground mt-1">已解锁</p>
            </div>
            <div className="text-center p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="text-3xl mb-2">❤️</div>
              <p className="text-sm font-semibold text-foreground">获赞100次</p>
              <p className="text-xs text-muted-foreground mt-1">已解锁</p>
            </div>
            <div className="text-center p-4 bg-card border border-border rounded-lg opacity-50">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-sm font-semibold text-foreground">排行榜第一</p>
              <p className="text-xs text-muted-foreground mt-1">未解锁</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
