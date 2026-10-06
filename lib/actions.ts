"use server";

import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function verifyAuth() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized! You are not the admin 🌸");
}

// --- 1. ADMIN AUTH (Legacy - Kept for fallback, but NextAuth handles actual login) ---
export async function checkAdmin(formData: FormData) {
  // Not strictly used anymore since NextAuth handles it directly
  return { success: false };
}

// --- 2. BLOG MANAGER (3 LANGUAGES) ---
export async function createPost(formData: FormData) {
  await verifyAuth();
  const data = {
    titleVi: (formData.get("titleVi") as string) || "",
    titleEn: (formData.get("titleEn") as string) || "",
    titleJp: (formData.get("titleJp") as string) || "",
    contentVi: (formData.get("contentVi") as string) || "",
    contentEn: (formData.get("contentEn") as string) || "",
    contentJp: (formData.get("contentJp") as string) || "",
    tag: (formData.get("tag") as string) || "general",
    images: (formData.get("images") as string) || "[]",
  };

  try {
    await prisma.post.create({ data });
    revalidatePath("/");
  } catch (error) {
    console.error("Create error:", error);
  }
}

export async function updatePost(formData: FormData) {
  await verifyAuth();
  const id = formData.get("id") as string;
  const data = {
    titleVi: (formData.get("titleVi") as string) || "",
    titleEn: (formData.get("titleEn") as string) || "",
    titleJp: (formData.get("titleJp") as string) || "",
    contentVi: (formData.get("contentVi") as string) || "",
    contentEn: (formData.get("contentEn") as string) || "",
    contentJp: (formData.get("contentJp") as string) || "",
    tag: (formData.get("tag") as string) || "general",
    images: (formData.get("images") as string) || "[]",
  };

  try {
    await prisma.post.update({ where: { id }, data });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false };
  }
}

export async function deletePost(id: string) {
  await verifyAuth();
  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
}

export async function getAllPosts() {
  try {
    return await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function getPostsByTag(tag: string) {
  try {
    return await prisma.post.findMany({
      where: { tag },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

// --- 3. SECTION CONTENT MANAGER ---
export async function getSectionContent(key: string) {
  try {
    return await prisma.pageSection.findUnique({ where: { sectionKey: key } });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function saveSectionContent(formData: FormData) {
  await verifyAuth();
  const sectionKey = formData.get("sectionKey") as string;
  const contentEn = formData.get("contentEn") as string;
  const contentVi = formData.get("contentVi") as string;
  const contentJp = formData.get("contentJp") as string;

  try {
    await prisma.pageSection.upsert({
      where: { sectionKey: sectionKey },
      update: { contentEn, contentVi, contentJp },
      create: { sectionKey, contentEn, contentVi, contentJp },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

// --- 4. ANALYTICS (TRACKING) ---
export async function trackVisit(lang: string, userAgent: string) {
  try {
    await prisma.visit.create({
      data: {
        lang: lang,
        userAgent: userAgent,
      }
    });
  } catch (error) {
    console.error("Tracking error:", error);
  }
}

export async function getAnalyticsData() {
  await verifyAuth(); // Analytics is sensitive
  try {
    const visits = await prisma.visit.findMany({
      orderBy: { createdAt: "desc" },
      take: 1000,
    });
    const chatLogs = await prisma.chatLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    
    return { visits, chatLogs };
  } catch (error) {
    console.error("Fetch analytics error:", error);
    return { visits: [], chatLogs: [] };
  }
}

export async function addChatLog(mode: string, message: string, response: string) {
  try {
    await prisma.chatLog.create({
      data: {
        mode,
        message,
        response,
      }
    });
  } catch (error) {
    console.error("Chat log error:", error);
  }
}

// --- 5. GUESTBOOK (EMA BOARD) ---
export async function getGuestbookEntries() {
  try {
    return await prisma.guestbook.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (error) {
    console.error("Guestbook fetch error:", error);
    return [];
  }
}

export async function addGuestbookEntry(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const icon = formData.get("icon") as string;
  const row = parseInt(formData.get("row") as string) || 0;
  const col = parseInt(formData.get("col") as string) || 0;

  if (!name || !message || !icon) return { success: false };

  try {
    await prisma.guestbook.create({
      data: { name, message, icon, row, col }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Guestbook add error:", error);
    return { success: false };
  }
}

// --- 6. OPTIMIZED BULK FETCH ---
export async function getHomePageData() {
  try {
    const [allPosts, pageSections] = await Promise.all([
      prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.pageSection.findMany()
    ]);
    
    const dynamicSections = pageSections.reduce((acc, section) => {
      acc[section.sectionKey] = section;
      return acc;
    }, {} as Record<string, any>);

    return {
      dbUniProjects: allPosts.filter(p => p.tag === "uni_projects"),
      dbPersonalProjects: allPosts.filter(p => p.tag === "personal_projects"),
      dbItEvents: allPosts.filter(p => p.tag === "it_events"),
      dbOtherEvents: allPosts.filter(p => p.tag === "other_events"),
      dbLangCerts: allPosts.filter(p => p.tag === "lang_certs"),
      dbTechCerts: allPosts.filter(p => p.tag === "tech_certs"),
      dbOtherCerts: allPosts.filter(p => p.tag === "other_certs"),
      dbAchievements: allPosts.filter(p => p.tag === "achievements"),
      latestPosts: allPosts.slice(0, 3),
      dynamicSections,
    };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return null;
  }
}

