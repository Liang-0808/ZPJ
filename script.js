const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const navLinks = [...document.querySelectorAll(".site-nav a")];
const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");
const frameStack = document.querySelector("#frame-stack");

const portfolioFrames = [
  "1-01封面.png",
  "1-02-个人介绍.png",
  "1-03-目录.png",
  ...rangeFiles("1", 4, 29),
  ...rangeFiles("2", 1, 22),
  "3-01.png",
  "3-02.png",
  "4-01.png",
  "4-02.png",
  "99-封底.png",
];

const caseMap = {
  1: {
    title: "AI提效B端监管系统",
    kicker: "CASE 01 / B-END SYSTEM",
    files: rangeFiles("1", 4, 29),
    next: "2",
  },
  2: {
    title: "AI赋能政务驾驶舱系统",
    kicker: "CASE 02 / DATA COMMAND HUB",
    files: rangeFiles("2", 1, 22),
    next: "3",
  },
  3: {
    title: "AI飞行器智能座舱交互",
    kicker: "CASE 03 / INTELLIGENT COCKPIT",
    files: ["3-01.png", "3-02.png"],
    next: "4",
  },
  4: {
    title: "智能养老机器人硬件交互",
    kicker: "CASE 04 / SMART HARDWARE",
    files: ["4-01.png", "4-02.png"],
    next: null,
  },
};

function rangeFiles(prefix, start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => {
    const number = String(start + index).padStart(2, "0");
    return `${prefix}-${number}.png`;
  });
}

function observeReveals() {
  const items = document.querySelectorAll(".reveal");

  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  items.forEach((item) => revealObserver.observe(item));
}

function setupHeroBackground() {
  const introVideo = document.querySelector("#hero-video-intro");
  const loopVideo = document.querySelector("#hero-video-loop");
  const heroContent = document.querySelector(".hero-intro");

  if (!heroContent) return;

  let textVisible = false;
  let loopStarted = false;

  const revealText = () => {
    if (textVisible) return;
    textVisible = true;
    heroContent.classList.add("ready");
  };

  const startLoop = () => {
    if (!loopVideo || loopStarted) return;
    loopStarted = true;
    introVideo?.classList.remove("active");
    loopVideo.classList.add("active");
    loopVideo.currentTime = 0;
    loopVideo.play().catch(() => {});
  };

  if (!introVideo || !loopVideo || prefersReducedMotion) {
    revealText();
    startLoop();
    return;
  }

  window.setTimeout(revealText, 2000);

  introVideo.addEventListener("ended", () => {
    startLoop();
  });
  introVideo.addEventListener("error", () => {
    startLoop();
  });
  introVideo.addEventListener("canplay", () => {
    introVideo.play().catch(() => {
      startLoop();
    });
  }, { once: true });
}

function setupNavigation() {
  const header = document.querySelector(".site-header");
  const sections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);

  if (sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (!visibleEntry) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.hash === `#${visibleEntry.target.id}`);
        });
      },
      { rootMargin: "-34% 0px -54% 0px", threshold: 0.01 },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav?.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });

  if (header) {
    const updateHeader = () => {
      const shouldHide = window.scrollY > 120;
      header.classList.toggle("logo-hidden", shouldHide);
      document.body.classList.toggle("scrolled", shouldHide);
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }
}

function setupProjectTiles() {
  document.querySelectorAll(".project-tile").forEach((tile) => {
    tile.addEventListener("mousemove", (event) => {
      const rect = tile.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -7;
      const ry = ((x / rect.width) - 0.5) * 7;
      tile.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
      tile.style.setProperty("--my", `${(y / rect.height) * 100}%`);
      tile.style.setProperty("--rx", `${rx}deg`);
      tile.style.setProperty("--ry", `${ry}deg`);
    });

    tile.addEventListener("mouseleave", () => {
      tile.style.removeProperty("--rx");
      tile.style.removeProperty("--ry");
    });
  });
}

