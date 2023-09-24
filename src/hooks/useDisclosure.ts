"use client";
import { useCallback, useState } from "react";

export const useDisclosure = (_isOpen = false) => {
  const [isOpen, setIsOpen] = useState(_isOpen);

  const onClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    setIsOpen,
    onClose,
    onOpen
  };
};
