import { useEffect, useRef } from "react";

export function useOnceWhen(condition: boolean, effect: () => void) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && condition) {
      hasRun.current = true;
      effect();
    }
  }, [condition, effect]);
}
