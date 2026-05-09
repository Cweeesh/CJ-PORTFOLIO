"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

// ==========================================
// 1. Hydration-Safe Global Star Particle
// ==========================================
function Particle({ mouseX, mouseY, windowBounds }: { mouseX: any, mouseY: any, windowBounds: { width: number, height: number } }) {
  const [mounted, setMounted] = useState(false);
  
  // Grouping random properties to ensure server/client match perfectly
  const [props, setProps] = useState({
    size: 0,
    baseOpacity: 0,
    baseX: 0,
    baseY: 0,
    animX: 0,
    animY: 0,
    duration: 5,
    reactionRange: 50,
    rotation: 0,
  });

  // Generate random values ONLY on the client after the first render
  useEffect(() => {
    // Only generate particles if we have valid window bounds
    if (windowBounds.width === 0) return;

    setProps({
      size: Math.random() * 12 + 8, // Increased size (8px to 20px) to make star shape visible
      baseOpacity: Math.random() * 0.3 + 0.1, // 10% to 40% opacity
      baseX: Math.random() * windowBounds.width,
      baseY: Math.random() * windowBounds.height,
      animX: Math.random() * 40 - 20,
      animY: Math.random() * 40 - 20,
      duration: Math.random() * 5 + 5,
      reactionRange: Math.random() * 80 + 30,
      rotation: Math.random() * 360, // Random starting rotation
    });
    setMounted(true);
  }, [windowBounds]);

  const springX = useSpring(0, { stiffness: 40, damping: 20 });
  const springY = useSpring(0, { stiffness: 40, damping: 20 });

  // Track global mouse movement
  useEffect(() => {
    if (!mounted) return;
    return mouseX.on("change", (latestX: number) => {
      const normX = latestX / windowBounds.width - 0.5;
      springX.set(props.baseX + normX * props.reactionRange);
    });
  }, [mouseX, windowBounds.width, props.baseX, props.reactionRange, mounted]);

  useEffect(() => {
    if (!mounted) return;
    return mouseY.on("change", (latestY: number) => {
      const normY = latestY / windowBounds.height - 0.5;
      springY.set(props.baseY + normY * props.reactionRange);
    });
  }, [mouseY, windowBounds.height, props.baseY, props.reactionRange, mounted]);

  // Prevent server/client mismatch by returning null until client is ready
  if (!mounted) return null;

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
        opacity: props.baseOpacity,
        width: props.size,
        height: props.size,
      }}
      // Removed bg color and rounded-full, added text color for the SVG to inherit
      className="absolute text-neutral-500 z-[1] flex items-center justify-center"
      animate={{
        x: [0, props.animX, 0],
        y: [0, props.animY, 0],
        rotate: [props.rotation, props.rotation + 180, props.rotation + 360], // Added a subtle spin
      }}
      transition={{
        duration: props.duration,
        repeat: Infinity,
        ease: "linear", // Changed to linear so rotation doesn't stutter
      }}
    >
      {/* The SVG Star */}
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="w-full h-full"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </motion.div>
  );
}

// ==========================================
// 2. Main Page Component
// ==========================================
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track the actual window size for seamless global particles
  const [windowBounds, setWindowBounds] = useState({ width: 0, height: 0 });

  // Performant mouse tracking values
  const mouseX = useSpring(0);
  const mouseY = useSpring(0);

  // Measure window on mount and resize
  useEffect(() => {
    const updateBounds = () => {
      setWindowBounds({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  // Set the mouse values globally
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    // Only track if we are on a desktop-sized screen to save mobile performance
    if (windowBounds.width > 768) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
  };

  // --- Parallax Logic for Hero ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="font-sans overflow-x-hidden relative"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      
      {/* ========================================
          GLOBAL SEAMLESS PARTICLES LAYER
          Fixed to the screen, sits above backgrounds but below text (z-30)
          ======================================== */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[30]">
        {/* Render 40 stars globally */}
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle
            key={i}
            mouseX={mouseX}
            mouseY={mouseY}
            windowBounds={windowBounds}
          />
        ))}
      </div>

      {/* ========================================
          HERO PARALLAX CONTAINER
          ======================================== */}
      <div ref={containerRef} className="relative h-[200vh] overflow-hidden z-10">
        
        {/* Background Blurred Circle (Moves slower) */}
        <motion.div 
          style={{ y: bgY, background: "var(--background)" }}
          className="absolute inset-0 z-0 flex items-center justify-center h-screen opacity-20 pointer-events-none"
        >
          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-gray-300 to-gray-500 blur-3xl" />
        </motion.div>

        {/* Foreground Typing Text (Moves faster) */}
        <motion.div 
          style={{ y: textY }}
          // z-[40] ensures text is above the global particles
          className="relative z-[40] flex h-screen w-full flex-col items-center justify-center py-20 px-6 md:py-32 md:px-16"
        >
          <TypeAnimation
            sequence={[
              "CARLOS JOSEPH DIZON",
              4000,
              "",
              500,
            ]}
            wrapper="h1"
            cursor={true}
            repeat={Infinity}
            className="w-full text-center text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-semibold leading-tight tracking-tighter"
            style={{ color: "var(--foreground)" }}
          />
        </motion.div>

        {/* SECTION 2: The Parallax Cover */}
        <div className="relative z-[20] flex h-screen items-center justify-center p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
          {/* z-[40] for content so dots float behind the text but over the background */}
          <div className="relative z-[40] max-w-4xl w-full text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              About Me
            </h2>
            <p className="text-lg" style={{ color: "var(--foreground)" }}>
              As you scroll down, this section covers the hero animation. Notice the stars are still here!
            </p>
          </div>
        </div>

      </div>

      {/* ========================================
          STANDARD SCROLLING SECTIONS
          ======================================== */}

      {/* SECTION 3: Projects */}
      <section className="relative z-[20] flex min-h-screen items-center justify-center p-6" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <div className="relative z-[40] max-w-4xl w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Selected Projects
          </h2>
          <p className="text-lg" style={{ color: "var(--foreground)" }}>
            Standard scrolling resumes here. The stars flow seamlessly into this section.
          </p>
        </div>
      </section>

      {/* SECTION 4: Contact */}
      <section className="relative z-[20] flex min-h-[50vh] items-center justify-center p-6" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
        <div className="relative z-[40] max-w-4xl w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: "var(--foreground)" }}>
            Let's Connect
          </h2>
          <p className="text-lg" style={{ color: "var(--foreground)" }}>
            Because the stars are neutral gray, they subtly show up on dark backgrounds too.
          </p>
        </div>
      </section>

    </main>
  );
}