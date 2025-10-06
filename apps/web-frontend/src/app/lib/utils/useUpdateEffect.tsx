import { useEffect, useRef } from "react";

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useRef(false);

  useEffect(() => {
    isFirstMount.current = true;
  }, [])

  useEffect(() => {
    if (!isFirstMount.current) return effect();
    else isFirstMount.current = false;
  }, deps);
};