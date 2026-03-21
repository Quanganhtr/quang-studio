"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useInView,
  animate,
} from "framer-motion";

const MAX_CONTAINER_WIDTH = 4800;
const CARD_GAP = 8;
const PADDING = 20;

const CornerTicks = ({
  color = "white",
  length = 16,
  weight = 1,
}: {
  color?: string;
  length?: number;
  weight?: number;
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    width: length,
    height: length,
    borderColor: color,
    borderStyle: "solid",
    pointerEvents: "none",
    zIndex: 3,
  };

  return (
    <>
      <div style={{ ...style, top: 0, left: 0, borderRight: "0", borderBottom: "0", borderWidth: weight }} />
      <div style={{ ...style, top: 0, right: 0, borderLeft: "0", borderBottom: "0", borderWidth: weight }} />
      <div style={{ ...style, bottom: 0, left: 0, borderRight: "0", borderTop: "0", borderWidth: weight }} />
      <div style={{ ...style, bottom: 0, right: 0, borderLeft: "0", borderTop: "0", borderWidth: weight }} />
    </>
  );
};

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
  tickerColor?: string;
  tickerLength?: number;
  tickerWeight?: number;
}

export function DragMatchGrid({
  cards = [],
  cardBg = "#000000",
  borderColor = "#333333",
  borderWidth = 1,
  tickerColor = "#FFFFFF",
  tickerLength = 16,
  tickerWeight = 1,
}: DragMatchGridProps) {
  const gridClass = "drag-match-grid";

  return (
    <div style={{ width: "100%", maxWidth: `${MAX_CONTAINER_WIDTH}px`, margin: "0 auto" }}>
      <style>{`
        .${gridClass} { display: grid; gap: ${CARD_GAP}px; width: 100%; }
        @media (max-width: 767px) { .${gridClass} { grid-template-columns: 1fr; } }
        @media (min-width: 768px) and (max-width: 1199px) { .${gridClass} { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1200px) { .${gridClass} { grid-template-columns: repeat(3, 1fr); } }
      `}</style>
      <div className={gridClass}>
        {cards.map((card, index) => (
          <DraggableCard
            key={index}
            targetImg={card.targetImg}
            dragImg={card.dragImg}
            media={card.media}
            imgSizePercent={card.imgSizePercent ?? 30}
            bg={cardBg}
            borderColor={borderColor}
            borderWidth={borderWidth}
            tickerColor={tickerColor}
            tickerLength={tickerLength}
            tickerWeight={tickerWeight}
          />
        ))}
      </div>
    </div>
  );
}

function DraggableCard({
  targetImg,
  dragImg,
  media,
  bg,
  borderColor,
  borderWidth,
  imgSizePercent,
  tickerColor,
  tickerLength,
  tickerWeight,
}: {
  targetImg?: string;
  dragImg?: string;
  media?: string;
  bg: string;
  borderColor: string;
  borderWidth: number;
  imgSizePercent: number;
  tickerColor: string;
  tickerLength: number;
  tickerWeight: number;
}) {
  const [isMatched, setIsMatched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);

  // Watch the card container entering the viewport (works on Safari)
  const inView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(() => dropToBottom(), 300);
    window.addEventListener("resize", dropToBottom);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", dropToBottom);
    };
  }, [imgSizePercent, isMobile]);

  const dropToBottom = () => {
    if (isMobile) return;
    if (!containerRef.current || !dragRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const dragRect = dragRef.current.getBoundingClientRect();
    const targetY = containerRect.height / 2 - dragRect.height / 2 - PADDING;
    const randomRotation = (Math.random() - 0.5) * 20;
    animate(y, targetY, { type: "spring", stiffness: 200, damping: 15 });
    animate(rotate, randomRotation, { type: "spring", stiffness: 150, damping: 10 });
  };

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

  const mobileDragStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    margin: "auto",
    zIndex: 10,
    width: `${imgSizePercent}%`,
    height: "fit-content",
    cursor: "default",
    pointerEvents: "none",
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

  // suppress unused warning
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
        border: `${borderWidth}px dashed ${borderColor}`,
        boxSizing: "border-box",
        borderRadius: "0px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CornerTicks length={tickerLength} color={tickerColor} weight={tickerWeight} />

      <motion.div
        initial={false}
        animate={{ opacity: isMatched ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ position: "absolute", inset: 0, zIndex: isMatched ? 5 : 0, backgroundColor: bg }}
      >
        {media && (
          <img src={media} style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} alt="" />
        )}
      </motion.div>

      <div ref={targetRef} style={targetStyle}>
        {targetImg && (
          <img src={targetImg} style={{ width: "100%", display: "block" }} draggable={false} alt="" />
        )}
      </div>

      {isMobile ? (
        <motion.div
          ref={dragRef}
          initial={{ y: 200 }}
          animate={{ y: inView ? 0 : 200 }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          onAnimationComplete={() => { if (inView) setIsMatched(true); }}
          style={mobileDragStyle}
        >
          {dragImg && <img src={dragImg} style={{ width: "100%", display: "block" }} draggable={false} alt="" />}
        </motion.div>
      ) : (
        <motion.div
          ref={dragRef}
          drag
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => { setIsMatched(false); setIsDragging(true); }}
          onDragEnd={handleDragEnd}
          style={desktopDragStyle}
          whileTap={{ scale: 1.1 }}
        >
          {dragImg && <img src={dragImg} style={{ width: "100%", display: "block" }} draggable={false} alt="" />}
        </motion.div>
      )}
    </div>
  );
}
