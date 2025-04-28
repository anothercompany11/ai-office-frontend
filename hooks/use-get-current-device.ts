import { useEffect, useState } from "react";

// 브라우저 width 측정 훅
export const useGetCurrentDevice = () => {
  const [width, setWidth] = useState<undefined | number>(undefined);

  useEffect(() => {
    if (window === undefined) {
      return undefined;
    }
    // width resize 핸들러
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!width) return null;

  if (width < 600) {
    return "mob";
  } else if (width < 1025) {
    return "tab";
  } else return "web";
};
