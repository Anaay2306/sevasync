import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="mx-auto max-w-7xl px-4 pb-5 pt-8 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-leaf">{eyebrow}</p>
      <h1 className="headline mt-2 max-w-4xl text-4xl font-semibold tracking-normal sm:text-6xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-ink/65 sm:text-base">{children}</p>
    </header>
  );
}