function setupProjectTransitions() {
  document.querySelectorAll(".project-tile").forEach((tile) => {
    tile.addEventListener("click", (event) => {
      if (
        prefersReducedMotion ||
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();

      const href = tile.href;
      const image = tile.querySelector("img");
      const rect = tile.getBoundingClientRect();
      const overlay = document.createElement("div");
      const imageWrap = document.createElement("div");
      const imageClone = document.createElement("img");
      const light = document.createElement("div");

      overlay.className = "project-transition-overlay";
      imageWrap.className = "transition-image";
      light.className = "transition-light";
      imageClone.src = image?.currentSrc || image?.src || "";
      imageClone.alt = "";

      overlay.style.setProperty("--transition-left", `${rect.left}px`);
      overlay.style.setProperty("--transition-top", `${rect.top}px`);
      overlay.style.setProperty("--transition-width", `${rect.width}px`);
      overlay.style.setProperty("--transition-height", `${rect.height}px`);

      imageWrap.append(imageClone);
      overlay.append(imageWrap, light);
      document.body.append(overlay);
      document.body.style.overflow = "hidden";

      window.requestAnimationFrame(() => {
        overlay.classList.add("active");
      });

      window.setTimeout(() => {
        window.location.assign(href);
      }, 760);
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll(".contact-copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        fallbackCopy(value);
      }
      button.classList.add("copied");
      window.setTimeout(() => button.classList.remove("copied"), 1200);
    });
  });
}

function fallbackCopy(value) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function setupCursorTrail() {
  const trail = document.querySelector(".cursor-trail");
  if (!trail || prefersReducedMotion) return;

  let last = 0;
  window.addEventListener("pointermove", (event) => {
    const now = performance.now();
    if (now - last < 42) return;
    last = now;

    const particleCount = Math.random() > 0.45 ? 2 : 1;

    for (let index = 0; index < particleCount; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 12 + Math.random() * 26;
      const offsetX = Math.cos(angle) * (3 + Math.random() * 7);
      const offsetY = Math.sin(angle) * (3 + Math.random() * 7);
      const dot = document.createElement("span");
      dot.className = "trail-dot";
      dot.style.left = `${event.clientX + offsetX}px`;
      dot.style.top = `${event.clientY + offsetY}px`;
      dot.style.setProperty("--drift-x", `${Math.cos(angle) * distance}px`);
      dot.style.setProperty("--drift-y", `${Math.sin(angle) * distance}px`);
      dot.style.setProperty("--particle-a-x", `${Math.cos(angle + 1.7) * (distance * 0.72)}px`);
      dot.style.setProperty("--particle-a-y", `${Math.sin(angle + 1.7) * (distance * 0.72)}px`);
      dot.style.setProperty("--particle-b-x", `${Math.cos(angle - 1.4) * (distance * 0.58)}px`);
      dot.style.setProperty("--particle-b-y", `${Math.sin(angle - 1.4) * (distance * 0.58)}px`);
      trail.append(dot);
      window.setTimeout(() => dot.remove(), 900);
    }
  });
}

function setupScrollStorytelling() {
  if (!document.body.classList.contains("home-page") || prefersReducedMotion) return;

  const storyConfig = [
    [".hero-media", 0.32],
    [".hero-intro", 0.42],
    [".works .section-title", 0.58],
    [".profile-title", 0.64],
    [".contact-title", 0.58],
    [".site-footer span", 0.36],
  ];

  const items = [];
  storyConfig.forEach(([selector, depth]) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (items.some((item) => item.element === element)) return;
      element.classList.add("story-item");
      items.push({ element, depth });
    });
  });

  if (!items.length) return;

  let ticking = false;

  const update = () => {
    const viewportHeight = window.innerHeight || 1;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - viewportHeight);
    const pageProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));

    document.body.style.setProperty("--page-progress", pageProgress.toFixed(4));
    items.forEach(({ element, depth }, index) => {
      const rect = element.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = (center - viewportHeight / 2) / viewportHeight;
      const visibility = Math.max(0, Math.min(1, 1 - Math.abs(distance) * 1.18));
      const eased = visibility * visibility * (3 - 2 * visibility);
      const side = index % 2 === 0 ? -1 : 1;
      const travel = 34 * depth;
      const x = side * (1 - eased) * 10 * depth;
      const y = -distance * travel;
      const z = (eased - 0.5) * 28 * depth;
      const rx = Math.max(-4, Math.min(4, distance * -3 * depth));
      const ry = side * (1 - eased) * 2 * depth;
      const scale = 0.985 + eased * 0.015;
      const blur = (1 - eased) * 0.35;
      const opacity = 0.82 + eased * 0.18;

      element.style.setProperty("--story-x", `${x.toFixed(2)}px`);
      element.style.setProperty("--story-y", `${y.toFixed(2)}px`);
      element.style.setProperty("--story-z", `${z.toFixed(2)}px`);
      element.style.setProperty("--story-rx", `${rx.toFixed(2)}deg`);
      element.style.setProperty("--story-ry", `${ry.toFixed(2)}deg`);
      element.style.setProperty("--story-scale", scale.toFixed(4));
      element.style.setProperty("--story-blur", `${blur.toFixed(2)}px`);
      element.style.setProperty("--story-opacity", opacity.toFixed(3));
      element.style.setProperty("--story-glow", eased.toFixed(3));
    });

    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

