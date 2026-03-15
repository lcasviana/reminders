"use client";

import { useState } from "react";

export function useInlineAdd(onCreate: (value: string) => void) {
  const [isAdding, setIsAdding] = useState(false);
  const [value, setValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      onCreate(value.trim());
      setValue("");
    } else if (e.key === "Escape") {
      setValue("");
      setIsAdding(false);
    }
  }

  function handleBlur() {
    if (!value.trim()) setIsAdding(false);
  }

  return { isAdding, setIsAdding, value, setValue, handleKeyDown, handleBlur };
}
