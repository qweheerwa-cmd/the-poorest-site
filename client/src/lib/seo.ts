/**
 * SEO 配置和元标签生成工具
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article" | "profile";
}

/**
 * 生成 HTML 元标签
 */
export function generateMetaTags(config: SEOConfig): Record<string, string> {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords?.join(", ") || "",
    "og:title": config.title,
    "og:description": config.description,
    "og:type": config.type || "website",
    ...(config.image && { "og:image": config.image }),
    ...(config.url && { "og:url": config.url }),
    "twitter:card": "summary_large_image",
    "twitter:title": config.title,
    "twitter:description": config.description,
    ...(config.image && { "twitter:image": config.image }),
  };
}

/**
 * 网站默认 SEO 配置
 */
export const DEFAULT_SEO: SEOConfig = {
  title: "全网最穷站 - 穷人互助社区，分享失败经历，一起搞钱",
  description:
    "全网最穷站是一个为穷人打造的互助社区。在这里，我们聚集了一群在贫困线上挣扎的勇士，分享失败经历，交流搞钱路子，一起抱团取暖。这里没有财富，只有共鸣。",
  keywords: [
    "穷人互助",
    "失败经历",
    "搞钱方法",
    "社区",
    "分享",
    "穷籍等级",
    "记账本",
    "排行榜",
  ],
  type: "website",
};

/**
 * 帖子页面 SEO 配置
 */
export function getPostSEO(post: {
  title: string;
  content: string;
  category: string;
  author?: string;
}): SEOConfig {
  const description = post.content.substring(0, 160);
  return {
    title: `${post.title} - 全网最穷站`,
    description,
    keywords: [post.category, "穷人", "分享", "失败", "搞钱"],
    type: "article",
  };
}

/**
 * 分类页面 SEO 配置
 */
export function getCategorySEO(category: string): SEOConfig {
  const categoryNames: Record<string, string> = {
    失败博物馆: "失败经历分享 - 全网最穷站",
    搞钱路子: "搞钱方法分享 - 全网最穷站",
    穷人日常: "穷人日常分享 - 全网最穷站",
  };

  const categoryDescriptions: Record<string, string> = {
    失败博物馆: "分享创业失败、投资失败、职场受挫等各种失败经历，一起学习失败的教训。",
    搞钱路子: "分享副业、兼职、创业等各种搞钱方法，帮助穷人增加收入。",
    穷人日常: "分享穷人的日常生活、省钱技巧、生活小妙招等内容。",
  };

  return {
    title: categoryNames[category] || `${category} - 全网最穷站`,
    description:
      categoryDescriptions[category] ||
      `浏览全网最穷站的${category}分类，分享穷人的故事和经验。`,
    keywords: [category, "穷人", "分享", "社区"],
    type: "website",
  };
}

/**
 * 用户页面 SEO 配置
 */
export function getUserSEO(user: { name: string; bio?: string }): SEOConfig {
  return {
    title: `${user.name}的个人主页 - 全网最穷站`,
    description: user.bio || `${user.name}在全网最穷站的个人主页`,
    keywords: ["用户", "个人主页", "穷籍等级"],
    type: "profile",
  };
}

/**
 * 更新页面 meta 标签
 */
export function updatePageMeta(config: SEOConfig): void {
  // 更新 title
  document.title = config.title;

  // 更新或创建 meta 标签
  const metaTags = generateMetaTags(config);
  Object.entries(metaTags).forEach(([name, content]) => {
    if (!content) return;

    const isOgTag = name.startsWith("og:") || name.startsWith("twitter:");
    const selector = isOgTag
      ? `meta[property="${name}"], meta[name="${name}"]`
      : `meta[name="${name}"]`;

    let meta = document.querySelector(selector) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement("meta");
      if (isOgTag) {
        meta.setAttribute("property", name);
      } else {
        meta.setAttribute("name", name);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", content);
  });
}
