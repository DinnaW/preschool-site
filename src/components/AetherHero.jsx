import React, { useEffect, useRef, useMemo, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Phone, Rocket, PenTool, Globe, User, Layers, ArrowUpRight, ArrowDown, Sparkles } from 'lucide-react';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 0. ASSETS (Remote for instant preview)
// ==========================================
// Using generic cloud/texture images so this works out of the box for you.
const CLOUD_LEFT = "https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?q=80&w=2000&auto=format&fit=crop"; 
const CLOUD_RIGHT = "https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?q=80&w=2000&auto=format&fit=crop"
// ==========================================
// 1. GLOBAL COMPONENTS & UTILS
// ==========================================

const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-orange-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
};

// Advanced Glass Effect
const GlassCard = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-xl ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

// ==========================================
// 2. LANDING WRAPPER (The "Curtain" Opener)
// ==========================================
const LandingWrapper = ({ children }) => {
  const wrapperRef = useRef(null);
  const leftCloudRef = useRef(null);
  const rightCloudRef = useRef(null);
  const textRef = useRef(null);
  const heroContentRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=2000", // Increased distance for a slower, more dramatic open
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // 1. Clouds Parting
      tl.to(leftCloudRef.current, { xPercent: -120, scale: 1.1, ease: "power1.inOut" }, 0);
      tl.to(rightCloudRef.current, { xPercent: 120, scale: 1.1, ease: "power1.inOut" }, 0);

      // 2. Text Fading
      tl.to(textRef.current, { opacity: 0, scale: 1.5, filter: "blur(20px)", ease: "power2.in" }, 0);

      // 3. Hero Content Revealing (Scale up from back)
      tl.fromTo(heroContentRef.current, 
        { scale: 0.8, filter: "brightness(0.5) blur(5px)" },
        { scale: 1, filter: "brightness(1) blur(0px)", ease: "power2.out" }, 0.2
      );

    }, wrapperRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full h-screen overflow-hidden bg-zinc-900">
      
      {/* --- OVERLAY CURTAINS --- */}
      <div className="absolute inset-0 z-[60] pointer-events-none flex">
        {/* Left Cloud */}
        <div ref={leftCloudRef} className="relative w-1/2 h-full overflow-hidden bg-slate-200">
             <img src={CLOUD_LEFT} alt="Cloud" className="absolute w-[150%] h-full object-cover left-0 opacity-90 mix-blend-multiply" />
        </div>
        {/* Right Cloud */}
        <div ref={rightCloudRef} className="relative w-1/2 h-full overflow-hidden bg-slate-200">
             <img src={CLOUD_RIGHT} alt="Cloud" className="absolute w-[150%] h-full object-cover right-0 opacity-90 mix-blend-multiply" />
        </div>

        {/* Floating Text */}
        <div ref={textRef} className="absolute inset-0 flex flex-col items-center justify-center text-white z-50 mix-blend-difference">
            <h1 className="text-[12vw] font-black uppercase tracking-tighter leading-none text-center">
              The <span className="text-orange-300">Start</span>
            </h1>
            <p className="mt-4 font-mono text-sm uppercase tracking-[0.5em] animate-pulse">Scroll to Begin</p>
        </div>
      </div>

      {/* --- HERO CONTENT --- */}
      <div ref={heroContentRef} className="relative w-full h-full z-10 bg-white">
        {children}
      </div>
    </div>
  );
};

// ==========================================
// 3. NAVBAR & HERO
// ==========================================
const Navbar = () => (
  <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center max-w-[1600px] mx-auto pointer-events-none">
    <div className="pointer-events-auto flex items-center gap-2">
      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
        <PenTool size={20} />
      </div>
      <span className="text-2xl font-bold tracking-tight text-slate-900">Kidearn<span className="text-orange-500">.</span></span>
    </div>
    <div className="pointer-events-auto hidden md:flex gap-8 text-sm font-semibold text-slate-600 bg-white/80 backdrop-blur-md px-8 py-3 rounded-full shadow-sm border border-slate-100">
      <a href="#" className="text-orange-600">Home</a>
      <a href="#" className="hover:text-slate-900 transition-colors">About</a>
      <a href="#" className="hover:text-slate-900 transition-colors">Admissions</a>
      <a href="#" className="hover:text-slate-900 transition-colors">Contact</a>
    </div>
    <div className="pointer-events-auto flex gap-4">
      <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"><Search size={18} /></button>
    </div>
  </nav>
);

