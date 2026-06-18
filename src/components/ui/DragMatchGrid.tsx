"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  animate,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const MAX_CONTAINER_WIDTH = 4800;
const PADDING = 20;


interface CardData {
  targetImg?: string;
  dragImg?: string;
  imgSizePercent?: number;
  media?: string;
}

interface DragMatchGridProps {
  cards?: CardData[];
  cardBg?: string;
  borderColor?: string;
  borderWidth?: number;
}

export function DragMatchGrid({
  cards = [],
  cardBg = "var(--background)",
  borderColor = "var(--border)",
  borderWidth = 2,
}: DragMatchGridProps) {
  return (
    <div
      className="w-full mx-auto border-t border-dashed border-border"
      style={{ maxWidth: MAX_CONTAINER_WIDTH }}
      onMouseEnter={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: "DRAG AND DROP" } }))}
      onMouseLeave={() => window.dispatchEvent(new CustomEvent("cursor-pill", { detail: { text: null } }))}
    >
      <div className="drag-match-grid">
        {cards.map((card, index) => (
          <DraggableCard
            key={index}
            index={index}
            targetImg={card.targetImg}
            dragImg={card.dragImg}
            media={card.media}
            imgSizePercent={card.imgSizePercent ?? 30}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth={borderWidth}
          />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({
  index,
  targetImg,
  dragImg,
  media,
  bg,
  borderColor,
  borderWidth,
  imgSizePercent,
}: {
  index: number;
  targetImg?: string;
  dragImg?: string;
  media?: string;
  bg: string;
  borderColor: string;
  borderWidth: number;
  imgSizePercent: number;
}) {
  const [isMatched, setIsMatched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLg, setIsLg] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);

  // Mobile: track when the card scrolls from bottom of screen into center
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center center"],
  });

  // 0 = just entering screen (y=200 / pushed down), 1 = centered (y=0)
  const mobileScrollY = useTransform(scrollYProgress, [0, 1], [200, 0]);

  // Latch: once scrolled to center, stay matched — never reset on mobile
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isMobile) return;
    if (latest >= 0.99 && !isMatched) setIsMatched(true);
  });

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLg(window.innerWidth >= 1024);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const dropToBottom = () => {
    if (!containerRef.current || !dragRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const dragRect = dragRef.current.getBoundingClientRect();
    // If layout not ready yet, retry next frame
    if (containerRect.height === 0 || dragRect.height === 0) {
      requestAnimationFrame(dropToBottom);
      return;
    }
    const targetY = containerRect.height / 2 - dragRect.height / 2 - PADDING;
    const randomRotation = (Math.random() - 0.5) * 20;
    animate(y, targetY, { type: "spring", stiffness: 200, damping: 15 });
    animate(rotate, randomRotation, { type: "spring", stiffness: 150, damping: 10 });
  };

  useEffect(() => {
    if (isMobile) return;
    requestAnimationFrame(dropToBottom);
    window.addEventListener("resize", dropToBottom);
    return () => window.removeEventListener("resize", dropToBottom);
  }, [imgSizePercent, isMobile]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, _info: { offset: { x: number; y: number } }) => {
    if (isMobile) return;
    setIsDragging(false);
    if (dragRef.current && targetRef.current) {
      const dragRect = dragRef.current.getBoundingClientRect();
      const targetRect = targetRef.current.getBoundingClientRect();
      const tolerance = 0.5;
      const tCenterX = targetRect.left + targetRect.width / 2;
      const tCenterY = targetRect.top + targetRect.height / 2;
      const isOverlapping = !(
        dragRect.right < tCenterX - (targetRect.width * tolerance) / 2 ||
        dragRect.left > tCenterX + (targetRect.width * tolerance) / 2 ||
        dragRect.bottom < tCenterY - (targetRect.height * tolerance) / 2 ||
        dragRect.top > tCenterY + (targetRect.height * tolerance) / 2
      );
      if (isOverlapping) {
        setIsMatched(true);
        const dragCenterX = dragRect.left + dragRect.width / 2;
        const dragCenterY = dragRect.top + dragRect.height / 2;
        animate(x, x.get() + (tCenterX - dragCenterX), { type: "spring", stiffness: 400, damping: 25 });
        animate(y, y.get() + (tCenterY - dragCenterY), { type: "spring", stiffness: 400, damping: 25 });
        animate(rotate, 0, { duration: 0.2 });
        return;
      }
    }
    setIsMatched(false);
    dropToBottom();
  };

  const targetStyle: React.CSSProperties = isMobile
    ? { position: "absolute", inset: 0, margin: "auto", zIndex: 1, opacity: isMatched ? 0 : 1, transition: "opacity 0.2s", width: `${imgSizePercent}%`, height: "fit-content" }
    : { position: "absolute", top: `${PADDING}px`, right: `${PADDING}px`, zIndex: 1, opacity: isMatched ? 0 : 1, transition: "opacity 0.2s", width: `${imgSizePercent}%`, height: "auto" };

  const mobileDragStyle = {
    position: "absolute" as const,
    inset: 0,
    margin: "auto",
    zIndex: 10,
    width: `${imgSizePercent}%`,
    height: "fit-content",
    y: isMatched ? 0 : mobileScrollY,
    x: 0,
    rotate: 0,
    cursor: "default",
    // pan-y allows vertical scroll to pass through on mobile
    touchAction: "pan-y" as const,
  };

  const desktopDragStyle = {
    x,
    y,
    rotate,
    zIndex: 10,
    cursor: "grab",
    touchAction: "none" as const,
    width: `${imgSizePercent}%`,
    position: "relative" as const,
  };

  void isDragging;

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "auto",
        aspectRatio: "1 / 1",
        backgroundColor: bg,
        borderRight: ((index + 1) % (isLg ? 3 : 2) === 0) ? "none" : `${borderWidth}px dashed ${borderColor}`,
        borderBottom: `${borderWidth}px dashed ${borderColor}`,
        boxSizing: "border-box",
        borderRadius: "0px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      <motion.div
        initial={false}
        animate={{ opacity: isMatched ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute", inset: 0, zIndex: isMatched ? 5 : 0, backgroundColor: bg }}
      >
        {media && (
          <img src={media} className="w-full h-full object-cover" draggable={false} alt="" />
        )}
      </motion.div>

      <div ref={targetRef} style={targetStyle}>
        {targetImg && (
          <img src={targetImg} className="w-full block" draggable={false} alt="" />
        )}
      </div>

      <motion.div
        ref={dragRef}
        drag={!isMobile}
        dragConstraints={containerRef}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => { if (isMobile) return; setIsMatched(false); setIsDragging(true); }}
        onDragEnd={handleDragEnd}
        style={isMobile ? mobileDragStyle : desktopDragStyle}
        whileTap={!isMobile ? { scale: 1.1 } : {}}
      >
        {dragImg && (
          <img src={dragImg} className="w-full block" draggable={false} alt="" />
        )}
      </motion.div>
    </div>
  );
}
