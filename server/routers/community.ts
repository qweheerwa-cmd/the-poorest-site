import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { eq, desc } from "drizzle-orm";
import { 
  createPost, getPostById, getPostsByCategory, getPostsByUser,
  createComment, getCommentsByPost,
  toggleLike, toggleFavorite, getHotPosts, getDb
} from "../db";
import { posts } from "../../drizzle/schema";

const SENSITIVE_WORDS = [
  '违法', '诈骗', '赌博', '毒品', '色情',
];

function hasSensitiveContent(text: string): boolean {
  return SENSITIVE_WORDS.some(word => text.includes(word));
}

export const communityRouter = router({

  getPosts: publicProcedure
    .input(z.object({ 
      category: z.string().optional(),
      search: z.string().optional(),
      limit: z.number().default(20),
    }).optional())
    .query(async ({ input }) => {
      const cat = input?.category;
      if (cat && cat !== 'all') {
        return await getPostsByCategory(cat, input?.limit || 20);
      }
      return await getHotPosts(input?.limit || 20);
    }),

  // 排行榜
  getLeaderboard: publicProcedure
    .input(z.object({ 
      type: z.enum(['failure', 'money', 'likes']),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      if (input.type === 'failure') {
        // 失败博物馆按点赞数排序（最惨 = 最多共鸣）
        return await db.select().from(posts)
          .where(eq(posts.category, '失败博物馆'))
          .orderBy(desc(posts.likes))
          .limit(input.limit);
      } else if (input.type === 'money') {
        // 搞钱路子按浏览量排序
        return await db.select().from(posts)
          .where(eq(posts.category, '搞钱路子'))
          .orderBy(desc(posts.views))
          .limit(input.limit);
      } else {
        // 按点赞数排序
        return await db.select().from(posts)
          .orderBy(desc(posts.likes))
          .limit(input.limit);
      }
    }),

  getPostById: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      return await getPostById(input.postId);
    }),

  createPost: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      category: z.enum(['失败博物馆', '搞钱路子', '穷人日常']),
    }))
    .mutation(async ({ ctx, input }) => {
      if (hasSensitiveContent(input.title) || hasSensitiveContent(input.content)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '内容包含不适当的词汇，请修改后重试',
        });
      }
      const userId = ctx.user?.id || 1; // 未登录默认用 1 号匿名用户
      return await createPost({
        userId,
        title: input.title,
        content: input.content,
        category: input.category,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }),

  getComments: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      return await getCommentsByPost(input.postId);
    }),

  createComment: publicProcedure
    .input(z.object({ postId: z.number(), content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (hasSensitiveContent(input.content)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '内容包含不适当的词汇，请修改后重试',
        });
      }
      const userId = ctx.user?.id || 1; // 未登录默认用 1 号匿名用户
      const comment = await createComment({
        postId: input.postId,
        userId,
        content: input.content,
        createdAt: new Date(),
      });
      // 更新帖子评论数
      const db = await getDb();
      if (db) {
        await db.update(posts).set({ commentCount: (posts.commentCount as any) + 1 }).where(eq(posts.id, input.postId));
      }
      return comment;
    }),

  toggleLike: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const isLiked = await toggleLike(1, input.postId);
      return { isLiked };
    }),

  toggleFavorite: publicProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const isFavorited = await toggleFavorite(1, input.postId);
      return { isFavorited };
    }),

  reportPost: publicProcedure
    .input(z.object({ postId: z.number(), reason: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),

  followUser: publicProcedure
    .input(z.object({ targetUserId: z.number() }))
    .mutation(async () => {
      return { success: true };
    }),

  sendMessage: publicProcedure
    .input(z.object({ recipientId: z.number(), content: z.string() }))
    .mutation(async () => {
      return { success: true };
    }),

  getNotifications: publicProcedure.query(async () => {
    return [];
  }),

  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date(),
      version: '1.0.0',
    };
  }),

  metrics: publicProcedure.query(async () => {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date(),
    };
  }),
});
