"use client";

import { useState } from "react";

import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Reminder } from "@/schemas/reminder.schema";
import type { ReminderSection } from "@/schemas/section.schema";

import { ReminderRow } from "./reminder-row";

type Props = {
  section: ReminderSection;
  reminders: Reminder[];
};

export function SectionGroup({ section, reminders }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mt-2">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="text-muted-foreground hover:text-foreground flex items-center gap-1 px-4 py-1 text-xs font-semibold tracking-wide uppercase transition-colors"
      >
        <HugeiconsIcon icon={collapsed ? ArrowRight01Icon : ArrowDown01Icon} className="size-3" strokeWidth={2} />
        {section.name}
      </button>
      {!collapsed && reminders.map((r) => <ReminderRow key={r.id} reminder={r} />)}
    </div>
  );
}
