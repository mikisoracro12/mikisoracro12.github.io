/**
 * Miki Sora portfolio — scroll reveals, nav, ambient network canvas
 * Visual language inspired by epiminds.com (dark + lavender, large type)
 */

(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ——— Mobile nav ——— */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const nav = document.querySelector(".nav");

  const closeMenu = () => {
    if (!menu || !toggle) return;
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle?.addEventListener("click", () => {
    const open = menu.hidden;
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ——— Nav scroll state ——— */
  const onScroll = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ——— Intersection reveals ——— */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  /* Hero extras that use .reveal should show quickly after paint */
  requestAnimationFrame(() => {
    document.querySelectorAll(".hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 180 + i * 90);
    });
  });

  /* ——— Ambient agent-network canvas (Epiminds-like atmosphere) ——— */
  const canvas = document.getElementById("orb-canvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let nodes = [];
  let raf = 0;
  let mouse = { x: 0.65, y: 0.35 };
  let t = 0;

  const ACCENT = { r: 127, g: 114, b: 169 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedNodes();
  }

  function seedNodes() {
    const count = Math.min(48, Math.floor((w * h) / 28000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 2.2,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX / w;
      mouse.y = e.clientY / h;
    },
    { passive: true }
  );

  function draw() {
    t += 0.008;
    ctx.clearRect(0, 0, w, h);

    /* Soft orbital glow following pointer (hero-side bias) */
    const gx = w * (0.55 + mouse.x * 0.25);
    const gy = h * (0.25 + mouse.y * 0.2);
    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.45);
    grad.addColorStop(0, `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.16)`);
    grad.addColorStop(0.45, `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},0.05)`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    /* Update & draw nodes */
    for (const n of nodes) {
      n.x += n.vx + Math.sin(t + n.pulse) * 0.08;
      n.y += n.vy + Math.cos(t * 0.9 + n.pulse) * 0.08;

      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;

      const alpha = 0.35 + 0.35 * Math.sin(t * 2 + n.pulse);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${alpha})`;
      ctx.fill();
    }

    /* Connections — multi-agent network feel */
    const linkDist = Math.min(160, w * 0.14);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          const opacity = (1 - dist / linkDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${ACCENT.r},${ACCENT.g},${ACCENT.b},${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else {
      draw();
    }
  });
})();
