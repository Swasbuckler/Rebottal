import { ScrollSmoother } from "gsap/all";
import { RefObject, useEffect, useState } from "react";

export default function ScrollToTop({
  smoother
}: {
  smoother?: RefObject<ScrollSmoother | null>
}) {

  const [hidden, setHidden] = useState(false);

  const checkScrollFromTop = () => {
    if (window.scrollY > 20) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', checkScrollFromTop);

    return () => {
      window.removeEventListener('scroll', checkScrollFromTop);
    }
  }, []);
  
  return (
    <button
      className={`fixed bottom-5 right-5 ${hidden ? 'hidden' : ''} justify-center items-center size-10 bg-[#ededed] dark:bg-[#0a0a0a] text-xl border-2 border-gray-500 hover:[&>span:nth-child(1)]:-top-full hover:[&>span:nth-child(2)]:top-0 hover:border-cyan-500 rounded-full cursor-pointer transition-all ease-in-out duration-300 overflow-hidden z-99`}
      type="button"
      onClick={() => {
        if (smoother) {
          smoother.current?.scrollTo(0, true);
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }}
    >
      <span className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-0.5 transition-all ease-in-out duration-400">↑</span>
      <span className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-0.5 transition-all ease-in-out duration-400">↑</span>
    </button>
  );
}