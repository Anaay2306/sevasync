import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Card({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={clsx("glass p-4 shadow-soft sm:p-5", className)}>{children}</section>;
}

export function Metric({
  label,
  value,
  trend,
  tone = "leaf"
}: {
  label: string;
  value: string | number;
  trend: string;
  tone?: "leaf" | "river" | "saffron" | "rose";
}) {
  const colors = {
    leaf: "text-leaf bg-leaf/10",
    river: "text-river bg-river/10",
    saffron: "text-saffron bg-saffron/10",
    rose: "text-rose bg-rose/10"
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-ink/60">{label}</p>
          <p className="headline mt-2 text-4xl font-semibold tracking-normal">{value}</p>
        </div>
        <span className={clsx("border border-current/20 px-2.5 py-1 text-xs font-semibold uppercase", colors[tone])}>{trend}</span>
      </div>
    </Card>
  );
}

export function Badge({ children, tone = "leaf" }: { children: ReactNode; tone?: "leaf" | "river" | "saffron" | "rose" }) {
  const colors = {
    leaf: "border-leaf/20 bg-leaf/10 text-leaf",
    river: "border-river/20 bg-river/10 text-river",
    saffron: "border-saffron/30 bg-saffron/10 text-saffron",
    rose: "border-rose/20 bg-rose/10 text-rose"
  };
  return <span className={clsx("border px-2.5 py-1 text-xs font-semibold uppercase", colors[tone])}>{children}</span>;
}
