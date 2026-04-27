import Link from "next/link";
import { Bot, ClipboardList, HeartHandshake, LayoutDashboard, Map, Rocket, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { MissionModeToggle } from "@/components/mission-mode";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/data-hub", label: "Data Hub", icon: ClipboardList },
  { href: "/prioritization", label: "AI Priority", icon: Sparkles },
  { href: "/volunteers", label: "Volunteers", icon: UsersRound },
  { href: "/maps", label: "Maps", icon: Map },
  { href: "/impact", label: "Impact", icon: HeartHandshake },
  { href: "/assistant", label: "Assistant", icon: Bot },
  { href: "/deployment", label: "Deploy", icon: Rocket }
];

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-ink/15 bg-[#fbfaf6]/94 px-3 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-ink bg-ink text-white shadow-soft">
            <ShieldCheck size={22} />
          </span>
          <span>
            <span className="block text-base font-semibold leading-5">SevaSync</span>
            <span className="block text-xs text-ink/55">AI social impact OS</span>
          </span>
        </Link>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="app-scrollbar flex gap-1 overflow-x-auto border border-ink/15 bg-white/80 p-1 shadow-sm">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex shrink-0 items-center gap-2 border border-transparent px-3 py-2 text-sm font-semibold text-ink/68 transition hover:border-ink hover:bg-ink hover:text-white"
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:flex">
            <MissionModeToggle compact />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
