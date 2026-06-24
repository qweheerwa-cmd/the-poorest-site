import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Heart, MessageCircle, Eye, Share2, Search, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

const CATEGORIES = ["失败博物馆", "搞钱路子", "穷人日常"] as const;

const categoryImages: Record<typeof CATEGORIES[number], string> = {
  "失败博物馆": "https://d2xsxph8kpxj0f.cloudfront.net/310519663787701545/M2Nw8maLLokb9dqyXWZg9t/category-failure-museum-i6ARLn6jxjZeneN8mCbzTS.webp",
  "搞钱路子": "https://d2xsxph8kpxj0f.cloudfront.net/310519663787701545/M2Nw8maLLokb9dqyXWZg9t/category-money-making-i6ARLn6jxjZeneN8mCbzTS.webp",
  "穷人日常": "https://d2xsxph8kpxj0f.cloudfront.net/310519663787701545/M2Nw8maLLokb9dqyXWZg9t/category-daily-life-i6ARLn6jxjZeneN8mCbzTS.webp",
};

const categoryDescriptions: Record<typeof CATEGORIES[number], string> = {
  "失败博物馆": "分享创业失败、投资失败、职场受挫等各种失败经历。失败是成功之母，一起学习失败的教训。",
  "搞钱路子": "分享副业、兼职、创业等各种搞钱方法。帮助穷人增加收入，实现财务自由。",
  "穷人日常": "分享穷人的日常生活、省钱技巧、生活小妙招。一起发现生活中的美好。",
};

export default function Community() {
  const { isAuthenticated } = useAuth();
  const [locationPath, navigate] = useLocation();
  const searchParams = new URLSearchParams(locationPath.split("?")[1] || "");
  const initialCategory = (searchParams.get("category") as any) || CATEGORIES[0];
  
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 获取帖子列表
  const { data: posts = [], isLoading } = trpc.community.getPosts.useQuery({
    category: selectedCategory,
    search: searchQuery || undefined,
    limit: 20,
  });

  const filteredPosts = posts.filter(
    (post: any) =>
      (!searchQuery || post.title.includes(searchQuery) || post.content.includes(searchQuery))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition" onClick={() => navigate("/")}>全网最穷站</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>首页</Button>
              <Button variant="ghost" onClick={() => navigate("/tools")}>工具箱</Button>
              <Button variant="ghost" onClick={() => navigate("/leaderboard")}>排行榜</Button>
              <Button className="bg-primary hover:bg-primary/90 text-black font-bold" onClick={() => navigate("/post/new")}>
                  <Plus className="w-4 h-4 mr-2" />
                  发帖
                </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* 分类导航 - 优化版 */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedCategory === category
                    ? "ring-2 ring-primary shadow-lg shadow-primary/50"
                    : "hover:ring-2 hover:ring-primary/50"
                }`}
              >
                {/* 分类配图 */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={categoryImages[category]}
                    alt={category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* 分类标题和描述 */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-primary mb-2">{category}</h3>
                    <p className="text-sm text-gray-200">{categoryDescriptions[category]}</p>
                  </div>

                  {/* 选中指示器 */}
                  {selectedCategory === category && (
                    <div className="absolute top-4 right-4 bg-primary text-black px-3 py-1 rounded-full text-sm font-bold">
                      已选中
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="搜索帖子..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
            />
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-black font-bold" onClick={() => navigate("/post/new")}>
              <Plus className="w-4 h-4 mr-2" />
              发帖
            </Button>
        </div>

        {/* 帖子列表 */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">加载中...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            filteredPosts.map((post: any) => (
              <Card
                key={post.id}
                className="p-6 bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card/70 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                <div className="flex gap-4">
                  {/* 作者头像 */}
                  <div className="flex-shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.userId}`}
                      alt="用户头像"
                      className="w-12 h-12 rounded-full"
                    />
                  </div>

                  {/* 帖子内容 */}
                  <div className="flex-1 min-w-0">
                    {/* 作者和时间 */}
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-bold text-primary">穷人{post.userId}</span>
                        <span className="text-gray-400 text-sm ml-2">
                          {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>

                    {/* 标题 */}
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* 摘要 */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {post.content.substring(0, 100)}...
                    </p>

                    {/* 交互数据 */}
                    <div className="flex items-center gap-6 text-gray-400 text-sm">
                      <div className="flex items-center gap-2 hover:text-primary transition">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-primary transition">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 hover:text-primary transition">
                        <Eye className="w-4 h-4" />
                        <span>{post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">暂无帖子</p>
              <Button
                  className="mt-4 bg-primary hover:bg-primary/90 text-black font-bold"
                  onClick={() => navigate("/post/new")}
                >
                  成为第一个发帖者
                </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
