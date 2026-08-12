import { BracketsCurly, Database, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import type { BlogPost } from "@/lib/blog-data";

const visualConfig = {
  blueprint: { label: "API / contract", icon: BracketsCurly, accent: "#2563eb" },
  signal: { label: "AUTH / session", icon: ShieldCheck, accent: "#0f766e" },
  ledger: { label: "CMS / workflow", icon: Database, accent: "#b45309" },
} as const;

export default function BlogVisual({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  const config = visualConfig[post.visual];
  const Icon = config.icon;
  return <div className={`blog-visual blog-visual-${post.visual} ${compact ? "blog-visual-compact" : ""}`} style={{ "--blog-accent": config.accent } as React.CSSProperties} aria-hidden="true">
    <div className="blog-visual-grid" />
    <div className="blog-visual-top"><span className="font-mono text-[9px] uppercase tracking-[.18em]">{config.label}</span><Icon size={18} weight="duotone" /></div>
    <div className="blog-visual-core"><span className="blog-visual-number">0{post.id.slice(-1)}</span><div className="blog-visual-lines"><i /><i /><i /><i /></div></div>
    <div className="blog-visual-footer"><span>KEITH / NOTES</span><span>2026</span></div>
  </div>;
}
