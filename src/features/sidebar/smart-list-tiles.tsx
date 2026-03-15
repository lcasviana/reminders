"use client";

import { useMemo } from "react";

import { Calendar03Icon, CheckListIcon, Clock01Icon, Flag01Icon, ListViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

import { useReminders } from "@/context/reminders-context";
import { cn } from "@/lib/utils";
import type { SmartList } from "@/schemas/smart-list.schema";

type TileConfig = {
  id: SmartList;
  label: string;
  icon: IconSvgElement;
  bg: string;
  fg: string;
  fullWidth?: boolean;
};

const TILES: TileConfig[] = [
  { id: "Today", label: "Today", icon: Calendar03Icon, bg: "bg-blue-500", fg: "text-white" },
  { id: "Scheduled", label: "Scheduled", icon: Clock01Icon, bg: "bg-red-500", fg: "text-white" },
  { id: "All", label: "All", icon: ListViewIcon, bg: "bg-gray-500", fg: "text-white" },
  { id: "Flagged", label: "Flagged", icon: Flag01Icon, bg: "bg-orange-500", fg: "text-white" },
  { id: "Completed", label: "Completed", icon: CheckListIcon, bg: "bg-gray-400 dark:bg-gray-600", fg: "text-white", fullWidth: true },
];

type SmartListTileProps = {
  tile: TileConfig;
  count: number;
  isActive: boolean;
  onSelect: (id: SmartList) => void;
};

function SmartListTile({ tile, count, isActive, onSelect }: SmartListTileProps) {
  const { fullWidth } = tile;
  return (
    <button
      onClick={() => onSelect(tile.id)}
      className={cn(
        "flex flex-col justify-between rounded-xl p-3 transition-opacity select-none",
        "ring-sidebar-ring outline-hidden focus-visible:ring-2",
        fullWidth ? "h-10 flex-row items-center gap-2" : "h-20",
        tile.bg,
        tile.fg,
        isActive && "opacity-80",
        !isActive && "hover:opacity-90",
      )}
    >
      <HugeiconsIcon icon={tile.icon} className={cn("size-5", fullWidth && "order-first")} strokeWidth={2} />
      <div className={cn("flex items-end justify-between gap-1", fullWidth && "flex-1 flex-row-reverse items-center")}>
        <span className="text-xs font-semibold">{tile.label}</span>
        {count > 0 && <span className="text-lg leading-none font-bold">{count}</span>}
      </div>
    </button>
  );
}

export function SmartListTiles() {
  const {
    selectedView,
    setSelectedView,
    getTodayReminders,
    getScheduledReminders,
    getIncompleteReminders,
    getFlaggedReminders,
    getCompletedReminders,
  } = useReminders();

  const counts = useMemo<Record<SmartList, number>>(
    () => ({
      Today: getTodayReminders().length,
      Scheduled: getScheduledReminders().length,
      All: getIncompleteReminders().length,
      Flagged: getFlaggedReminders().length,
      Completed: getCompletedReminders().length,
    }),
    [getTodayReminders, getScheduledReminders, getIncompleteReminders, getFlaggedReminders, getCompletedReminders],
  );

  const gridTiles = TILES.filter((t) => !t.fullWidth);
  const fullWidthTiles = TILES.filter((t) => t.fullWidth);

  return (
    <div className="flex flex-col gap-2 px-2 py-2">
      <div className="grid grid-cols-2 gap-2">
        {gridTiles.map((tile) => (
          <SmartListTile key={tile.id} tile={tile} count={counts[tile.id]} isActive={selectedView === tile.id} onSelect={setSelectedView} />
        ))}
      </div>
      {fullWidthTiles.map((tile) => (
        <SmartListTile key={tile.id} tile={tile} count={counts[tile.id]} isActive={selectedView === tile.id} onSelect={setSelectedView} />
      ))}
    </div>
  );
}
