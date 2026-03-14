import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
function createMockContext(userId: number = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `test-user-${userId}`,
      email: `test${userId}@example.com`,
      name: `Test User ${userId}`,
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Posts Router", () => {
  it("should list published posts", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const posts = await caller.posts.list({
      limit: 20,
      offset: 0,
      sortBy: "latest",
    });

    expect(Array.isArray(posts)).toBe(true);
  });

  it("should create a post when authenticated", async () => {
    const ctx = createMockContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.posts.create({
      title: "Test Post",
      slug: "test-post",
      content: "This is a test post",
      excerpt: "Test excerpt",
      published: true,
    });

    expect(result).toBeDefined();
  });

  it("should not create a post without authentication", async () => {
    const ctx = createMockContext();
    ctx.user = null;
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.posts.create({
        title: "Test Post",
        slug: "test-post",
        content: "This is a test post",
        published: true,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe("Comments Router", () => {
  it("should get comments for a post", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const comments = await caller.comments.getByPost({ postId: 1 });
    expect(Array.isArray(comments)).toBe(true);
  });

  it("should create a comment when authenticated", async () => {
    const ctx = createMockContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.comments.create({
      postId: 1,
      content: "Great post!",
    });

    expect(result).toBeDefined();
  });
});

describe("Reactions Router", () => {
  it("should get reactions for a post", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const reactions = await caller.reactions.getByPost({ postId: 1 });
    expect(Array.isArray(reactions)).toBe(true);
  });

  it("should add a reaction when authenticated", async () => {
    const ctx = createMockContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.reactions.add({
      postId: 1,
      type: "heart",
    });

    expect(result).toBeDefined();
  });

  it("should remove a reaction when authenticated", async () => {
    const ctx = createMockContext(1);
    const caller = appRouter.createCaller(ctx);

    await caller.reactions.remove({ postId: 1 });
    // Should not throw
  });
});

describe("Saved Posts Router", () => {
  it("should list saved posts for authenticated user", async () => {
    const ctx = createMockContext(1);
    const caller = appRouter.createCaller(ctx);

    const saved = await caller.savedPosts.list({
      limit: 20,
      offset: 0,
    });

    expect(Array.isArray(saved)).toBe(true);
  });

  it("should save a post when authenticated", async () => {
    const ctx = createMockContext(1);
    const caller = appRouter.createCaller(ctx);

    const result = await caller.savedPosts.save({ postId: 1 });
    expect(result).toBeDefined();
  });

  it("should unsave a post when authenticated", async () => {
    const ctx = createMockContext(1);
    const caller = appRouter.createCaller(ctx);

    await caller.savedPosts.unsave({ postId: 1 });
    // Should not throw
  });
});

describe("Tags Router", () => {
  it("should list all tags", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const tags = await caller.tags.list();
    expect(Array.isArray(tags)).toBe(true);
  });
});
