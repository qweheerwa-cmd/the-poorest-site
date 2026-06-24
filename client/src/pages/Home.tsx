import { useAuth as useAuthHook } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { updatePageMeta, DEFAULT_SEO } from "@/lib/seo";
import { ChevronDown, Zap, TrendingUp, Users, Gift, ArrowRight } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, logout } = useAuthHook();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    updatePageMeta(DEFAULT_SEO);
  }, []);

  const faqItems = [
    {
      question: "全网最穷站是什么？",
      answer: "全网最穷站是一个为穷人打造的互助社区。我们聚集了一群在贫困线上挣扎的勇士，分享失败经历，交流搞钱路子，一起抱团取暖。"
    },
    {
      question: "如何发布帖子？",
      answer: "登录后，进入社区页面，选择相应的分类（失败博物馆、搞钱路子、穷人日常），点击发布按钮即可发布帖子。"
    },
    {
      question: "穷籍等级是什么？",
      answer: "穷籍等级是根据您在社区的活跃度（发帖、评论、点赞、收藏等）计算的等级。等级越高，您在社区的影响力越大。"
    },
    {
      question: "工具箱有什么功能？",
      answer: "工具箱提供了极简记账本（记录日常开销）和\"今天吃什么\"随机决定器等实用工具，帮助您更好地管理生活。"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition" onClick={() => navigate("/")}>
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663787701545/M2Nw8maLLokb9dqyXWZg9t/logo-main-i6ARLn6jxjZeneN8mCbzTS.webp" 
              alt="全网最穷站" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-primary">全网最穷站</span>
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-wrap justify-end">
            <Button variant="ghost" size="sm" onClick={() => navigate("/community")}>社区</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tools")}>工具箱</Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/leaderboard")}>排行榜</Button>

          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero 区域 - 纯背景展示 */}
        <section className="relative overflow-hidden bg-black min-h-[500px] md:min-h-[600px] flex items-center justify-center mt-16 md:mt-20">
          {/* 背景图片 - 完全展示 */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663787701545/M2Nw8maLLokb9dqyXWZg9t/hero-background-ZV8iYZbjAu7aZn9PrkjF6D.webp" 
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            {/* 轻微渐变遮罩 - 只在底部，让背景图片充分展示 */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
          </div>


        </section>

        {/* Hero 下方 - 文字和 CTA 区域 */}
        <section className="relative bg-gradient-to-b from-black/80 to-background py-12 md:py-16 border-b border-primary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* 主标题 */}
              <div className="mb-6 text-center">
                <h2 className="text-3xl md:text-5xl font-black mb-4">
                  <span className="text-primary">寻找同类</span>
                  <br />
                  <span className="text-white">抱团取暖</span>
                </h2>
              </div>

              {/* 副标题 */}
              <div className="mb-8 text-center">
                <p className="text-lg md:text-xl leading-relaxed text-gray-300 mb-4">
                  全网最穷站，为在贫困线上挣扎的勇士打造。这里没有财富，只有共鸣。
                </p>
                <p className="text-base md:text-lg text-gray-400">
                  分享失败，交流搞钱，一起抱团取暖。
                </p>
              </div>

              {/* CTA 按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-black font-bold text-base px-8 py-6 rounded-lg group"
                  onClick={() => navigate("/community")}
                >
                  进入社区
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary/50 hover:border-primary text-primary font-bold text-base px-8 py-6 rounded-lg"
                  onClick={() => navigate("/tools")}
                >
                  工具箱
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 分割线 - 装饰元素 */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

        {/* 特性介绍区域 - 丰富视觉 */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                为什么选择<span className="text-primary">全网最穷站</span>？
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full"></div>
            </div>

            {/* 特性卡片 - 优化设计 */}
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🏛️",
                  title: "失败博物馆",
                  description: "分享创业失败、投资失败、职场受挫等各种失败经历。失败是成功之母，一起学习失败的教训。",
                  color: "from-red-500/10 to-red-500/5"
                },
                {
                  icon: "💰",
                  title: "搞钱路子",
                  description: "分享副业、兼职、创业等各种搞钱方法。帮助穷人增加收入，实现财务自由。",
                  color: "from-primary/10 to-primary/5"
                },
                {
                  icon: "🏠",
                  title: "穷人日常",
                  description: "分享穷人的日常生活、省钱技巧、生活小妙招。一起发现生活中的美好。",
                  color: "from-blue-500/10 to-blue-500/5"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-xl border border-primary/20 hover:border-primary/50 transition-all duration-300 p-8 bg-gradient-to-br ${feature.color} hover:shadow-lg hover:shadow-primary/20`}
                >
                  {/* 背景装饰 */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-300"></div>

                  {/* 内容 */}
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 核心功能区域 */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background to-black/50 border-t border-primary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                核心<span className="text-primary">功能</span>
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "工具箱",
                  description: "极简记账本和随机决定器，帮助您管理生活。"
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "排行榜",
                  description: "最惨失败榜和最强搞钱榜，激励社区成员。"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "穷籍等级",
                  description: "根据活跃度计算等级，展示您的社区影响力。"
                },
                {
                  icon: <Gift className="w-8 h-8" />,
                  title: "社区互动",
                  description: "点赞、评论、收藏，与同类建立深度连接。"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group flex gap-6 p-6 rounded-lg border border-primary/20 hover:border-primary/50 bg-card/50 hover:bg-card/70 transition-all duration-300"
                >
                  <div className="flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QQ 群引流区域 - 丰富视觉 */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 via-background to-primary/10 border-y border-primary/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                加入 <span className="text-primary">QQ 群</span> 获取更多资源
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                在 QQ 群中，我们分享更多的搞钱方法、失败经历和生活技巧。还有专属的群福利和活动。
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-black font-bold text-lg px-12 py-7 rounded-lg group"
                onClick={() => { navigator.clipboard.writeText("1025103809"); alert("QQ群号：1025103809（已复制到剪贴板）"); }}
              >
                加入 QQ 群
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ 区域 - 优化设计 */}
        <section className="py-16 md:py-24 bg-background border-t border-primary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                常见<span className="text-primary">问题</span>
              </h2>
              <div className="h-1 w-24 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqItems.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-primary/20 rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-card/50 hover:bg-card/70 transition-colors"
                  >
                    <span className="text-lg font-bold text-white text-left">{item.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-primary transition-transform duration-300 ${
                        expandedFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 py-4 bg-black/30 border-t border-primary/20">
                      <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 分割线 */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

        {/* Footer */}
        <footer className="bg-black/80 border-t border-primary/20 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-white mb-4">关于我们</h3>
                <p className="text-gray-400 text-sm">
                  全网最穷站是一个为穷人打造的互助社区，聚集穷人，一起建站，一起搞钱。
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">社区</h3>
                <ul className="space-y-2">
                  <li><a href="/community" className="text-gray-400 hover:text-primary transition">失败博物馆</a></li>
                  <li><a href="/community" className="text-gray-400 hover:text-primary transition">搞钱路子</a></li>
                  <li><a href="/community" className="text-gray-400 hover:text-primary transition">穷人日常</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">工具</h3>
                <ul className="space-y-2">
                  <li><a href="/tools" className="text-gray-400 hover:text-primary transition">记账本</a></li>
                  <li><a href="/leaderboard" className="text-gray-400 hover:text-primary transition">排行榜</a></li>
                  <li><a href="/profile" className="text-gray-400 hover:text-primary transition">个人中心</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-4">联系我们</h3>
                <ul className="space-y-2">
                  <li><span className="text-gray-400">QQ 群：1025103809</span></li>
                  <li><span className="text-gray-400">邮箱：contact@poorest.site</span></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-primary/20 pt-8 text-center">
              <p className="text-gray-400 text-sm mb-2">© 2026 全网最穷站. All rights reserved.</p>
              <p className="text-primary font-bold">穷并快乐着 💚</p>
              <div className="mt-4 space-x-4 text-xs text-gray-500">
                <a href="/terms" className="hover:text-primary transition">用户协议</a>
                <span>|</span>
                <a href="/terms" className="hover:text-primary transition">隐私政策</a>
                <span>|</span>
                <a href="https://beian.miit.gov.cn/" className="hover:text-primary transition">蜀ICP备2026033843号-1</a>
                <span>|</span>
                <a href="https://beian.miit.gov.cn/" className="hover:text-primary transition">川公网安备51072502110081号</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
