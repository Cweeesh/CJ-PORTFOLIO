"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { TypeAnimation } from "react-type-animation";

// ==========================================
// 1. Hydration-Safe Global Star Particle
// ==========================================
function Particle({ mouseX, mouseY, windowBounds }: { mouseX: any, mouseY: any, windowBounds: { width: number, height: number } }) {
  const [mounted, setMounted] = useState(false);
  
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

  useEffect(() => {
    if (windowBounds.width === 0) return;

    setProps({
      size: Math.random() * 12 + 8,
      baseOpacity: Math.random() * 0.3 + 0.1,
      baseX: Math.random() * windowBounds.width,
      baseY: Math.random() * windowBounds.height,
      animX: Math.random() * 40 - 20,
      animY: Math.random() * 40 - 20,
      duration: Math.random() * 5 + 5,
      reactionRange: Math.random() * 80 + 30,
      rotation: Math.random() * 360,
    });
    setMounted(true);
  }, [windowBounds]);

  const springX = useSpring(0, { stiffness: 40, damping: 20 });
  const springY = useSpring(0, { stiffness: 40, damping: 20 });

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
      className="absolute text-neutral-500 z-[1] flex items-center justify-center"
      animate={{
        x: [0, props.animX, 0],
        y: [0, props.animY, 0],
        rotate: [props.rotation, props.rotation + 180, props.rotation + 360],
      }}
      transition={{
        duration: props.duration,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </motion.div>
  );
}

// ==========================================
// 2. Main Page Component
// ==========================================
export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  
  const [windowBounds, setWindowBounds] = useState({ width: 0, height: 0 });
  const mouseX = useSpring(0);
  const mouseY = useSpring(0);

  useEffect(() => {
    const updateBounds = () => {
      setWindowBounds({ width: window.innerWidth, height: window.innerHeight });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (windowBounds.width > 768) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
  };

  // --- Independent Parallax Animations ---
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "45%"]);
  const heroBgY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);

  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"],
  });
  const aboutFade = useTransform(aboutScroll, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const aboutY = useTransform(aboutScroll, [0, 0.3], ["60px", "0px"]);

  const { scrollYProgress: expScroll } = useScroll({
    target: expRef,
    offset: ["start end", "end start"],
  });
  const expFade = useTransform(expScroll, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const expY = useTransform(expScroll, [0, 0.3], ["60px", "0px"]);

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="font-sans overflow-x-hidden relative transition-colors duration-500"
    >
      
      {/* GLOBAL PARTICLES LAYER */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[30]">
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} mouseX={mouseX} mouseY={mouseY} windowBounds={windowBounds} />
        ))}
      </div>

      {/* ========================================
          SECTION 1: HERO PARALLAX
          ======================================== */}
      <div ref={heroRef} className="relative h-screen overflow-hidden z-10">
        <motion.div 
          style={{ y: heroBgY }}
          className="absolute inset-0 z-0 flex items-center justify-center h-screen opacity-20 pointer-events-none"
        >
          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-tr from-gray-300 to-gray-500 blur-3xl dark:from-neutral-700 dark:to-neutral-900" />
        </motion.div>

        <motion.div 
          style={{ y: heroTextY }}
          className="relative z-[40] flex h-screen w-full flex-col items-center justify-center py-20 px-6 md:py-32 md:px-16"
        >
          <TypeAnimation
            sequence={["CARLOS JOSEPH DIZON", 4000, "", 500]}
            wrapper="h1"
            cursor={true}
            repeat={Infinity}
            className="w-full text-center text-5xl sm:text-6xl md:text-7xl lg:text-[100px] font-semibold leading-tight tracking-tighter"
          />
        </motion.div>
      </div>

      {/* ========================================
          SECTION 2: ABOUT ME (Smooth Fade & Slide)
          ======================================== */}
      <section 
        ref={aboutRef}
        className="relative z-[20] min-h-screen flex items-center justify-center p-6 md:p-12 transition-colors duration-500"
      >
        <motion.div 
          style={{ opacity: aboutFade, y: aboutY }}
          className="relative z-[40] max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16"
        >
          {/* Left Side: Description */}
          <div className="flex-[1.6] text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              About Me
            </h2>
            <p className="text-lg leading-relaxed max-w-none opacity-90">
              I don't just write code; I architect systems that deliver. Whether it's crafting lightning-fast full-stack web applications or mapping out complex backend and infrastructure networks, I approach every project with full-court focus—engineering fluid user experiences and airtight technical architecture that perform under pressure.
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="flex-[1] flex justify-center md:justify-end w-full">
            <img 
              src="/PERSONAL-PICTURE.png" 
              alt="Personal Profile" 
              className="w-full h-80 md:w-[650px] md:h-[400px] object-cover rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 transition-all duration-500"
            />
          </div>
        </motion.div>
      </section>

      {/* ========================================
          SECTION 2.5: PROFESSIONAL EXPERIENCES (Smooth Fade & Slide)
          ======================================== */}
      <section 
        ref={expRef}
        className="relative z-[20] min-h-screen flex items-center justify-center p-6 md:p-12 transition-colors duration-500"
      >
        <motion.div 
          style={{ opacity: expFade, y: expY }}
          className="relative z-[40] max-w-5xl w-full flex flex-col md:flex-row-reverse items-center justify-between gap-12 md:gap-16"
        >
          {/* Right Side: Experience Description */}
          <div className="flex-[1.4] text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Experience
            </h2>
            <p className="text-lg leading-relaxed max-w-none opacity-90">
              Bridging software systems engineering with real-world infrastructure. My background includes technical field deployments, managing end-to-end telecommunications frameworks, handling redline physical blueprints, and orchestrating network distribution. I focus on reliability, rigorous field calculation, and structural optimization across both digital networks and physical systems.
            </p>
          </div>

          {/* Left Side: Professional Experience Showcase Box */}
          <div className="flex-[1.2] w-full flex justify-center md:justify-start">
            <div 
              className="w-full max-w-[480px] p-8 rounded-2xl border backdrop-blur-md shadow-2xl text-left relative overflow-hidden transition-all duration-500 bg-black/[0.03] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08]"
            >
              
              {/* Subtle Blueprint Grid Accent */}
              <div 
                className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.05] dark:opacity-[0.03] transition-opacity duration-500" 
              />
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <span className="text-xs font-semibold tracking-wider uppercase opacity-60">Internship Practicum</span>
                  <h3 className="text-2xl font-bold mt-1">OSP Engineer Trainee</h3>
                </div>
                <span 
                  className="text-xs px-3 py-1 rounded-full border font-mono transition-colors duration-500 bg-black/[0.04] dark:bg-white/[0.06] border-black/10 dark:border-white/15"
                >
                  300 HRS
                </span>
              </div>
              
              <h4 className="text-base font-semibold mb-6 relative z-10 opacity-70">MaTel Solutions Inc.</h4>
              
              <div className="space-y-5 relative z-10">
                <div className="flex gap-4">
                  <span className="opacity-40 font-mono text-sm mt-0.5">01</span>
                  <p className="text-sm opacity-80"><strong className="opacity-100 text-base block mb-0.5">Network Distribution</strong>Handled multi-floor infrastructure planning, tracking complex fiber optic routing, midspan calculations, and structural layouts.</p>
                </div>
                <div className="flex gap-4">
                  <span className="opacity-40 font-mono text-sm mt-0.5">02</span>
                  <p className="text-sm opacity-80"><strong className="opacity-100 text-base block mb-0.5">As-Built Documentation</strong>Managed technical engineering redlining blueprints, correcting network access point installations with high spatial accuracy.</p>
                </div>
                <div className="flex gap-4">
                  <span className="opacity-40 font-mono text-sm mt-0.5">03</span>
                  <p className="text-sm opacity-80"><strong className="opacity-100 text-base block mb-0.5">Field Deployments</strong>Supervised onsite operations including fiber optic splicing parameters, structural safety audits, and network signal integrity troubleshooting.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================
          SECTION 3: SELECTED PROJECTS
          ======================================== */}
      <section 
        className="relative z-[20] flex min-h-screen items-center justify-center p-6 md:p-12 transition-colors duration-500" 
      >
        <div className="relative z-[40] max-w-7xl w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16">
            Selected Projects
          </h2>

          <div className="flex flex-col items-center w-full">
            <h3 className="text-2xl md:text-4xl font-bold mb-6 max-w-5xl">
              FitTech: Near Field Communication Empowered Gym Management and AI-Enhanced Personal Training
            </h3>
            <p className="text-lg md:text-xl mb-16 max-w-4xl opacity-80">
              A full-stack gym management system designed specifically for RKP Fitness Gym. Deployed and actively utilized in production for 5 months in Siniloan Laguna, bridging the gap between physical hardware and digital fitness tracking.
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 mb-16 w-full max-w-6xl">
              <img src="/WEBSITE.png" alt="FitTech Web Dashboard Design" className="w-full md:w-1/2 h-auto object-contain" />
              <img src="/MOBILEAPP.png" alt="FitTech Mobile App Design" className="w-full md:w-1/2 h-auto object-contain" />
            </div>

            <div className="text-left grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 w-full max-w-5xl text-base md:text-lg">
              <div>
                <h4 className="font-bold text-xl mb-4">Core Components</h4>
                <ul className="list-disc list-inside space-y-3 opacity-80">
                  <li><b>Web Dashboard:</b> Administrative portal for staff to manage memberships, analytics, and daily gym operations.</li>
                  <li><b>Mobile App:</b> A dedicated application for gym members featuring AI-enhanced personalized training routines.</li>
                  <li><b>NFC Integration:</b> Tap-to-access smart technology for seamless gym entry and automated attendance tracking.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-xl mb-4">Highlights & Technologies</h4>
                <ul className="list-disc list-inside space-y-3 opacity-80">
                  <li><b>Tech Stack:</b> JavaScript, Tailwind CSS, Flutter, Node.js, and MySQL.</li>
                  <li><b>Deployment:</b> Maintained robust performance and reliability over 5 months of continuous real-world use.</li>
                  <li><b>Recognition:</b> Selected Participant for University-Wide Research Congress</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          SECTION 4: CONTACT
          ======================================== */}
      <section className="relative z-[20] flex min-h-[50vh] items-center justify-center p-6 transition-colors duration-500">
        <div className="relative z-[40] max-w-4xl w-full text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Let's Connect
          </h2>
          <p className="text-lg opacity-70">
            Because the stars are neutral gray, they subtly show up on dark backgrounds too.
          </p>
        </div>
      </section>

    </main>
  );
}