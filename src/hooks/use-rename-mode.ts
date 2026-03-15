"use client";

import { useLayoutEffect, useRef, useState } from "react";

export function useRenameMode(currentName: string, isRenaming: boolean, onCommit: (name: string) => void, onCancel: () => void) {
  const [draft, setDraft] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  function startRename() {
    setDraft(currentName);
  }

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== currentName) onCommit(trimmed);
    onCancel();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commit();
    else if (e.key === "Escape") onCancel();
  }

  return { draft, setDraft, inputRef, startRename, commit, handleKeyDown };
}
