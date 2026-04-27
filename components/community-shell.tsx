"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { AudioLines, ClipboardList, House, LocateFixed, MapPinned, ShieldAlert, UserCog } from "lucide-react";
import { Badge } from "@/components/ui";
import {
  type CommunityRole,
  type CommunitySignal,
  type LocationNode,
  buildIssuesFromSignals,
  createSignal,
  filterByLocation,
  getAutoDetectedLocation,
  locationHierarchy,
  reliabilityBoard,
  roleLabelsMap,
  seededSignals
} from "@/lib/community-os";

type CommunityContextValue = {
  role: CommunityRole;
  setRole: (role: CommunityRole) => void;
  location: LocationNode;
  setLocationKey: (value: string) => void;
  signals: CommunitySignal[];
  addSignal: (text: string, source?: CommunitySignal["source"]) => void;
  selectedLocationKey: string;
};

const CommunityContext = createContext<CommunityContextValue | null>(null);

const roleOptions: Array<{ value: CommunityRole; icon: typeof UserCog }> = [
  { value: "citizen", icon: House },
  { value: "volunteer", icon: UserCog },
  { value: "ngo", icon: ClipboardList },
  { value: "authority", icon: ShieldAlert }
];

const coreNav = [
  { href: "/", label: "Home", icon: House },
  { href: "/report", label: "Report", icon: AudioLines },
  { href: "/issues", label: "Issues", icon: LocateFixed },
  { href: "/tasks", label: "Tasks", icon: MapPinned }
];

function keyForLocation(location: LocationNode) {
  return `${location.district}|${location.taluka}|${location.zone}`;
}

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<CommunityRole>("citizen");
  const [selectedLocationKey, setSelectedLocationKey] = useState(keyForLocation(getAutoDetectedLocation()));
  const [signals, setSignals] = useState<CommunitySignal[]>(seededSignals);

  useEffect(() => {
    const storedRole = window.localStorage.getItem("sevasync:community-role") as CommunityRole | null;
    const storedLocation = window.localStorage.getItem("sevasync:community-location");
    const storedSignals = window.localStorage.getItem("sevasync:community-signals");
    if (storedRole) setRole(storedRole);
    if (storedLocation) setSelectedLocationKey(storedLocation);
    if (storedSignals) {
      try {
        setSignals(JSON.parse(storedSignals));
      } catch {
        setSignals(seededSignals);
      }
    }
  }, []);

  const location = locationHierarchy.find((item) => keyForLocation(item) === selectedLocationKey) ?? getAutoDetectedLocation();

  const addSignal = (text: string, source: CommunitySignal["source"] = "text") => {
    const signal = createSignal(text, role, location, source);
    const next = [signal, ...signals];
    setSignals(next);
    window.localStorage.setItem("sevasync:community-signals", JSON.stringify(next));
  };

  const setRoleState = (next: CommunityRole) => {
    setRole(next);
    window.localStorage.setItem("sevasync:community-role", next);
  };

  const setLocationKey = (next: string) => {
    setSelectedLocationKey(next);
    window.localStorage.setItem("sevasync:community-location", next);
  };

  return (
    <CommunityContext.Provider value={{ role, setRole: setRoleState, location, setLocationKey, signals, addSignal, selectedLocationKey }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  const value = useContext(CommunityContext);
  if (!value) throw new Error("useCommunity must be used inside CommunityProvider");
  return value;
}

export function CommunityBar() {
  const { role, setRole, location, selectedLocationKey, setLocationKey, signals } = useCommunity();
  const activeSignals = filterByLocation(signals, location);
  const issues = filterByLocation(buildIssuesFromSignals(signals), location);

  return (
    <div className="sticky top-[73px] z-40 border-b border-ink/15 bg-white/90 backdrop-blur dark:bg-[#0d1714]/92">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/70">
            <Badge tone="river">{location.district}</Badge>
            <span>{location.taluka}</span>
            <span>/</span>
            <span className="font-semibold">{location.zone}</span>
            <span className="text-ink/45">Auto-detected area active</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-[auto_auto] lg:flex lg:items-center">
            <select
              value={selectedLocationKey}
              onChange={(event) => setLocationKey(event.target.value)}
              className="border border-ink/15 bg-white/80 px-3 py-2 text-sm text-ink dark:bg-[#11201c]"
            >
              {locationHierarchy.map((item) => (
                <option key={keyForLocation(item)} value={keyForLocation(item)}>
                  {item.district} / {item.taluka} / {item.zone}
                </option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const active = role === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`border px-3 py-2 text-xs font-semibold uppercase transition ${active ? "border-ink bg-ink text-white" : "border-ink/15 bg-white/80 text-ink/65 dark:bg-[#11201c]"}`}
                  >
                    <span className="flex items-center justify-center gap-2"><Icon size={14} /> {roleLabelsMap[option.value]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="app-scrollbar flex gap-2 overflow-x-auto">
          {coreNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="flex shrink-0 items-center gap-2 border border-ink/15 bg-white/80 px-3 py-2 text-sm font-semibold text-ink dark:bg-[#11201c]">
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
          <div className="ml-auto flex shrink-0 items-center gap-2 border border-ink/15 bg-field px-3 py-2 text-xs font-semibold uppercase text-ink/65 dark:bg-[#142621]">
            {activeSignals.length} signals
          </div>
          <div className="flex shrink-0 items-center gap-2 border border-ink/15 bg-field px-3 py-2 text-xs font-semibold uppercase text-ink/65 dark:bg-[#142621]">
            {issues.length} issues
          </div>
        </div>
      </div>
    </div>
  );
}

export const reliabilityByArea = reliabilityBoard;
