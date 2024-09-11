import React from "react";

const useMousePinchAndScrollGesture = (
  cursorHovered: boolean,
  onZoomIn: () => void,
  onZoomOut: () => void
) => {
  React.useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (!cursorHovered) return;

      if (event.ctrlKey) {
        // Handle pinch gesture
        if (event.deltaY < 0) {
          onZoomIn();
        } else {
          onZoomOut();
        }
      } else {
        // Handle scroll gesture
        if (event.deltaY > 0) {
          onZoomOut();
        } else if (event.deltaY < 0) {
          onZoomIn();
        }
      }
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [cursorHovered, onZoomIn, onZoomOut]);

  return null;
};

export default useMousePinchAndScrollGesture;