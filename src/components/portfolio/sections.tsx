import { useEffect, useRef, useState } from "react";
import { Mail } from "lucide-react";
import { ScrollRevealParagraph } from "./scroll-reveal-paragraph";
import serviceFlash from "@/assets/service-flash.jpg";
import serviceCommunity from "@/assets/service-community.jpg";
import serviceSankaracharya from "@/assets/service-sankaracharya.jpg";
import serviceManager from "@/assets/service-manager.jpg";
import serviceBdirection from "@/assets/service-bdirection.jpg";
import serviceWorkspace from "@/assets/service-workspace.jpg";
export { Work } from "./work-carousel";

export function SectionTitle({
  light,
  bold,
  eyebrow,
  lightClass = "text-muted-foreground/50",
}: {
  light: string;
  bold: string;
  eyebrow?: string;
  lightClass?: string;
}) {
  return (
    <div className="mb-14">
      <h2 className="text-display text-5xl md:text-7xl">
        <span className={lightClass}>{light} </span>
        <span className="text-foreground">{bold}</span>
      </h2>
      {eyebrow ? (
        <p className="mt-4 text-xs tracking-[0.35em] uppercase text-muted-foreground">{eyebrow}</p>
      ) : null}
    </div>
  );
}

const awards = [
  {
    image: serviceFlash,
    title: "The Flash.in",
    desc: "A fast, modern digital platform delivering lightning-quick news, updates and content experiences.",
    tags: "Web • Content • Speed",
  },
  {
    image: serviceCommunity,
    title: "Sports & Cultural Community",
    desc: "A vibrant community platform bringing people together through sports events and cultural celebrations.",
    tags: "Community • Events • Culture",
  },
  {
    image: serviceSankaracharya,
    title: "Sree Sankaracharya Institute of Advanced Skills",
    desc: "Digital presence and solutions for the educational institution — campus, courses and community.",
    tags: "Education • Institution • Web",
  },
  {
    image: serviceManager,
    title: "The Manager LLP",
    desc: "A smart management dashboard for analytics, team coordination and data-driven decisions.",
    tags: "Dashboard • Analytics • SaaS",
  },
  {
    image: serviceBdirection,
    title: "B-Direction\u00a0group of company",
    desc: "Asset management and investment holding company — leading business strategy, investment operations and growth initiatives focused on performance and returns.",
    tags: "Investment • Asset Management • Growth",
  },
  {
    image: serviceWorkspace,
    title: "Workspace",
    desc: "A modern coworking space solution — booking, community and productivity under one roof.",
    tags: "Coworking • Booking • Space",
  },
];

export function Awards() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const xRef = useRef(0);
  const [x, setX] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;
      const total = wrap.offsetHeight - window.innerHeight;
      const progress = total > 0 ? -wrap.getBoundingClientRect().top / total : 0;
      const clamped = Math.min(1, Math.max(0, progress));
      const vw = document.documentElement.clientWidth;
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
      const first = cards[0];
      const last = cards[cards.length - 1];
      if (!first || !last) return;
      // Untransformed left edge of the track (its parent has no transform)
      const baseLeft = track.parentElement?.getBoundingClientRect().left ?? 0;
      // Start with the first card centered, end with the last card centered
      const startX = vw / 2 - (baseLeft + first.offsetLeft + first.offsetWidth / 2);
      const endX = vw / 2 - (baseLeft + last.offsetLeft + last.offsetWidth / 2);
      const newX = startX + (endX - startX) * clamped;
      setX(newX);
      xRef.current = newX;

      // 3D coverflow: rotate each card based on its distance from viewport center
      const untransformedLeft = baseLeft;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const center = untransformedLeft + card.offsetLeft + newX + card.offsetWidth / 2;
        const offset = Math.max(-1, Math.min(1, (center - vw / 2) / (vw / 2)));
        const depth = Math.abs(offset);
        card.style.transform = `rotateY(${offset * 38}deg) translateZ(${-depth * 140}px) scale(${1 - depth * 0.12})`;
        card.style.zIndex = String(100 - Math.round(depth * 50));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="awards" className="border-y border-border bg-secondary/25">
      <div ref={wrapRef} className="relative h-[240vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="mx-auto w-full max-w-6xl px-6">
            <SectionTitle light="MY " bold="VENTURES" eyebrow="" />
          </div>
          <div className="w-full">
            <div
              ref={trackRef}
              className="flex items-stretch gap-6 will-change-transform"
              style={{ transform: `translate3d(${x}px,0,0)`, perspective: "1400px" }}
            >
              {awards.map((a, i) => (
                <div
                  key={a.title}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="flex w-[78vw] shrink-0 will-change-transform sm:w-[52vw] md:w-[22rem]"
                >
                  <article className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-accent/60">
                    <div className="relative h-44 shrink-0 overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-semibold leading-snug">{a.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                      <p className="mt-auto pt-6 text-xs uppercase tracking-[0.18em] text-accent">{a.tags}</p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const aboutStats = [
  { target: 7, suffix: "+", label: "Years building" },
  { target: 40, suffix: "+", label: "Products shipped" },
  { target: 12, suffix: "", label: "Teams collaborated" },
] as const;

export function About() {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [counts, setCounts] = useState<number[]>(() => aboutStats.map((s) => s.target));

  useEffect(() => {
    const el = statsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let animated = false;

    const startCountUp = () => {
      animated = true;
      if (raf) cancelAnimationFrame(raf);
      const duration = 1400;
      const start = performance.now();
      setCounts(aboutStats.map(() => 1));
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCounts(aboutStats.map((s) => Math.round(1 + (s.target - 1) * eased)));
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          raf = 0;
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting && !animated) {
          startCountUp();
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > window.innerHeight) {
          animated = false;
          if (raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
          setCounts(aboutStats.map(() => 1));
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-28">
      <SectionTitle light="About" bold="Me" />
      <div className="max-w-3xl text-left">
        <ScrollRevealParagraph text="I have been working on building businesses and initiatives focused on skill development, technology, entrepreneurship, and creating opportunities for young people. I strongly believe that India’s greatest strength is its young population, and I want to contribute by helping young people develop practical skills, become employable, and pursue entrepreneurship. As a strategic-minded entrepreneur, my goal is to build organizations that create employment, encourage innovation, and contribute meaningfully to India’s economic and social development." />
      </div>
      <div ref={statsRef} className="mt-16 grid gap-10 sm:grid-cols-3">
        {aboutStats.map((stat, i) => (
          <div key={stat.label}>
            <p className="text-editorial text-5xl tabular-nums text-accent md:text-6xl">
              {counts[i] ?? stat.target}
              {stat.suffix}
            </p>
            <p className="text-editorial mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-32">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 opacity-40"
        style={{ background: "var(--gradient-glow)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-display text-5xl md:text-7xl">
          <span className="text-muted-foreground/50">Let&apos;s Work </span>
          <span>Together</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {"\n"}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="mailto:hello@akshay.dev"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Mail className="size-4" />CONNECT WITH ME
          </a>
        </div>
      </div>
    </section>
  );
}