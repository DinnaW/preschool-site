import React, { useEffect, useRef, useMemo, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Phone, Rocket, PenTool, Globe, User, Layers, ArrowUpRight, ArrowDown } from 'lucide-react';

// =========================================================================
// 👇 IMAGE IMPORTS
// Based on your error, we are stepping up one folder (..) to find assets.
// Verify your folder structure is: src/components (this file) & src/assets (images)
// =========================================================================
import cloudImg1 from '../assets/cloud-1.webp'; 
import cloudImg2 from '../assets/cloud-2.webp';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 0. LIQUID GLASS COMPONENTS
// ==========================================

const GlassFilter = () => (
  <svg style={{ position: 'absolute', top: -9999, left: -9999, width: 0, height: 0 }}>
    <filter
      id="glass-distortion"
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      filterUnits="objectBoundingBox"
    >
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.001 0.005"
        numOctaves="1"
        seed="17"
        result="turbulence"
      />
      <feComponentTransfer in="turbulence" result="mapped">
        <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
        <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
        <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
      </feComponentTransfer>
      <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
      <feSpecularLighting
        in="softMap"
        surfaceScale="5"
        specularConstant="1"
        specularExponent="100"
        lightingColor="white"
        result="specLight"
      >
        <fePointLight x="-200" y="-200" z="300" />
      </feSpecularLighting>
      <feComposite
        in="specLight"
        operator="arithmetic"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        result="litImage"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="softMap"
        scale="20" 
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </svg>
);

const GlassEffect = ({
  children,
  className = "",
  style = {},
  enableHover = true
}) => {
  const glassStyle = {
    boxShadow: "0 6px 6px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.05)",
    transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
    ...style,
  };

  return (
    <div
      className={`relative flex font-semibold overflow-hidden text-black transition-all duration-700 ${enableHover ? 'hover:scale-[1.02]' : ''} ${className}`}
      style={glassStyle}
    >
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        style={{
          backdropFilter: "blur(8px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
          opacity: 0.8
        }}
      />
      <div
        className="absolute inset-0 z-10 rounded-[inherit]"
        style={{ background: "rgba(255, 255, 255, 0.65)" }}
      />
      <div
        className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden"
        style={{
          boxShadow:
            "inset 2px 2px 1px 0 rgba(255, 255, 255, 0.8), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.3)",
        }}
      />
      <div className="relative z-30 w-full">{children}</div>
    </div>
  );
};

// ==========================================
// 1. LANDING WRAPPER (Handles Cloud Pinning)
// ==========================================
// This component wraps the Hero and pins the screen
// so the Hero stays still while the clouds open.
const LandingWrapper = ({ children }) => {
  const wrapperRef = useRef(null);
  const leftCloudRef = useRef(null);
  const rightCloudRef = useRef(null);
  const textRef = useRef(null);
  const heroContentRef = useRef(null);
  const bgRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=1500", // Scroll distance required to open clouds
          scrub: 1,
          pin: true,    // 👈 THIS FIXES THE HERO SCROLLING AWAY ISSUE
          anticipatePin: 1
        }
      });

      // 1. Move Clouds Apart (Outwards)
      tl.to(leftCloudRef.current, { xPercent: -150, ease: "power2.inOut" }, 0);
      tl.to(rightCloudRef.current, { xPercent: 150, ease: "power2.inOut" }, 0);

      // 2. Fade/Move Text
      tl.to(textRef.current, { opacity: 0, scale: 0.8, y: -50, ease: "power2.in" }, 0);

      // 3. Fade out the dark background overlay
      tl.to(bgRef.current, { opacity: 0, ease: "power1.inOut" }, 0.1);

      // 4. Subtle Zoom on Hero for dynamic effect
      tl.from(heroContentRef.current, { scale: 0.95, opacity: 0.5, ease: "power1.out" }, 0);

    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full h-screen overflow-hidden bg-white">
      
      {/* --- CLOUD OVERLAY (Z-Index 100 to stay on top) --- */}
      <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center">
        
        {/* Dark Background Overlay (Fades out) */}
        <div ref={bgRef} className="absolute inset-0 bg-black z-0"></div>

        {/* Left Cloud */}
        <div ref={leftCloudRef} className="absolute top-0 bottom-0 left-0 w-[65%] z-20 flex items-center justify-start overflow-hidden">
             <img 
               src={cloudImg1} 
               alt="Cloud Left" 
               className="w-full h-full object-cover mix-blend-screen scale-125 translate-x-[-10%]" 
             />
        </div>

        {/* Right Cloud */}
        <div ref={rightCloudRef} className="absolute top-0 bottom-0 right-0 w-[65%] z-20 flex items-center justify-end overflow-hidden">
             <img 
               src={cloudImg2} 
               alt="Cloud Right" 
               className="w-full h-full object-cover mix-blend-screen scale-125 translate-x-[10%]" 
             />
        </div>

        {/* Intro Text */}
        <div ref={textRef} className="relative z-30 flex flex-col items-center text-white mix-blend-difference">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-wider mb-4">Welcome</h1>
            <div className="flex flex-col items-center gap-2 animate-bounce opacity-80">
                <span className="text-xs font-mono uppercase tracking-[0.3em]">Scroll Down</span>
                <ArrowDown size={24} />
            </div>
        </div>
      </div>

      {/* --- HERO CONTENT (Pinned Underneath) --- */}
      <div ref={heroContentRef} className="relative w-full h-full z-10">
        {children}
      </div>

    </div>
  );
};

