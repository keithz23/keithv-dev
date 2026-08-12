import type { Metadata } from "next";
import BlogPostClient from "./blog-post-client";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return { title: `${title} — Keith Vuong` };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostClient slug={slug} />;
}
