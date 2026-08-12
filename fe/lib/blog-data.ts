export type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

export type BlogSection = {
  heading?: string;
  paragraphs: string[];
  code?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: BlogSection[];
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  tags: BlogTag[];
  readTime: string;
  visual: "blueprint" | "signal" | "ledger";
};
