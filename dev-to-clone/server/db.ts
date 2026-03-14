import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, posts, comments, tags, postTags, reactions, savedPosts } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Posts queries
export async function getPublishedPosts(limit: number = 20, offset: number = 0, sortBy: 'latest' | 'top' = 'latest') {
  const db = await getDb();
  if (!db) return [];

  const orderBy = sortBy === 'latest' ? desc(posts.createdAt) : desc(posts.viewCount);
  
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserPosts(userId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function createPost(data: {
  userId: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(posts).values({
    userId: data.userId,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    published: data.published ?? false,
  });

  return result;
}

export async function updatePost(id: number, data: Partial<{
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
}>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(posts).set(data).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(posts).where(eq(posts.id, id));
}

// Tags queries
export async function getAllTags() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(tags).orderBy(tags.name);
}

export async function getTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostsByTag(tagId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ post: posts })
    .from(posts)
    .innerJoin(postTags, eq(posts.id, postTags.postId))
    .where(and(eq(postTags.tagId, tagId), eq(posts.published, true)))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return result.map(r => r.post);
}

// Comments queries
export async function getPostComments(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(data: {
  postId: number;
  userId: number;
  content: string;
  parentCommentId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(comments).values(data);
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(comments).where(eq(comments.id, id));
}

// Reactions queries
export async function getPostReactions(postId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(reactions).where(eq(reactions.postId, postId));
}

export async function getUserReaction(userId: number, postId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(reactions)
    .where(and(eq(reactions.userId, userId), eq(reactions.postId, postId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function addReaction(data: {
  userId: number;
  postId: number;
  type: 'like' | 'heart' | 'fire';
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(reactions).values(data);
}

export async function removeReaction(userId: number, postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(reactions).where(and(eq(reactions.userId, userId), eq(reactions.postId, postId)));
}

// Saved posts queries
export async function getUserSavedPosts(userId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ post: posts })
    .from(savedPosts)
    .innerJoin(posts, eq(savedPosts.postId, posts.id))
    .where(eq(savedPosts.userId, userId))
    .orderBy(desc(savedPosts.createdAt))
    .limit(limit)
    .offset(offset);

  return result.map(r => r.post);
}

export async function isSaved(userId: number, postId: number) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(savedPosts)
    .where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId)))
    .limit(1);

  return result.length > 0;
}

export async function savePost(userId: number, postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(savedPosts).values({ userId, postId });
}

export async function unsavePost(userId: number, postId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(savedPosts).where(and(eq(savedPosts.userId, userId), eq(savedPosts.postId, postId)));
}
