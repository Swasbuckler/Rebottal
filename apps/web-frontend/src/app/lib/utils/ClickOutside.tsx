import { RefObject, useEffect } from "react";

export default function ClickOutside({
  clickRef,
  onClickOutside,
  children
}: {
  clickRef: RefObject<HTMLDivElement | null>,
  onClickOutside: () => void,
  children: React.ReactNode
}) {

  const handleClick = (event: MouseEvent | TouchEvent) => {
    if (clickRef.current!.contains(event.target as Node)) {
      return;
    } else {
      onClickOutside();
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}