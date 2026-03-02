import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import type { PageHeaderProps } from "@/models";

/**
 * Syncs a detail view header with the parent (e.g. BasePage).
 * When detailsHeader is set, it becomes the current header; on unmount, resets to defaultHeader.
 */
export function useDetailPageHeader(
  detailsHeader: PageHeaderProps | null,
  defaultHeader: PageHeaderProps,
  setHeaderProps: Dispatch<SetStateAction<PageHeaderProps>>
): void {
  const defaultHeaderRef = useRef(defaultHeader);
  const setHeaderPropsRef = useRef(setHeaderProps);
  setHeaderPropsRef.current = setHeaderProps;

  useEffect(() => {
    if (detailsHeader) {
      setHeaderPropsRef.current(detailsHeader);
    }
  }, [detailsHeader]);

  useEffect(() => {
    const defaultHeader = defaultHeaderRef.current;
    return () => {
      setHeaderPropsRef.current(defaultHeader);
    };
  }, []);
}
