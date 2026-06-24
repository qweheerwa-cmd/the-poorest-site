import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { 
  createPost, getPostById, getPostsByCategory, getPostsByUser,
  createComment, getCommentsByPost,
  toggleLike, toggleFavorite, getHotPosts
} from "../db";

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

  getPostById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getPostById(input.id);
    }),

  createPost: publicProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      category: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (hasSensitiveContent(input.title) || hasSensitiveContent(input.content)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: '内容包含不适当的词汇，请修改后重试',
        });
      }
      return await createPost({
        userId: 1, // 匿名用户
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
      return await createComment({
        postId: input.postId,
        userId: 1, // 匿名用户
        content: input.content,
        createdAt: new Date(),
      });
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
