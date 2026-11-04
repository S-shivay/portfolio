"use client";;
import * as React from "react";
import { AnimatePresence, m } from "framer-motion";

/* Vengeance UI image-trail. One change from the registry: `motion.div` ->
   `m.div`. The site wraps everything in `LazyMotion strict` (MotionProvider),
   where a full `motion` component throws. */
import { cn } from "@/lib/utils";

const DEFAULT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1617643472854-39a9dcc34eee?auto=format&fit=crop&w=480&q=80",
    alt: "Abstract architectural detail",
  },
  {
    src: "https://images.unsplash.com/photo-1674914053928-3131b730916c?auto=format&fit=crop&w=480&q=80",
    alt: "Abstract sculptural form",
  },
  {
    src: "https://images.unsplash.com/photo-1549800076-831d7a97afac?auto=format&fit=crop&w=480&q=80",
    alt: "Textured abstract composition",
  },
  {
    src: "https://images.unsplash.com/photo-1730750374142-557f2417db3a?auto=format&fit=crop&w=480&q=80",
    alt: "Minimal abstract artwork",
  },
];

const DEFAULT_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 22,
};

const DEFAULT_EXIT_TRANSITION = {
  duration: 0.4,
  ease: "easeInOut",
};

const normalizeImage = image => typeof image === "string" ? { src: image, alt: "" } : image;

export function ImageTrail({
  images = DEFAULT_IMAGES,
  threshold = 80,
  minDelay = 50,
  duration = 1000,
  maxItems = 8,
  rotationRange = 40,
  imageClassName,
  overlayClassName,
  transition = DEFAULT_TRANSITION,
  exitTransition = DEFAULT_EXIT_TRANSITION,
  disabled = false,
  className,
  children,
  onPointerMove,
  onPointerLeave,
  ...props
}) {
  const [trail, setTrail] = React.useState([]);
  const lastPositionRef = React.useRef(null);
  const lastTimeRef = React.useRef(0);
  const imageIndexRef = React.useRef(0);
  const timeoutRefs = React.useRef(new Set());
  const normalizedImages = React.useMemo(() => images.map(normalizeImage), [images]);
  const safeThreshold = Math.max(0, threshold);
  const safeMinDelay = Math.max(0, minDelay);
  const safeDuration = Math.max(0, duration);
  const safeMaxItems = Math.max(0, Math.floor(maxItems));
  const safeRotationRange = Math.max(0, rotationRange);

  React.useEffect(() => {
    const timeouts = timeoutRefs.current;

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
      timeouts.clear();
    };
  }, []);

  const removeItem = React.useCallback((id) => {
    setTrail((current) => current.filter((item) => item.id !== id));
  }, []);

  const handlePointerMove = React.useCallback(
    (event) => {
      onPointerMove?.(event);

      if (disabled || !normalizedImages.length || safeMaxItems === 0) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };
      const lastPosition = lastPositionRef.current;
      const now = window.performance.now();

      if (lastPosition) {
        const distance = Math.hypot(position.x - lastPosition.x, position.y - lastPosition.y);

        if (distance < safeThreshold || now - lastTimeRef.current < safeMinDelay) {
          return;
        }
      }

      const image = normalizedImages[imageIndexRef.current % normalizedImages.length];
      const id = `${Math.round(now)}-${Math.random().toString(36).slice(2)}`;
      const rotation = Math.random() * safeRotationRange - safeRotationRange / 2;

      imageIndexRef.current = (imageIndexRef.current + 1) % normalizedImages.length;
      lastPositionRef.current = position;
      lastTimeRef.current = now;

      setTrail((current) => {
        const next = [
          ...current,
          {
            id,
            x: position.x,
            y: position.y,
            src: image.src,
            alt: image.alt ?? "",
            rotation,
          },
        ];

        return next.slice(Math.max(0, next.length - safeMaxItems));
      });

      const timeout = window.setTimeout(() => {
        timeoutRefs.current.delete(timeout);
        removeItem(id);
      }, safeDuration);
      timeoutRefs.current.add(timeout);
    },
    [
      disabled,
      normalizedImages,
      onPointerMove,
      removeItem,
      safeDuration,
      safeMaxItems,
      safeMinDelay,
      safeRotationRange,
      safeThreshold,
    ]
  );

  const handlePointerLeave = React.useCallback(
    (event) => {
      lastPositionRef.current = null;
      onPointerLeave?.(event);
    },
    [onPointerLeave]
  );

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {children}

      <div className={cn("pointer-events-none absolute inset-0 z-50 overflow-hidden", overlayClassName)}>
        <AnimatePresence>
          {trail.map((item) => (
            <m.div
              key={item.id}
              className="absolute"
              style={{ left: item.x, top: item.y }}
              initial={{ x: "-50%", y: "-50%", scale: 0.82, opacity: 0, rotate: item.rotation }}
              animate={{ x: "-50%", y: "-50%", scale: 1, opacity: 1, rotate: item.rotation }}
              exit={{
                x: "-50%",
                y: "-50%",
                scale: 0.5,
                opacity: 0,
                rotate: item.rotation * 0.75,
                transition: exitTransition,
              }}
              transition={transition}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                draggable={false}
                className={cn(
                  "block aspect-[3/4] w-32 select-none rounded-sm object-cover shadow-2xl",
                  imageClassName
                )}
              />
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ImageTrail;