const Hero = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-orange-50 to-white">
      <Navbar />
      
      {/* Decorative BG Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-yellow-200/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30vw] h-[30vw] bg-blue-200/40 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full pt-20">
        <div className="space-y-8 relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> New Enrollment Open
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tight">
            Growing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Minds,</span>
            <span className="block italic font-serif font-light text-5xl md:text-7xl mt-2 text-slate-500">one day at a time.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-md leading-relaxed">
            An immersive educational environment designed to spark curiosity, creativity, and confidence in every child.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-2 group">
              Start Journey <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform"/>
            </button>
          </div>
        </div>

        <div className="relative h-[60vh] hidden lg:block">
          {/* Parallax Image in Hero */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative w-[80%] h-[90%] rounded-[40px] overflow-hidden border-8 border-white shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700 ease-out">
                <img 
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2070&auto=format&fit=crop" 
                  className="w-full h-full object-cover scale-110"
                  alt="Happy Kid"
                />
             </div>
             {/* Floating Badge */}
             <GlassCard className="absolute bottom-20 -left-10 p-4 rounded-2xl max-w-[200px] animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Globe size={20}/></div>
                   <div>
                     <p className="text-xs text-gray-500 font-bold uppercase">Ranked #1</p>
                     <p className="text-sm font-bold text-slate-800">Top Preschool</p>
                   </div>
                </div>
             </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. TEXT REVEAL SECTION
// ==========================================
const TextRevealSection = () => {
  const containerRef = useRef(null);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation logic here (simplified for React without SplitText plugin)
      gsap.fromTo(".reveal-text span", 
        { opacity: 0.1, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.05, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 1
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const text = "We believe that every child is born with vivid imagination and a hunger for knowledge. Our mission is to feed that hunger.";

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-20 bg-white text-slate-900 min-h-[80vh] flex items-center">
      <div className="max-w-[90vw] mx-auto">
        <p className="reveal-text text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight">
          {text.split(" ").map((word, i) => (
            <span key={i} className="inline-block mr-[0.25em]">{word}</span>
          ))}
        </p>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-200 pt-10">
           {[
             { label: "Founded", value: "1998" },
             { label: "Students", value: "25k+" },
             { label: "Campuses", value: "14" },
             { label: "Rating", value: "4.9/5" },
           ].map((stat, i) => (
             <div key={i}>
               <div className="text-3xl font-bold font-serif">{stat.value}</div>
               <div className="text-xs uppercase tracking-widest text-slate-500 mt-1">{stat.label}</div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 5. HORIZONTAL SCROLL GALLERY
// ==========================================
const projects = [
  { title: "Artistic\nExpression", subtitle: "Creative Wing", img: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?q=80&w=1974&auto=format&fit=crop" },
  { title: "Physical\nPlayground", subtitle: "Active Zone", img: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop" },
  { title: "Digital\nLearning", subtitle: "Tech Hub", img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop" },
  { title: "Nature\nWalks", subtitle: "Eco Garden", img: "https://images.unsplash.com/photo-1566938064504-a38b58a36715?q=80&w=2070&auto=format&fit=crop" }
];

const HorizontalScroll = () => {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const totalWidth = sectionRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      
      gsap.to(sectionRef.current, {
        x: () => -(totalWidth - windowWidth),
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        }
      });
    }, triggerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={triggerRef} className="relative h-screen bg-slate-900 overflow-hidden text-white">
      {/* Background Text */}
      <div className="absolute top-10 left-10 text-[20vw] leading-none font-black text-slate-800 pointer-events-none whitespace-nowrap opacity-30 select-none">
        DISCOVER
      </div>

      <div ref={sectionRef} className="flex h-full w-fit items-center px-[10vw]">
        {projects.map((item, index) => (
          <div key={index} className="w-[80vw] md:w-[60vw] h-[70vh] flex-shrink-0 px-4 md:px-8 relative group">
            <div className="w-full h-full relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <span className="text-orange-400 font-mono text-xs uppercase tracking-widest mb-2 block">{item.subtitle}</span>
                <h2 className="text-5xl md:text-7xl font-bold leading-none whitespace-pre-line">{item.title}</h2>
              </div>
            </div>
            {/* Number Indicator */}
            <div className="absolute -top-12 left-8 text-6xl font-serif italic text-slate-700">0{index + 1}</div>
          </div>
        ))}
        {/* End Card */}
        <div className="w-[50vw] h-[70vh] flex-shrink-0 flex items-center justify-center">
            <div className="text-center">
                <h3 className="text-4xl font-bold mb-6">See More</h3>
                <button className="w-20 h-20 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"><ArrowUpRight size={32}/></button>
            </div>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 6. VERTICAL PARALLAX GRID
// ==========================================
const ParallaxGrid = () => {
  const containerRef = useRef(null);
  const col1 = useRef(null);
  const col2 = useRef(null);
  const col3 = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Different speeds for different columns create parallax
      gsap.to(col1.current, { y: -150, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(col2.current, { y: 150, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      gsap.to(col3.current, { y: -100, ease: "none", scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 } });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const images = [
     "https://images.unsplash.com/photo-1596464716127-f9a8759d1d5a?q=80&w=600",
     "https://images.unsplash.com/photo-1544767222-14d797686523?q=80&w=600",
     "https://images.unsplash.com/photo-1610502778270-3882f094eb29?q=80&w=600",
     "https://images.unsplash.com/photo-1606092195730-5d7b9af1ef4d?q=80&w=600",
     "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?q=80&w=600",
     "https://images.unsplash.com/photo-1501002019904-749c95d82084?q=80&w=600"
  ];

  return (
    <section ref={containerRef} className="py-32 bg-slate-50 overflow-hidden relative z-20">
      <div className="text-center mb-24 relative z-10 px-4">
        <h2 className="text-xs font-bold tracking-[0.5em] text-orange-600 uppercase mb-4">Gallery</h2>
        <p className="text-4xl md:text-6xl font-serif text-slate-800">Moments of Joy</p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-[1400px] mx-auto px-4 h-[120vh] overflow-hidden">
        {/* Col 1 */}
        <div ref={col1} className="flex flex-col gap-8 -mt-20">
          {images.slice(0, 2).map((src, i) => (
            <div key={i} className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img src={src} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {/* Col 2 */}
        <div ref={col2} className="flex flex-col gap-8 pt-20">
          {images.slice(2, 4).map((src, i) => (
            <div key={i} className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img src={src} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        {/* Col 3 */}
        <div ref={col3} className="flex flex-col gap-8 -mt-10">
          {images.slice(4, 6).map((src, i) => (
            <div key={i} className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
                <img src={src} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 7. DARK SHOWCASE & FOOTER
// ==========================================
const Footer = () => {
    return (
        <footer className="bg-black text-white pt-32 pb-12 rounded-t-[3rem] -mt-12 relative z-30">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center">
                <div className="mb-12">
                    <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold animate-pulse">
                        <Rocket />
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-6">Ready to join?</h2>
                    <p className="text-slate-400 max-w-lg mx-auto text-lg">Enrollment for the next academic year is now open. Schedule a visit today.</p>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center mb-20">
                    <button className="px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">Book a Tour</button>
                    <button className="px-8 py-4 border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition-colors">Contact Us</button>
                </div>

                <div className="w-full border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
                    <p>© 2024 Kidearn Education.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Instagram</a>
                        <a href="#" className="hover:text-white">Twitter</a>
                        <a href="#" className="hover:text-white">LinkedIn</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

// ==========================================
// 8. APP EXPORT
// ==========================================
export default function ScrollStoryApp() {
  return (
    <main className="bg-white selection:bg-orange-500 selection:text-white">
      <ProgressBar />
      
      {/* 
        The LandingWrapper pins the hero while clouds open.
        Once the scroll distance is met, the pinning releases.
      */}
      <LandingWrapper>
        <Hero />
      </LandingWrapper>

      {/* Narrative Section */}
      <TextRevealSection />

      {/* Side Scroll Project Showcase */}
      <HorizontalScroll />

      {/* Vertical Parallax Grid */}
      <ParallaxGrid />

      {/* Final Call to Action */}
      <Footer />
    </main>
  );
}