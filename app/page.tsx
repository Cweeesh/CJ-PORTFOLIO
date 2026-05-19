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
<div 
  className="relative z-[20] flex h-screen items-center justify-center p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]" 
  style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
>
  {/* z-[40] for content so dots float behind the text but over the background */}
  <div className="relative z-[40] max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
    
    {/* Left Side: Description */}
    <div className="flex-1 text-center md:text-left">
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
        About Me
      </h2>
      <p className="text-lg leading-relaxed max-w-2xl md:max-w-none" style={{ color: "var(--foreground)" }}>
  I don't just write code; I architect systems that deliver. Whether it's crafting lightning-fast full-stack web applications or mapping out complex backend and infrastructure networks, I approach every project with full-court focus—engineering fluid user experiences and airtight technical architecture that perform under pressure.
</p>
    </div>

    {/* Right Side: Image */}
{/* Added md:translate-x-8 to shift it 32px to the right */}
<div className="flex-1 flex justify-center md:justify-end md:translate-x-40">
  <img 
    src="/PERSONAL-PICTURE.png" 
    alt="Personal Profile" 
    className="w-80 h-80 md:w-[500px] md:h-[500px] object-cover rounded-2xl shadow-lg border-2 border-transparent"
  />
</div>

  </div>
</div>

      </div>

      {/* ========================================
          STANDARD SCROLLING SECTIONS
          ======================================== */}

    {/* SECTION 3: Projects */}
      <section 
        className="relative z-[20] flex min-h-screen items-center justify-center p-6 md:p-12" 
        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      >
        {/* Widened the main container from max-w-5xl to max-w-7xl */}
        <div className="relative z-[40] max-w-7xl w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">
            Selected Projects
          </h2>

          {/* Removed the background, borders, and backdrop-blur to make it seamless */}
          <div className="flex flex-col items-center w-full">
            
            {/* Project Title & Short Description */}
            <h3 className="text-2xl md:text-4xl font-bold mb-6 max-w-12xl">
              FitTech: Near Field Communication Empowered Gym Management and AI-Enhanced Personal Training
            </h3>
            <p className="text-lg md:text-xl mb-16 max-w-12xl opacity-80">
              A full-stack gym management system designed specifically for RKP Fitness Gym. Deployed and actively utilized in production for 5 months in Siniloan Laguna, bridging the gap between physical hardware and digital fitness tracking.
            </p>

            {/* Project Images - Removed borders and shadows */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 mb-16 w-full max-w-6xl">
              <img
                src="/WEBSITE.png"
                alt="FitTech Web Dashboard Design"
                className="w-full md:w-1/2 h-auto object-contain"
              />
              <img
                src="/MOBILEAPP.png"
                alt="FitTech Mobile App Design"
                className="w-full md:w-1/2 h-auto object-contain"
              />
            </div>

            {/* Project Details Grid - Widened text layout */}
            <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 w-full max-w-5xl text-base md:text-lg">
              
              {/* Components */}
              <div>
                <h4 className="font-bold text-xl mb-4">Core Components</h4>
                <ul className="list-disc list-inside space-y-3 opacity-80">
                  <li>
                    <strong>Web Dashboard:</strong> Administrative portal for staff to manage memberships, analytics, and daily gym operations.
                  </li>
                  <li>
                    <strong>Mobile App:</strong> A dedicated application for gym members featuring AI-enhanced personalized training routines.
                  </li>
                  <li>
                    <strong>NFC Integration:</strong> Tap-to-access smart technology for seamless gym entry and automated attendance tracking.
                  </li>
                </ul>
              </div>

              {/* Highlights & Tech */}
              <div>
                <h4 className="font-bold text-xl mb-4">Highlights & Technologies</h4>
                <ul className="list-disc list-inside space-y-3 opacity-80">
                  <li>
                    <strong>Tech Stack:</strong> JavaScript, Tailwind CSS, Flutter, Node.js, and MySQL.
                  </li>
                  <li>
                    <strong>Deployment:</strong> Maintained robust performance and reliability over 5 months of continuous real-world use.
                  </li>
                  <li>
                    <strong>Recognition:</strong> Selected Participant for University-Wide Research Congress
                  </li>
                </ul>
              </div>

            </div>
          </div>
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