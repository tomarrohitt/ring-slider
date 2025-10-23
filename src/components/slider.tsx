import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
  MotionValue,
  type Easing,
} from "framer-motion";

interface SliderProps {
  images: string[];
  width: number;
  perspective?: number;
  imageDistance: number;
  initialRotation?: number;
  animationDuration?: number;
  staggerDelay?: number;
  hoverOpacity?: number;
  backgroundColor?: string;
  draggable?: boolean;
  ease?: string;
  mobileBreakpoint?: number;
  mobileScaleFactor?: number;
  inertiaPower?: number;
  inertiaTimeConstant?: number;
  inertiaVelocityMultiplier?: number;
}

export function Slider({
  images,
  width,
  perspective,
  imageDistance,
  initialRotation = 60,
  animationDuration = 1.5,
  staggerDelay = 0.1,
  hoverOpacity = 0.5,
  backgroundColor,
  draggable = true,
  ease = "easeOut",
  mobileBreakpoint = 768,
  mobileScaleFactor = 0.7,
  inertiaPower = 0.8,
  inertiaTimeConstant = 200,
  inertiaVelocityMultiplier = 14,
}: SliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const rotationY: MotionValue<number> = useMotionValue(initialRotation);
  const startX = useRef<number>(0);
  const currentRotationY = useRef<number>(initialRotation);
  const isDragging = useRef<boolean>(false);
  const velocity = useRef<number>(0);

  const [currentScale, setCurrentScale] = useState<number>(1);
  const [showImages, setShowImages] = useState<boolean>(false);

  const angle = useMemo(() => 360 / images.length, [images.length]);

  const getBgPos = useCallback((): string => {
    return `center center`;
  }, []);

  useEffect(() => {
    const unsubscribe = rotationY.on("change", (latestRotation: number) => {
      if (ringRef.current) {
        Array.from(ringRef.current.children).forEach((imgElement) => {
          (imgElement as HTMLElement).style.backgroundPosition = getBgPos();
        });
      }
      currentRotationY.current = latestRotation;
    });
    return () => unsubscribe();
  }, [rotationY, images.length, imageDistance, currentScale, angle, getBgPos]);

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const newScale =
        viewportWidth <= mobileBreakpoint ? mobileScaleFactor : 1;
      setCurrentScale(newScale);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint, mobileScaleFactor]);

  useEffect(() => {
    setShowImages(true);
  }, []);

  const handleDragStart = (
    event: React.MouseEvent | React.TouchEvent
  ): void => {
    if (!draggable) return;
    isDragging.current = true;
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    startX.current = clientX;
    rotationY.stop();
    velocity.current = 0;
    if (ringRef.current) {
      ringRef.current.style.cursor = "grabbing";
    }
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", handleDragEnd);
  };

  const handleDrag = (event: MouseEvent | TouchEvent): void => {
    if (!isDragging.current) return;

    const clientX =
      "touches" in event
        ? (event as TouchEvent).touches[0].clientX
        : (event as MouseEvent).clientX;
    const deltaX = clientX - startX.current;

    velocity.current = -deltaX * 0.5;

    rotationY.set(currentRotationY.current + velocity.current);

    startX.current = clientX;
  };

  const handleDragEnd = (): void => {
    isDragging.current = false;
    if (ringRef.current) {
      ringRef.current.style.cursor = "grab";
      currentRotationY.current = rotationY.get();
    }

    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", handleDragEnd);

    const initial = rotationY.get();
    const velocityBoost = velocity.current * inertiaVelocityMultiplier;
    const target = initial + velocityBoost;

    animate(initial, target, {
      type: "inertia",
      velocity: velocityBoost,
      power: inertiaPower,
      timeConstant: inertiaTimeConstant,
      restDelta: 0.5,
      modifyTarget: (target: number) => Math.round(target / angle) * angle,
      onUpdate: (latest: number) => {
        rotationY.set(latest);
      },
    });

    velocity.current = 0;
  };

  const imageVariants = {
    hidden: { y: 200, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div
      ref={containerRef}
      className="w-[90%] h-full overflow-hidden select-none relative"
      style={{
        backgroundColor,
        transform: `scale(${currentScale})`,
        transformOrigin: "center center",
      }}
      onMouseDown={draggable ? handleDragStart : undefined}
      onTouchStart={draggable ? handleDragStart : undefined}
    >
      <div
        style={{
          perspective: `${perspective}px`,
          width: `${width}px`,
          height: `${width * 1.33}px`,
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <motion.div
          ref={ringRef}
          className="w-full h-full absolute"
          style={{
            transformStyle: "preserve-3d",
            rotateY: rotationY,
            cursor: draggable ? "grab" : "default",
          }}
        >
          <AnimatePresence>
            {showImages &&
              images.map((imageUrl, index) => (
                <motion.div
                  key={index}
                  className="w-full h-full absolute border-4 border-white/10 rounded-2xl"
                  style={{
                    transformStyle: "preserve-3d",
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backfaceVisibility: "hidden",
                    rotateY: index * -angle,
                    z: -imageDistance * currentScale,
                    transformOrigin: `50% 50% ${
                      imageDistance * currentScale
                    }px`,
                    backgroundPosition: getBgPos(),
                  }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={imageVariants}
                  custom={index}
                  transition={{
                    delay: index * staggerDelay,
                    duration: animationDuration,
                    ease: ease as Easing,
                  }}
                  whileHover={{ opacity: 1, transition: { duration: 0.15 } }}
                  onHoverStart={() => {
                    if (isDragging.current) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach(
                        (imgEl, i) => {
                          if (i !== index) {
                            (
                              imgEl as HTMLElement
                            ).style.opacity = `${hoverOpacity}`;
                          }
                        }
                      );
                    }
                  }}
                  onHoverEnd={() => {
                    if (isDragging.current) return;
                    if (ringRef.current) {
                      Array.from(ringRef.current.children).forEach((imgEl) => {
                        (imgEl as HTMLElement).style.opacity = `1`;
                      });
                    }
                  }}
                />
              ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