function setupFrameScrollEffects() {
  const frames = [...document.querySelectorAll(".portfolio-frame")];
  if (!frames.length || prefersReducedMotion) return;

  let ticking = false;
  const update = () => {
    const viewportCenter = window.innerHeight / 2;
    frames.forEach((frame) => {
      const rect = frame.getBoundingClientRect();
      const frameCenter = rect.top + rect.height / 2;
      const distance = Math.abs(frameCenter - viewportCenter);
      const visibility = Math.max(0, Math.min(1, 1 - distance / (window.innerHeight * 0.82)));
      const shift = Math.max(-1, Math.min(1, (frameCenter - viewportCenter) / window.innerHeight));
      frame.style.setProperty("--scroll-visibility", visibility.toFixed(3));
      frame.style.setProperty("--scroll-shift", shift.toFixed(3));
    });
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}

function setupNextProjectPrompt(currentCase) {
  const prompt = document.querySelector("#next-project-prompt");
  if (!prompt || !currentCase) return;

  const nextCase = caseMap[currentCase]?.next;
  if (nextCase) {
    const nextItem = caseMap[nextCase];
    prompt.href = `project.html?case=${nextCase}`;
    prompt.querySelector("strong").textContent = nextItem.title;
  } else {
    prompt.href = "index.html#works";
    prompt.querySelector("strong").textContent = "返回精选作品";
  }

  const promptLabel = prompt.querySelector("span");
  const promptTitle = prompt.querySelector("strong");
  if (promptLabel) {
    promptLabel.textContent = "\u7ee7\u7eed\u4e0b\u6ed1\u8fdb\u5165";
  }
  if (promptTitle) {
    promptTitle.textContent = nextCase ? `\u4e0b\u4e00\u4e2a\u9879\u76ee 0${nextCase}` : "\u8fd4\u56de\u7cbe\u9009\u4f5c\u54c1";
  }

  let canAdvance = false;
  let lastAdvance = 0;
  const updatePrompt = () => {
    const distanceToBottom = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight);
    const revealDistance = Math.min(window.innerHeight * 0.6, 540);
    canAdvance = distanceToBottom < 160;
    prompt.classList.toggle("visible", distanceToBottom < revealDistance);
  };

  window.addEventListener("scroll", updatePrompt, { passive: true });
  window.addEventListener("resize", updatePrompt);
  window.addEventListener("load", updatePrompt);
  window.addEventListener(
    "wheel",
    (event) => {
      if (!canAdvance || event.deltaY <= 0) return;
      const now = Date.now();
      if (now - lastAdvance < 700) return;
      lastAdvance = now;
      window.location.href = prompt.href;
    },
    { passive: true },
  );
  updatePrompt();
  window.setTimeout(updatePrompt, 700);
}

function renderFrameStack(files) {
  if (!frameStack) return;
  const fragment = document.createDocumentFragment();

  files.forEach((file, index) => {
    const figure = document.createElement("figure");
    figure.className = "portfolio-frame reveal";

    const image = document.createElement("img");
    image.src = `assets/zpj/${file}`;
    image.width = 1920;
    image.height = 1080;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    image.alt = file.replace(".png", "");

    const caption = document.createElement("figcaption");
    caption.textContent = file.replace(".png", "");

    figure.append(image, caption);
    fragment.append(figure);
  });

  frameStack.replaceChildren(fragment);
}

function setupViewerPages() {
  const viewerType = document.body.dataset.viewer;
  if (!viewerType) return;

  if (viewerType === "portfolio") {
    renderFrameStack(portfolioFrames);
    setupFrameScrollEffects();
    return;
  }

  const caseId = new URLSearchParams(window.location.search).get("case") || "1";
  const item = caseMap[caseId] || caseMap[1];
  document.title = `${item.title} - 刘彦美 UI/UX Design Portfolio`;
  renderFrameStack(item.files);
  setupFrameScrollEffects();
  setupNextProjectPrompt(caseId);
}

setupViewerPages();
setupHeroBackground();
observeReveals();
setupNavigation();
setupProjectTiles();
setupProjectTransitions();
setupCopyButtons();
setupCursorTrail();
setupScrollStorytelling();
