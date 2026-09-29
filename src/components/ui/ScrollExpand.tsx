import React, { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollExpand.css';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollExpandProps {
  src?: string;
  mediaType?: 'image' | 'video';
  customMedia?: React.ReactNode;
  poster?: string;
  alt?: string;
  title?: React.ReactNode;
  scrollHint?: React.ReactNode;
  startWidth?: number;
  startHeight?: number;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  scrollDistance?: number;
  holdDistance?: number;
  smoothing?: number;
  overlayScrim?: number;
  useWindowScroll?: boolean;
  enabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = '',
  mediaType = 'image',
  customMedia,
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 52,
  startHeight = 62,
  startRadius = 28,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.55,
  useWindowScroll = false,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<any>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const propsRef = useRef({
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  });

  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled,
  };

  const applyProgress = useCallback((p: number) => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.3, 0.82, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-32 * out}px, 0) scale(${1 + 0.05 * out})`;
      titleRef.current.style.pointerEvents = 'none';
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.15, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${10 * gone}px, 0)`;
      hintRef.current.style.pointerEvents = 'none';
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.65, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${20 * (1 - inn)}px, 0)`;
      overlayRef.current.style.pointerEvents = inn > 0.5 ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Apply initial resting state
    applyProgress(0);

    if (useWindowScroll) {
      const c = propsRef.current;
      const total = Math.max(0.1, c.scrollDistance + c.holdDistance);
      const expandRatio = c.scrollDistance / total;

      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: root,
          start: 'top top',
          end: `+=${total * 100}%`,
          pin: stage,
          pinSpacing: true,
          scrub: reduceMotion ? false : c.smoothing > 0 ? c.smoothing * 8 : 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = clamp(self.progress / expandRatio, 0, 1);
            applyProgress(p);
          },
        });
      }, root);

      return () => {
        ctx.revert();
      };
    } else {
      let raf = 0;
      let current = 0;
      let target = 0;
      let stageH = 0;
      let running = false;

      const measure = () => {
        const c = propsRef.current;
        stageH = root.clientHeight;
        if (stageH <= 0) return;
        stage.style.height = `${stageH}px`;
        track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;
      };

      const readProgress = () => {
        const c = propsRef.current;
        if (!c.enabled) return 1;
        const span = stageH * Math.max(0.01, c.scrollDistance);
        return clamp(root.scrollTop / span, 0, 1);
      };

      const tick = () => {
        const c = propsRef.current;
        const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
        current += (target - current) * k;
        if (Math.abs(target - current) < 0.0004) {
          current = target;
          running = false;
        }
        applyProgress(current);
        raf = running ? requestAnimationFrame(tick) : 0;
      };

      const kick = () => {
        if (running) return;
        running = true;
        if (!raf) raf = requestAnimationFrame(tick);
      };

      const onScroll = () => {
        target = readProgress();
        if (propsRef.current.smoothing <= 0 || reduceMotion) {
          current = target;
          applyProgress(current);
          return;
        }
        kick();
      };

      const onResize = () => {
        measure();
        target = readProgress();
        current = target;
        applyProgress(current);
      };

      measure();
      target = readProgress();
      current = target;
      applyProgress(current);

      root.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);

      return () => {
        if (raf) cancelAnimationFrame(raf);
        root.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onResize);
      };
    }
  }, [applyProgress, useWindowScroll]);

  const media = customMedia ? (
    <div ref={mediaRef} className="scroll-expand__media overflow-hidden">
      {customMedia}
    </div>
  ) : mediaType === 'video' ? (
    <video
      ref={mediaRef}
      className="scroll-expand__media"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    />
  ) : src ? (
    <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} draggable={false} />
  ) : (
    <div ref={mediaRef} className="scroll-expand__media bg-[#171515]" />
  );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
