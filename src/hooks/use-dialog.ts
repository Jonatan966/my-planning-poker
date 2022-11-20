import { useState } from "react";

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  function openDialog() {
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
  }

  return { isOpen, openDialog, closeDialog };
}
