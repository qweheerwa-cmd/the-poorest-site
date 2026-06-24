import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Trophy, TrendingDown, TrendingUp, Medal } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"failure" | "money" | "user">("failure");

  // 获取排行榜数据
  const { data: failurePosts = [], isLoading: failureLoading } = trpc.community.getLeaderboard.useQuery(
    { type: "failure", limit: 10 },
    { enabled: activeTab === "failure" }
  );

  const { data: moneyPosts = [], isLoading: moneyLoading } = trpc.community.getLeaderboard.useQuery(
    { type: "money", limit: 10 },
    { enabled: activeTab === "money" }
  );

  const getRankMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
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

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">排行榜</h1>
          <p className="text-muted-foreground">
            看看谁是最惨的失败者，谁是最强的搞钱高手
          </p>
        </div>

        {/* 标签页 */}
        <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("failure")}
            className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "failure"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingDown className="w-5 h-5 inline mr-2" />
            最惨失败榜
          </button>
          <button
            onClick={() => setActiveTab("money")}
            className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "money"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="w-5 h-5 inline mr-2" />
            最强搞钱榜
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap ${
              activeTab === "user"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Medal className="w-5 h-5 inline mr-2" />
            穷籍等级榜
          </button>
        </div>

        {/* 最惨失败榜 */}
        {activeTab === "failure" && (
          <div className="space-y-4">
            {failureLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            ) : failurePosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无数据，快去发第一个帖子吧</p>
              </div>
            ) : (
              failurePosts.map((item: any, index: number) => (
                <Link key={item.id} href={`/post/${item.id}`}>
                  <Card className="p-6 border-border hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="flex items-start gap-6">
                      {/* 排名 */}
                      <div className="flex-shrink-0 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {getRankMedal(index + 1)}
                        </div>
                        <p className="text-sm text-muted-foreground">第 {index + 1} 名</p>
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId}`}
                            alt="用户头像"
                            className="w-10 h-10 rounded-full"
                          />
                          <h3 className="font-semibold text-foreground">穷人{item.userId}</h3>
                        </div>
                        <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                          {item.title}
                        </h2>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>❤️</span>
                            <span>{item.likes || 0} 点赞</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👁️</span>
                            <span>{item.views || 0} 浏览</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* 最强搞钱榜 */}
        {activeTab === "money" && (
          <div className="space-y-4">
            {moneyLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">加载中...</p>
              </div>
            ) : moneyPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">暂无数据，快去分享你的搞钱路子</p>
              </div>
            ) : (
              moneyPosts.map((item: any, index: number) => (
                <Link key={item.id} href={`/post/${item.id}`}>
                  <Card className="p-6 border-border hover:border-primary/50 transition-all cursor-pointer group">
                    <div className="flex items-start gap-6">
                      {/* 排名 */}
                      <div className="flex-shrink-0 text-center">
                        <div className="text-3xl font-bold text-primary mb-2">
                          {getRankMedal(index + 1)}
                        </div>
                        <p className="text-sm text-muted-foreground">第 {index + 1} 名</p>
                      </div>

                      {/* 内容 */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.userId}`}
                            alt="用户头像"
                            className="w-10 h-10 rounded-full"
                          />
                          <h3 className="font-semibold text-foreground">穷人{item.userId}</h3>
                        </div>
                        <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                          {item.title}
                        </h2>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>❤️</span>
                            <span>{item.likes || 0} 点赞</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>👁️</span>
                            <span>{item.views || 0} 浏览</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* 穷籍等级榜 - 暂用 mock，后续对接用户等级系统 */}
        {activeTab === "user" && (
          <div className="space-y-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">穷籍等级榜开发中，敬请期待～</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
