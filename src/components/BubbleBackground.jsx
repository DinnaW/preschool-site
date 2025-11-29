import React, { useEffect, useRef } from "react";
import "./BubbleBackground.css";

const BubbleBackground = ({ interactive = false, className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!interactive) return;
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / 40; // smaller = slower
      const dy = (e.clientY - cy) / 40;

      el.style.setProperty("--bubble-tilt-x", `${-dx}px`);
      el.style.setProperty("--bubble-tilt-y", `${-dy}px`);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      className={`bubble-bg ${className}`}
      data-interactive={interactive ? "true" : "false"}
    >
      {/* pastel floating bubbles */}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />
      <div className="bubble bubble-5" />
    </div>
  );
};

export default BubbleBackground;
