import { useEffect } from "react";

export const useModalBlur = (isOpen: boolean) => {
  useEffect(() => {
    const existingModals = document.querySelectorAll(".modal-container");
    const shouldApplyBlur = isOpen && existingModals.length <= 1;

    if (shouldApplyBlur) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      const mainContent = document.querySelector("main");

      if (mainContent) {
        mainContent.style.filter = "blur(4px)";
        mainContent.style.pointerEvents = "none";
        mainContent.style.transition =
          "filter 0.3s ease, pointer-events 0.3s ease";
        mainContent.style.position = "relative";
        mainContent.style.zIndex = "1";
      }
    } else if (!isOpen) {
      const remainingModals = document.querySelectorAll(".modal-container");

      if (remainingModals.length === 0) {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
        document.body.style.position = "";
        document.body.style.width = "";

        const mainContent = document.querySelector("main");

        if (mainContent) {
          mainContent.style.filter = "none";
          mainContent.style.pointerEvents = "auto";
          mainContent.style.position = "";
          mainContent.style.zIndex = "";
        }
      }
    }

    return () => {
      const remainingModals = document.querySelectorAll(".modal-container");
      if (remainingModals.length === 0) {
        document.body.style.overflow = "unset";
        document.documentElement.style.overflow = "unset";
        document.body.style.position = "";
        document.body.style.width = "";

        const mainContent = document.querySelector("main");
        if (mainContent) {
          mainContent.style.filter = "none";
          mainContent.style.pointerEvents = "auto";
          mainContent.style.position = "";
          mainContent.style.zIndex = "";
        }
      }
    };
  }, [isOpen]);
};
