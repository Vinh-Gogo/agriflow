import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  posts: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        sortBy: z.enum(['latest', 'top']).default('latest'),
      }))
      .query(async ({ input }) => {
        return await db.getPublishedPosts(input.limit, input.offset, input.sortBy);
      }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getPostBySlug(input.slug);
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPostById(input.id);
      }),

    getUserPosts: publicProcedure
      .input(z.object({
        userId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getUserPosts(input.userId, input.limit, input.offset);
      }),

    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        content: z.string().min(1),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createPost({
          userId: ctx.user.id,
          ...input,
        });
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const post = await db.getPostById(input.id);
        if (!post) throw new TRPCError({ code: 'NOT_FOUND' });
        if (post.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        const { id, ...data } = input;
        await db.updatePost(id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const post = await db.getPostById(input.id);
        if (!post) throw new TRPCError({ code: 'NOT_FOUND' });
        if (post.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        await db.deletePost(input.id);
      }),
  }),

  tags: router({
    list: publicProcedure.query(async () => {
      return await db.getAllTags();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getTagBySlug(input.slug);
      }),

    getPostsByTag: publicProcedure
      .input(z.object({
        tagId: z.number(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        return await db.getPostsByTag(input.tagId, input.limit, input.offset);
      }),
  }),

  comments: router({
    getByPost: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPostComments(input.postId);
      }),

    create: protectedProcedure
      .input(z.object({
        postId: z.number(),
        content: z.string().min(1),
        parentCommentId: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createComment({
          postId: input.postId,
          userId: ctx.user.id,
          content: input.content,
          parentCommentId: input.parentCommentId,
        });
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const comment = await db.getPostComments(0);
        const found = comment.find(c => c.id === input.id);
        if (!found) throw new TRPCError({ code: 'NOT_FOUND' });
        if (found.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN' });
        }
        await db.deleteComment(input.id);
      }),
  }),

  reactions: router({
    getByPost: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPostReactions(input.postId);
      }),

    getUserReaction: publicProcedure
      .input(z.object({ userId: z.number(), postId: z.number() }))
      .query(async ({ input }) => {
        return await db.getUserReaction(input.userId, input.postId);
      }),

    add: protectedProcedure
      .input(z.object({
        postId: z.number(),
        type: z.enum(['like', 'heart', 'fire']).default('like'),
      }))
      .mutation(async ({ input, ctx }) => {
        const existing = await db.getUserReaction(ctx.user.id, input.postId);
        if (existing) {
          await db.removeReaction(ctx.user.id, input.postId);
        }
        return await db.addReaction({
          userId: ctx.user.id,
          postId: input.postId,
          type: input.type,
        });
      }),

    remove: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.removeReaction(ctx.user.id, input.postId);
      }),
  }),

  savedPosts: router({
    list: protectedProcedure
      .input(z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input, ctx }) => {
        return await db.getUserSavedPosts(ctx.user.id, input.limit, input.offset);
      }),

    isSaved: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.isSaved(ctx.user.id, input.postId);
      }),

    save: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        return await db.savePost(ctx.user.id, input.postId);
      }),

    unsave: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.unsavePost(ctx.user.id, input.postId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
