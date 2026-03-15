"use client";

import { createContext, useContext, useMemo, useState } from "react";

type SidebarContextValue = {
  renamingListId: string | null;
  setRenamingListId: (id: string | null) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarStateProvider({ children }: { children: React.ReactNode }) {
  const [renamingListId, setRenamingListId] = useState<string | null>(null);
  const value = useMemo(() => ({ renamingListId, setRenamingListId }), [renamingListId]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarState(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebarState must be used within SidebarStateProvider");
  return ctx;
}
