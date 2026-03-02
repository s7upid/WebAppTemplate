/** Smoothly scrolls the window to the top. Use after pagination/filter changes. */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
