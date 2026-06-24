import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Trophy, TrendingDown, TrendingUp, Medal } from "lucide-react";

const mockFailureLeaderboard = [
  {
    rank: 1,
    author: "穷人甲",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    title: "我的创业失败经历：从梦想到破产",
    likes: 892,
    views: 5600,
  },
  {
    rank: 2,
    author: "穷人乙",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    title: "投资失败：被骗走10万块",
    likes: 756,
    views: 4200,
  },
  {
    rank: 3,
    author: "穷人丙",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    title: "职场受挫：从高管到失业",
    likes: 634,
    views: 3800,
  },
  {
    rank: 4,
    author: "穷人丁",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    title: "恋爱失败：分手后的财务危机",
    likes: 512,
    views: 3100,
  },
  {
    rank: 5,
    author: "穷人戊",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    title: "健康危机：生病花光所有积蓄",
    likes: 445,
    views: 2800,
  },
];

const mockMoneyLeaderboard = [
  {
    rank: 1,
    author: "搞钱高手甲",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=11",
    title: "月入2000的我如何通过副业增收到5000",
    views: 8900,
    likes: 1234,
  },
  {
    rank: 2,
    author: "搞钱高手乙",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=12",
    title: "5个零成本副业，每个月额外收入3000+",
    views: 7600,
    likes: 1045,
  },
  {
    rank: 3,
    author: "搞钱高手丙",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=13",
    title: "如何通过知识变现每月赚5000",
    views: 6800,
    likes: 923,
  },
  {
    rank: 4,
    author: "搞钱高手丁",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=14",
    title: "自由职业者必读：如何提高时薪到200+",
    views: 5900,
    likes: 812,
  },
  {
    rank: 5,
    author: "搞钱高手戊",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=15",
    title: "理财小白入门：如何用1000块开始投资",
    views: 5200,
    likes: 734,
  },
];

const mockUserLeaderboard = [
  {
    rank: 1,
    name: "穷籍大师",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=21",
    level: 10,
    points: 8900,
  },
  {
    rank: 2,
    name: "穷籍精英",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=22",
    level: 9,
    points: 7600,
  },
  {
    rank: 3,
    name: "穷籍高手",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=23",
    level: 8,
    points: 6800,
  },
  {
    rank: 4,
    name: "穷籍战士",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=24",
    level: 7,
    points: 5900,
  },
  {
    rank: 5,
    name: "穷籍新手",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=25",
    level: 6,
    points: 5200,
  },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<"failure" | "money" | "user">("failure");

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
            {mockFailureLeaderboard.map((item) => (
              <Link key={item.rank} href={`/post/${item.rank}`}>
                <Card className="p-6 border-border hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-6">
                    {/* 排名 */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {getRankMedal(item.rank)}
                      </div>
                      <p className="text-sm text-muted-foreground">第 {item.rank} 名</p>
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={item.avatar}
                          alt={item.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <h3 className="font-semibold text-foreground">{item.author}</h3>
                      </div>
                      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                        {item.title}
                      </h2>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>❤️</span>
                          <span>{item.likes} 点赞</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>{item.views} 浏览</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* 最强搞钱榜 */}
        {activeTab === "money" && (
          <div className="space-y-4">
            {mockMoneyLeaderboard.map((item) => (
              <Link key={item.rank} href={`/post/${item.rank}`}>
                <Card className="p-6 border-border hover:border-primary/50 transition-all cursor-pointer group">
                  <div className="flex items-start gap-6">
                    {/* 排名 */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {getRankMedal(item.rank)}
                      </div>
                      <p className="text-sm text-muted-foreground">第 {item.rank} 名</p>
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={item.avatar}
                          alt={item.author}
                          className="w-10 h-10 rounded-full"
                        />
                        <h3 className="font-semibold text-foreground">{item.author}</h3>
                      </div>
                      <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                        {item.title}
                      </h2>
                      <div className="flex gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span>❤️</span>
                          <span>{item.likes} 点赞</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>{item.views} 浏览</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* 穷籍等级榜 */}
        {activeTab === "user" && (
          <div className="space-y-4">
            {mockUserLeaderboard.map((item) => (
              <Card key={item.rank} className="p-6 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* 排名 */}
                    <div className="text-3xl font-bold text-primary">{getRankMedal(item.rank)}</div>

                    {/* 用户信息 */}
                    <div className="flex items-center gap-4">
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">穷籍等级 Lv.{item.level}</p>
                      </div>
                    </div>
                  </div>

                  {/* 积分 */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{item.points}</p>
                    <p className="text-sm text-muted-foreground">总积分</p>
                  </div>
                </div>

                {/* 等级进度条 */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="w-full bg-card rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{ width: `${(item.level / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    等级进度：{item.level}/10
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
