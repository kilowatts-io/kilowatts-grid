import React from "react";

export const useScrollGestureWeb = (
    cursorHovered: boolean,
    onZoomIn: () => void,
    onZoomOut: () => void
  ) => {
    const handleScroll = (event: WheelEvent) => {
      if (!cursorHovered) return;
      if (event.deltaY > 0) {
        onZoomOut();
      } else if (event.deltaY < 0) {
        onZoomIn();
      }
    };
  
    React.useEffect(() => {
      // if not on web, return
      if (typeof window === "undefined") return;
      window.addEventListener("wheel", handleScroll);
      return () => {
        window.removeEventListener("wheel", handleScroll);
      };
    }, []);
  };