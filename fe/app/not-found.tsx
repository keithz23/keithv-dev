import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-2xl border-t border-zinc-900 pt-8 dark:border-zinc-100">
        <p className="section-index">404 / Route not found</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-[-.055em] text-zinc-950 sm:text-7xl dark:text-zinc-50">
          This path leads nowhere useful.
        </h1>
        <p className="mt-6 max-w-lg leading-7 text-zinc-600 dark:text-zinc-400">
          The page may have moved, or the address may be incomplete. The
          portfolio is still where you left it.
        </p>
        <Link href="/" className="button-primary mt-9 w-fit">
          <ArrowLeft size={17} weight="regular" /> Return home
        </Link>
      </div>
    </main>
  );
}