// ==========================================
// 2. UTILITY: SCROLL REVEAL TEXT
// ==========================================
const ScrollReveal = ({
  children,
  enableBlur = true,
  baseOpacity = 0.05,
  baseRotation = 3,
  blurStrength = 10,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom 80%',
  wordAnimationEnd = 'bottom 80%'
}) => {
  const containerRef = useRef(null);
  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return <span className="word inline-block origin-left will-change-transform" key={index}>{word}</span>;
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let ctx = gsap.context(() => {
        const wordElements = el.querySelectorAll('.word');
        gsap.fromTo(el, { transformOrigin: '0% 50%', rotate: baseRotation }, { ease: 'none', rotate: 0, scrollTrigger: { trigger: el, start: 'top bottom', end: rotationEnd, scrub: 1 } });
        gsap.fromTo(wordElements, { opacity: baseOpacity }, { ease: 'none', opacity: 1, stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 90%', end: wordAnimationEnd, scrub: 1 } });
        if (enableBlur) {
          gsap.fromTo(wordElements, { filter: `blur(${blurStrength}px)` }, { ease: 'none', filter: 'blur(0px)', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 90%', end: wordAnimationEnd, scrub: 1 } });
        }
    }, el);
    return () => ctx.revert();
  }, [enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-0 ${containerClassName}`}>
      <p className={`font-sans font-light leading-tight tracking-tight ${textClassName}`}>{splitText}</p>
    </h2>
  );
};

// ==========================================
// 3. NAVBAR & HERO COMPONENTS
// ==========================================
const Navbar = () => (
  // Reduced z-index to 40 so clouds (z-100) cover it
  <div className="absolute top-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
    <div className="pointer-events-auto">
      <GlassEffect className="rounded-full px-2 py-2 md:px-8 md:py-3" enableHover={false}>
        <nav className="flex items-center gap-6 md:gap-12">
          <div className="flex items-center gap-2 cursor-pointer pr-4 md:pr-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-100/80 rounded-full flex items-center justify-center text-orange-600 shadow-sm">
              <PenTool size={18} className="transform -rotate-45" />
            </div>
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">Kidearn</span>
          </div>
          <div className="hidden lg:flex items-center gap-8 font-bold text-slate-600 text-[15px]">
            <a href="#" className="text-orange-600">Home</a>
            <a href="#" className="hover:text-orange-600 transition-colors">About</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Program</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Contact</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-gray-200/50 flex items-center justify-center text-gray-500 bg-white/50 hover:bg-white hover:text-orange-500 transition-all">
              <Search size={18} />
            </button>
            <button className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-orange-500/25 hover:scale-105 hover:bg-orange-600 transition-all">
              <Phone size={16} />
              <span>Questions</span>
            </button>
          </div>
          <div className="md:hidden pr-2 text-slate-800">
             <Layers size={24} />
          </div>
        </nav>
      </GlassEffect>
    </div>
  </div>
);

const Hero = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-text-element", { y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: "elastic.out(1, 0.75)", delay: 0.2 });
      tl.from(imageRef.current, { scale: 0.8, opacity: 0, rotation: 5, duration: 1.2, ease: "elastic.out(1, 0.5)" }, "-=0.8");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gradient-to-br from-orange-50/50 to-white pb-20 pt-32 h-full min-h-screen flex flex-col justify-center relative">
        <GlassFilter />
        <Navbar />
        
        <section ref={containerRef} className="relative overflow-hidden w-full">
          <div className="absolute inset-0 pointer-events-none">
              <motion.div animate={{ x: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-20 right-20 text-blue-100 opacity-50">
              <svg width="100" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.34,0.032-0.671,0.091-0.994C11.597,12.222,10.825,12,10,12c-2.209,0-4,1.791-4,4 c0,1.441,0.77,2.697,1.912,3.398C8.369,19.826,9.157,20,10,20h7.5c2.485,0,4.5-2.015,4.5-4.5S19.985,11,17.5,11 c-0.199,0-0.392,0.015-0.58,0.041C16.48,8.239,13.791,6.5,11,7c-3.314,0-6,2.686-6,6c0,0.413,0.045,0.814,0.124,1.203 C3.284,15.143,2,16.896,2,19c0,2.761,2.239,5,5,5h10.5c3.037,0,5.5-2.463,5.5-5.5S20.537,13,17.5,13V19z"/></svg>
              </motion.div>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="relative z-10 pt-10 lg:pt-0 text-center lg:text-left">
              <div className="inline-block relative">
                  <h3 className="hero-text-element text-xl font-handwriting text-orange-500 font-bold mb-4 tracking-wider uppercase">Kindergarten & Baby Care</h3>
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-yellow-300 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
              </div>
              <h1 className="hero-text-element text-5xl md:text-[4.5rem] leading-[1.1] font-black text-slate-800 mb-6 mt-4">
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600">Ultimate Child</span><br />
                  <span className="relative z-10">Education Center <span className="absolute bottom-2 left-0 w-full h-4 bg-cyan-100 -z-10 -rotate-1 rounded-full opacity-60"></span></span>
              </h1>
              <p className="hero-text-element text-slate-500 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed font-medium">We provide a nurturing environment where children can learn, play, and grow with confidence.</p>
              <div className="hero-text-element flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative">
                  <button className="group px-8 py-4 rounded-full bg-orange-500 text-white font-bold text-lg shadow-xl shadow-orange-500/30 hover:bg-orange-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">Enroll Now <Rocket size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                  <button className="px-8 py-4 rounded-full bg-cyan-500 text-white font-bold text-lg shadow-xl shadow-cyan-500/30 hover:bg-cyan-600 hover:-translate-y-1 transition-all">Our Programs</button>
              </div>
              </div>
              <div className="relative flex justify-center lg:justify-end mt-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] z-0">
                  <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity }}><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path fill="#FFB800" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.3C93.5,8.6,82.1,21.5,70.9,32.2C59.7,42.9,48.8,51.4,37.3,58.3C25.8,65.2,13.7,70.5,-0.6,71.5C-14.9,72.5,-32.2,69.2,-46.3,61C-60.4,52.8,-71.4,39.7,-77.8,24.8C-84.2,9.9,-86,-6.8,-80.6,-21.2C-75.2,-35.6,-62.6,-47.7,-49.6,-55.3C-36.6,-62.9,-23.2,-66,-9.8,-66.4C3.6,-66.8,17,-64.5,30.5,-83.6L44.7,-76.4Z" transform="translate(100 100)" /></svg></motion.div>
              </div>
              <div ref={imageRef} className="relative z-10 w-full max-w-lg">
                  <div className="relative rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                      <img src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2070&auto=format&fit=crop" alt="Preschool girl" className="w-full h-auto object-cover md:h-[500px]" />
                  </div>
              </div>
              </div>
          </div>
        </section>
    </div>
  );
};

// ==========================================
// 4. INFO SECTION
// ==========================================
const InfoSection = () => {
  return (
    <section className="bg-white min-h-[80vh] py-24 px-6 md:px-12 max-w-[1400px] mx-auto text-black relative z-10">
      <div className="mb-8"><span className="text-xs font-bold tracking-widest uppercase text-gray-400 border-b-2 border-orange-500 pb-1">Our Mission</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <ScrollReveal baseOpacity={0.05} enableBlur={true} baseRotation={3} blurStrength={10} containerClassName="min-h-[200px]" textClassName="text-5xl md:text-6xl lg:text-[4.5rem] text-slate-900 font-medium">
            We are artists, designers, producers, creatives, clients and technicians. We work together to create immersive experiences.
          </ScrollReveal>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-end mt-12 lg:mt-32">
          <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg">We go beyond the traditional agency model and empower people across different industries to realise their creative ambitions.</p>
          <div className="mb-12 relative group overflow-hidden rounded-2xl shadow-lg">
             <img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop" alt="Children learning" className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>
          <div className="grid grid-cols-3 gap-8 border-t border-gray-100 pt-10">
            <div className="flex flex-col gap-2"><Globe size={28} className="text-orange-500" /><span className="block text-3xl font-bold text-slate-800">100+</span><p className="text-xs text-gray-500 uppercase">Years</p></div>
            <div className="flex flex-col gap-2"><User size={28} className="text-cyan-500" /><span className="block text-3xl font-bold text-slate-800">2.5m</span><p className="text-xs text-gray-500 uppercase">Kids</p></div>
            <div className="flex flex-col gap-2"><Layers size={28} className="text-purple-500" /><span className="block text-3xl font-bold text-slate-800">20+</span><p className="text-xs text-gray-500 uppercase">Schools</p></div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. HORIZONTAL SCROLL GALLERY
// ==========================================
const projects = [
  { id: "01", title: "Creative\nMasterpiece", category: "PROGRAM", location: "LONDON", client: "KIDEARN", tags: ["ART", "CRAFTS", "FUN"], desc: "A 6x3 metre interactive art wall designed to support the creative growth of children, allowing them to paint freely.", img: "https://images.unsplash.com/photo-1596464716127-f9a8759d1d5a?q=80&w=2070&auto=format&fit=crop" },
  { id: "02", title: "Impossible\nto Ignore", category: "ACTIVITY", location: "NEW YORK", client: "PLAYTIME", tags: ["SPORT", "OUTDOOR", "ENERGY"], desc: "A structural masterpiece built for safety and fun, installed at the central park for maximum engagement.", img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1969&auto=format&fit=crop" },
  { id: "03", title: "Silent\nFall", category: "SENSORY", location: "TOKYO", client: "ZEN KIDS", tags: ["QUIET", "READING", "FOCUS"], desc: "A fully immersive reading exhibition created by top educators to help children focus and find peace.", img: "https://images.unsplash.com/photo-1518134522856-78b082f42a67?q=80&w=2070&auto=format&fit=crop" }
];

const HorizontalGallery = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(1);
  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    if(!section || !trigger) return;
    let ctx = gsap.context(() => {
      gsap.to(section, {
        x: () => -(section.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: { trigger: trigger, start: "top top", end: "+=3000", scrub: 1, pin: true, onUpdate: (self) => { const total = projects.length; setActiveSlide(Math.max(1, Math.min(Math.ceil(self.progress * total), total))); } }
      });
    }, trigger);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={triggerRef} className="relative overflow-hidden bg-zinc-950 text-white z-20">
      <div ref={sectionRef} className="flex h-screen w-fit">
        {projects.map((project, index) => (
          <div key={index} className="w-screen h-screen flex flex-col justify-center px-6 md:px-16 relative flex-shrink-0 border-r border-zinc-900/50">
            <div className="absolute top-32 left-6 md:left-16 text-xs font-mono text-zinc-500 uppercase tracking-widest">Project {project.id}</div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-[1600px] mx-auto">
              <div className="lg:col-span-4 z-10"><h2 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.9] text-white whitespace-pre-line">{project.title}</h2></div>
              <div className="lg:col-span-5 relative"><div className="aspect-[4/3] overflow-hidden bg-zinc-900 group"><img src={project.img} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" /></div></div>
              <div className="lg:col-span-3 flex flex-col justify-between h-full pl-0 lg:pl-12 pt-8 lg:pt-0">
                <div className="flex flex-col gap-1 text-xs md:text-sm font-medium uppercase tracking-wide mb-8">{[project.category, project.location, project.client, ...project.tags].map((tag, i) => (<span key={i} className="block border-b border-zinc-800 py-1 hover:text-zinc-400 transition-colors cursor-pointer">{tag}</span>))}</div>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xs">{project.desc}</p>
                <div className="hidden lg:block w-2 h-2 bg-white rounded-full mt-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-10 left-6 right-6 md:left-16 md:right-16 flex items-end justify-between text-xs font-mono tracking-widest uppercase text-white z-50 mix-blend-difference pointer-events-none">
        <div className="w-20">[{activeSlide} / {projects.length}]</div>
        <div className="flex-1 mx-8 h-[1px] bg-zinc-800 relative overflow-hidden"><motion.div className="absolute top-0 left-0 h-full bg-white" initial={{ width: "0%" }} animate={{ width: `${(activeSlide / projects.length) * 100}%` }} transition={{ ease: "easeOut", duration: 0.5 }} /></div>
        <div className="w-32 text-right pointer-events-auto cursor-pointer flex items-center justify-end gap-1 group">View All Projects <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/></div>
      </div>
    </section>
  );
};

// ==========================================
// 6. PARALLAX "MAKE THINGS HAPPEN" SECTION
// ==========================================
const ParallaxSection = () => {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const dotRef = useRef(null);
  const colsRef = useRef([]);

  const colImages = [
    [ "https://images.unsplash.com/photo-1596464716127-f9a8759d1d5a?w=500&q=80", "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=500&q=80" ],
    [ "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&q=80", "https://images.unsplash.com/photo-1544767222-14d797686523?w=500&q=80" ],
    [ "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=500&q=80", "https://images.unsplash.com/photo-1610502778270-3882f094eb29?w=500&q=80" ],
    [ "https://images.unsplash.com/photo-1566004100631-35d015d479d9?w=500&q=80", "https://images.unsplash.com/photo-1606092195730-5d7b9af1ef4d?w=500&q=80" ],
    [ "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=500&q=80", "https://images.unsplash.com/photo-1501002019904-749c95d82084?w=500&q=80" ]
  ];

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: "top top", end: "+=250%", scrub: 0.5, pin: true }
      });

      tl.to(wrapper, { backgroundColor: "#F2F2F2", duration: 0.5, ease: "power1.inOut" }, 0.3);
      tl.to(textRef.current, { color: "#000000", duration: 0.5, ease: "power1.inOut" }, 0.3);
      tl.to(".parallax-grid-line", { borderColor: "rgba(0,0,0,0.15)", duration: 0.5 }, 0.3);
      tl.to(dotRef.current, { backgroundColor: "#000000", duration: 0.5 }, 0.3);

      colsRef.current.forEach((col, i) => {
        const isOdd = i % 2 === 0;
        const startY = isOdd ? "110vh" : "-110vh";
        const endY = isOdd ? "-110vh" : "110vh";
        gsap.set(col, { y: startY });
        tl.to(col, { y: endY, ease: "none", duration: 1 }, 0);
      });
    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} className="relative h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center z-20">
      <div className="absolute inset-0 grid grid-cols-5 w-full h-full max-w-[90%] mx-auto pointer-events-none">
        {colImages.map((images, colIndex) => (
          <div key={colIndex} className={`parallax-grid-line relative h-full border-r border-white/20 ${colIndex === 0 ? 'border-l' : ''}`}>
            {colIndex === 3 && (<div className="absolute top-1/2 -right-[3px] -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-white z-20" ref={dotRef} />)}
            <div ref={el => colsRef.current[colIndex] = el} className="flex flex-col gap-16 w-full items-center py-10">
              {images.map((src, imgIndex) => (
                <div key={imgIndex} className="w-[85%] aspect-[3/4] relative"><div className="w-full h-full overflow-hidden bg-zinc-900 shadow-2xl"><img src={src} alt="Gallery" className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"/></div></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div ref={textRef} className="z-30 text-center text-white relative pointer-events-none mix-blend-difference">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] mb-4 opacity-80">Get Started</div>
        <h2 className="text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-tighter leading-[0.9]">Let&rsquo;s make<br />things happen.</h2>
      </div>
    </section>
  );
};

// ==========================================
// 7. DARK PROJECT SHOWCASE
// ==========================================
const DarkProjectShowcase = () => {
  const containerRef = useRef(null);
  const coilRef = useRef(null);
  const galleryRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: containerRef.current, start: "top top", end: "bottom bottom", pin: coilRef.current, pinSpacing: false });
      const items = gsap.utils.toArray('.gallery-item');
      gsap.set(items, { y: 100, opacity: 0 });
      ScrollTrigger.batch(items, { start: "top 90%", onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power3.out" }) });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[300vh] bg-black text-white overflow-hidden selection:bg-white selection:text-black z-20">
      {/* BACKGROUND COIL */}
      <div ref={coilRef} className="absolute top-0 left-0 w-full h-screen flex items-center justify-center z-0 pointer-events-none">
        <motion.div style={{ rotate }} className="relative w-[300px] md:w-[500px] aspect-square">
             <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Abstract 3D Coil" className="w-full h-full object-cover rounded-full mix-blend-screen contrast-125 brightness-75 grayscale" style={{ maskImage: 'radial-gradient(circle, black 40%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)' }} />
             <div className="absolute inset-0 bg-black/40 rounded-full"></div>
        </motion.div>
      </div>

      {/* CONTENT */}
      <div ref={galleryRef} className="relative z-10 w-full max-w-[1600px] mx-auto pt-[40vh] pb-32 px-4 md:px-8">
        
        {/* Scattered Intro Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 mb-40 w-full">
            <div className="gallery-item md:col-start-2 md:col-span-2 mt-20"><div className="aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"><img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 hover:scale-110 transition-transform duration-700"/></div></div>
            <div className="gallery-item md:col-start-3 md:col-span-2 mt-40"><div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"><img src="https://images.unsplash.com/photo-1560275619-4662e36fa65c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale opacity-50"/></div></div>
            <div className="gallery-item md:col-start-6 md:col-span-2 -mt-20"><div className="aspect-square bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center"><div className="w-20 h-20 bg-gradient-to-tr from-zinc-500 to-white rounded-full blur-xl opacity-50"></div></div></div>
            <div className="gallery-item md:col-start-8 md:col-span-2 mt-10"><div className="aspect-[3/4] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 text-red-500"/><div className="absolute inset-0 bg-red-900/20 mix-blend-overlay"></div></div></div>
        </div>

        {/* Main Headline */}
        <div className="relative w-full flex justify-center mb-60 px-4">
             <h2 className="gallery-item text-4xl md:text-6xl lg:text-[5.5rem] font-serif italic text-center leading-[1.1] tracking-tight max-w-5xl text-zinc-100 mix-blend-difference">
                We are a collaborative engine for bold ideas, beautiful code, and digital experiences <span className="text-zinc-500 font-sans not-italic text-lg md:text-2xl tracking-normal ml-2">(that actually matter)</span>.
             </h2>
        </div>

        {/* Zig-Zag Work Grid */}
        <div className="flex flex-col gap-32 md:gap-60 px-4 md:px-20">
            {/* Project 1 */}
            <div className="gallery-item grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-7 relative group cursor-none">
                    <div className="aspect-[4/3] overflow-hidden rounded-sm relative"><img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"><div className="bg-white text-black px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest flex items-center gap-2">Discover <ArrowUpRight size={12}/></div></div></div>
                    <div className="mt-6 border-t border-white/20 pt-4 flex justify-between items-start"><div className="max-w-md"><h3 className="text-2xl font-normal mb-2">Designing a bold scrolling experience</h3><p className="text-zinc-500 text-sm">Global Design Reference</p></div><span className="text-xs font-mono uppercase border border-white/20 px-2 py-1 rounded-full">Amanda Braga</span></div>
                </div>
            </div>
            {/* Project 2 */}
            <div className="gallery-item grid grid-cols-1 md:grid-cols-12 gap-8 justify-items-end">
                <div className="md:col-span-5 md:col-start-8 relative group">
                     <div className="absolute -top-12 -left-12 z-20 bg-zinc-900 border border-zinc-800 p-4 rounded-lg shadow-2xl max-w-[200px]"><div className="flex justify-between items-center mb-2"><span className="text-[10px] font-mono text-zinc-500 uppercase">Updates</span><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div></div><p className="text-sm font-medium leading-snug">Boost your wallet with our new FinTech integration.</p></div>
                    <div className="aspect-[3/4] overflow-hidden rounded-sm relative w-full"><img src="https://images.unsplash.com/photo-1556742049-09329e2e2a6b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                    <div className="mt-6 border-t border-white/20 pt-4"><h3 className="text-2xl font-normal mb-2">Translating design vision</h3><div className="flex gap-2 mt-3"><span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-1 rounded-sm">Front-End Dev</span><span className="text-[10px] font-mono uppercase bg-white/10 px-2 py-1 rounded-sm">Wordpress</span></div></div>
                </div>
            </div>
            {/* Project 3 */}
            <div className="gallery-item grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-start-3 md:col-span-8 relative group">
                    <div className="aspect-[21/9] overflow-hidden rounded-sm relative w-full"><img src="https://images.unsplash.com/photo-1618172193763-c511deb635ca?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75" /><div className="absolute bottom-8 right-8 bg-white text-black w-32 h-32 rounded-full flex items-center justify-center text-xs font-mono uppercase tracking-widest hover:scale-110 transition-transform cursor-pointer">View Case</div></div>
                    <div className="mt-6 flex justify-between items-end border-t border-white/20 pt-4"><h3 className="text-4xl font-serif italic">Reimagining NeonDoor</h3><p className="text-zinc-500 text-sm max-w-xs text-right">The world's first immersive literary experience.</p></div>
                </div>
            </div>
        </div>
        <div className="h-[20vh]"></div>
      </div>
    </div>
  );
};

// ==========================================
// 8. MAIN APP EXPORT
// ==========================================
export default function App() {
  return (
    <main className="bg-white font-sans text-gray-900 selection:bg-orange-200 selection:text-orange-900 relative">
      {/* 
         We wrap the Hero inside LandingWrapper.
         This Wrapper PINS the Hero to the top, so it stays still while clouds move.
      */}
      <LandingWrapper>
         <Hero />
      </LandingWrapper>

      <InfoSection />
      <HorizontalGallery />
      <ParallaxSection />
      <DarkProjectShowcase />
      
      <footer className="h-[50vh] bg-[#F2F2F2] text-zinc-500 flex flex-col gap-4 items-center justify-center border-t border-zinc-300 relative z-20">
        <h3 className="text-2xl font-bold text-zinc-800">Ready to join?</h3>
        <p className="text-sm">© 2024 Kidearn. All Rights Reserved.</p>
      </footer>
    </main>
  );
}