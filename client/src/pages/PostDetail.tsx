import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

export default function PostDetail() {
  const [, params] = useRoute("/post/:id");
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const postId = params?.id ? parseInt(params.id) : 0;

  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // 获取帖子详情
  const { data: post, isLoading: postLoading } = trpc.community.getPostById.useQuery(
    { postId },
    { enabled: postId > 0 }
  );

  // 获取评论列表
  const { data: comments = [] } = trpc.community.getComments.useQuery(
    { postId },
    { enabled: postId > 0 }
  );

  // 点赞 mutation
  const toggleLikeMutation = trpc.community.toggleLike.useMutation({
    onMutate: () => { setIsLiked(!isLiked); },
    onError: () => { setIsLiked(!isLiked); },
  });

  // 收藏 mutation
  const toggleFavoriteMutation = trpc.community.toggleFavorite.useMutation({
    onMutate: () => { setIsFavorited(!isFavorited); },
    onError: () => { setIsFavorited(!isFavorited); },
  });

  // 评论 mutation
  const commentMutation = trpc.community.createComment.useMutation({
    onSuccess: () => {
      setCommentText("");
      toast.success("评论成功");
      // 刷新评论列表
      window.location.reload();
    },
    onError: () => {
      toast.error("评论失败，请重试");
    },
  });

  const handleLike = () => {
    toggleLikeMutation.mutate({ postId });
  };

  const handleFavorite = () => {
    toggleFavoriteMutation.mutate({ postId });
  };

  const handleComment = () => {
    if (!commentText.trim() || !commentMutation) {
      toast.error("请输入评论内容");
      return;
    }
    commentMutation.mutate({
      postId,
      content: commentText.trim(),
    });
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post?.title || "全网最穷站",
        text: post?.content?.substring(0, 100) || "分享一个有趣的帖子",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success("链接已复制到剪贴板");
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl">加载中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center border-border max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-4">帖子不存在</h2>
          <Button 
            className="bg-primary hover:bg-primary/90 text-black font-bold"
            onClick={() => navigate("/community")}
          >
            返回社区
          </Button>
        </Card>
      </div>
    );
  }

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
          <Button 
            variant="ghost"
            onClick={() => navigate("/community")}
          >
            ← 返回
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* 帖子内容 */}
        <Card className="p-8 border-border mb-8">
          {/* 分类标签 */}
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </div>

          {/* 标题 */}
          <h1 className="text-4xl font-bold text-primary mb-4">{post.title}</h1>

          {/* 作者信息 */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">P</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">穷人甲</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>

          {/* 内容 */}
          <div className="prose prose-invert max-w-none mb-8">
            <Streamdown>{post.content}</Streamdown>
          </div>

          {/* 交互按钮 */}
          <div className="flex gap-4 flex-wrap">
            <Button
              variant={isLiked ? "default" : "outline"}
              className={isLiked ? "bg-primary text-black" : ""}
              onClick={handleLike}
              disabled={likeMutation.isPending}
            >
              <Heart className="w-4 h-4 mr-2" />
              {post.likes || 0} 点赞
            </Button>
            <Button variant="outline" onClick={() => {}}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {comments.length} 评论
            </Button>
            <Button
              variant={isFavorited ? "default" : "outline"}
              className={isFavorited ? "bg-primary text-black" : ""}
              onClick={handleFavorite}
              disabled={favoriteMutation.isPending}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              收藏
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
        </Card>

        {/* 评论区 */}
        <Card className="p-8 border-border">
          <h2 className="text-2xl font-bold text-primary mb-6">评论</h2>

          {/* 评论输入框 */}
          {isAuthenticated ? (
            <div className="mb-8 pb-8 border-b border-border">
              <Textarea
                placeholder="分享你的想法..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-background border-border text-foreground mb-4"
                rows={4}
              />
              <Button
                className="bg-primary hover:bg-primary/90 text-black font-bold"
                onClick={handleComment}
                disabled={commentMutation.isPending}
              >
                {commentMutation.isPending ? "发布中..." : "发布评论"}
              </Button>
            </div>
          ) : (
            <div className="mb-8 pb-8 border-b border-border p-4 bg-card rounded text-center">
              <p className="text-muted-foreground mb-3">请先登录才能评论</p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-black font-bold"
                onClick={() => navigate("/")}
              >
                去登录
              </Button>
            </div>
          )}

          {/* 评论列表 */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">暂无评论，来发表第一条评论吧</p>
            ) : (
              comments.map((comment: any) => (
                <div key={comment.id} className="pb-6 border-b border-border last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">U</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-foreground">用户</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString("zh-CN")}
                        </p>
                      </div>
                      <p className="text-foreground mb-2">{comment.content}</p>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        ❤️ {comment.likes || 0} 点赞
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
