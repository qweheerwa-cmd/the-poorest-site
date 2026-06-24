import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, posts, InsertPost, comments, InsertComment, likes, InsertLike, favorites, InsertFavorite, expenses, InsertExpense } from "../drizzle/schema";
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

// ============ Posts ============

export async function createPost(post: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(posts).values(post);
  
  // 查询最新插入的帖子（按 ID 倒序，取第一条）
  const result = await db.select().from(posts)
    .where(eq(posts.userId, post.userId))
    .orderBy(desc(posts.id))
    .limit(1);
  
  return result[0];
}

export async function getPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPostsByCategory(category: string, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(posts)
    .where(eq(posts.category, category as any))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
  return result;
}

export async function getPostsByUser(userId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
  return result;
}

// ============ Comments ============

export async function createComment(comment: InsertComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(comments).values(comment);
  const result = await db.select().from(comments)
    .where(eq(comments.userId, comment.userId))
    .orderBy(desc(comments.id))
    .limit(1);
  return result[0];
}

export async function getCommentsByPost(postId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
  return result;
}

// ============ Likes ============

export async function createLike(like: InsertLike) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(likes).values(like);
  const result = await db.select().from(likes)
    .where(eq(likes.userId, like.userId))
    .orderBy(desc(likes.id))
    .limit(1);
  return result[0];
}

// ============ Favorites ============

export async function createFavorite(favorite: InsertFavorite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(favorites).values(favorite);
  const result = await db.select().from(favorites)
    .where(eq(favorites.userId, favorite.userId))
    .orderBy(desc(favorites.id))
    .limit(1);
  return result[0];
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));
  return result;
}

// ============ Expenses ============

export async function createExpense(expense: InsertExpense) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(expenses).values(expense);
  const result = await db.select().from(expenses)
    .where(eq(expenses.userId, expense.userId))
    .orderBy(desc(expenses.id))
    .limit(1);
  return result[0];
}

export async function getExpensesByUser(userId: number, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(desc(expenses.date))
    .limit(limit);
  return result;
}


// === 内存缓存 ===
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getHotPosts(limit = 10) {
  const cacheKey = `hot_posts_${limit}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit);

  setCached(cacheKey, result);
  return result;
}

export async function toggleLike(userId: number, postId: number) {
  const db = await getDb();
  if (!db) return false;

  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(likes)
      .where(and(eq(likes.userId, userId), eq(likes.postId, postId)));
    return false;
  } else {
    await db.insert(likes).values({ userId, postId, createdAt: new Date() });
    return true;
  }
}

export async function toggleFavorite(userId: number, postId: number) {
  const db = await getDb();
  if (!db) return false;

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.postId, postId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.postId, postId)));
    return false;
  } else {
    await db.insert(favorites).values({ userId, postId, createdAt: new Date() });
    return true;
  }
}
