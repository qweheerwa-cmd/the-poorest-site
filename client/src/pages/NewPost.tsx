import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const CATEGORIES = ["失败博物馆", "搞钱路子", "穷人日常"] as const;

export default function NewPost() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("失败博物馆");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPostMutation = trpc.community.createPost.useMutation();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("请输入帖子标题");
      return;
    }
    
    if (!content.trim()) {
      toast.error("请输入帖子内容");
      return;
    }

    if (title.length > 255) {
      toast.error("标题不能超过 255 个字符");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createPostMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        category,
      });
      
      toast.success("帖子发布成功！");
      
      // 发布成功后跳转到帖子详情页
      if (result.id) {
        navigate(`/post/${result.id}`);
      } else {
        navigate("/community");
      }
    } catch (error: any) {
      console.error("发布失败:", error);
      toast.error(error?.message || "发布失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663787701545/M2Nw8maLLokb9dqyXWZg9t/logo-main-i6ARLn6jxjZeneN8mCbzTS.webp" 
              alt="全网最穷站" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary">全网最穷站</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary mb-8">发布新帖子</h1>

        <Card className="p-8 border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 分类选择 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                选择分类 *
              </label>
              <Select value={category} onValueChange={(value) => setCategory(value as typeof CATEGORIES[number])}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 标题输入 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                帖子标题 *
              </label>
              <Input
                placeholder="输入一个引人注目的标题..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background border-border text-foreground"
                maxLength={255}
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {title.length}/255
              </p>
            </div>

            {/* 内容编辑 */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                帖子内容 * (支持 Markdown)
              </label>
              <Textarea
                placeholder="分享你的故事、经验或想法...（支持 Markdown 格式）"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-background border-border text-foreground min-h-96"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.length} 字符
              </p>
              <div className="mt-2 p-3 bg-card border border-border rounded text-xs text-muted-foreground">
                <p className="font-semibold mb-1">Markdown 支持：</p>
                <ul className="space-y-1">
                  <li>**粗体** 或 __粗体__</li>
                  <li>*斜体* 或 _斜体_</li>
                  <li>[链接](url)</li>
                  <li>![图片](url)</li>
                  <li>`代码` 或 ```代码块```</li>
                </ul>
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || createPostMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-black font-bold flex-1"
              >
                {isSubmitting || createPostMutation.isPending ? "发布中..." : "发布帖子"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/community")}
                disabled={isSubmitting || createPostMutation.isPending}
              >
                取消
              </Button>
            </div>
          </form>
        </Card>

        {/* 提示信息 */}
        <Card className="mt-8 p-6 border-border bg-card/50">
          <h3 className="font-semibold text-primary mb-3">💡 发帖小贴士</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• 分享真实的故事和经验，越详细越好</li>
            <li>• 遵守社区规则，不发布违法或不当内容</li>
            <li>• 使用清晰的标题，让其他人能快速理解你的帖子</li>
            <li>• 适当使用 Markdown 格式，让内容更易读</li>
            <li>• 优质内容会获得更多点赞和评论</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
