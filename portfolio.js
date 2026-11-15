(() => {
  const customCursorEnabled = false;
  /** @type {"true" | "false" | "rand"} */
  const portraitBlinkEnabled = "rand";
  const shouldBlink =
    portraitBlinkEnabled === "true" ||
    (portraitBlinkEnabled === "rand" && Math.random() < 0.5);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const portal = document.querySelector(".scroll-portal");
  const portalImage = document.querySelector(".scroll-portal__image");
  const portrait = document.querySelector(".gallery");

  document.body.classList.toggle("custom-cursor-enabled", customCursorEnabled);

  if (shouldBlink && !reducedMotion && portrait) {
    const scheduleBlink = () => {
      window.setTimeout(() => {
        portrait.classList.add("is-blinking");
        window.setTimeout(() => {
          portrait.classList.remove("is-blinking");
          scheduleBlink();
        }, 220);
      }, 3500 + Math.random() * 3000);
    };

    scheduleBlink();
  }

  if (!reducedMotion && "IntersectionObserver" in window) {
    const revealTargets = document.querySelectorAll(
      ".hero-copy, .hero-visual, .seccion-titulo, .seccion-descripcion, .experiencia .columna, #proyectos .proyectos-contenedor .row > div, .pergaminos01, .contacto .rectangulo"
    );

    document.body.classList.add("motion-ready");

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealTargets.forEach((target) => {
      target.setAttribute("data-reveal", "");
      revealObserver.observe(target);
    });
  }

  if (!reducedMotion && portal && portalImage) {
    let ticking = false;

    const updatePortal = () => {
      const bounds = portal.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / bounds.height));
      const scale = 1 + progress * 1.7;
      portalImage.style.setProperty("--portal-scale", scale.toFixed(3));
      ticking = false;
    };

    const requestPortalUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updatePortal);
        ticking = true;
      }
    };

    window.addEventListener("scroll", requestPortalUpdate, { passive: true });
    window.addEventListener("resize", requestPortalUpdate);
    requestPortalUpdate();
  }

  const navbar = document.querySelector(".navbar");
  const sectionLinks = Array.from(
    document.querySelectorAll(".navbar-collapse .nav-link[href^='#']")
  )
    .map((link) => ({
      link,
      section: document.getElementById(link.getAttribute("href").slice(1))
    }))
    .filter(({ section }) => section);

  if (navbar && sectionLinks.length) {
    let activeSectionFrame = false;

    const updateActiveSection = () => {
      const scrollPadding = parseFloat(
        window.getComputedStyle(document.documentElement).scrollPaddingTop
      ) || 0;
      const activationLine = Math.max(
        navbar.getBoundingClientRect().height,
        scrollPadding
      ) + 1;
      let activeLink = sectionLinks[0].link;

      const isAtPageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;

      if (isAtPageBottom) {
        activeLink = sectionLinks[sectionLinks.length - 1].link;
      } else {
        sectionLinks.forEach(({ link, section }) => {
          if (section.getBoundingClientRect().top <= activationLine) {
            activeLink = link;
          }
        });
      }

      sectionLinks.forEach(({ link }) => {
        const isActive = link === activeLink;
        link.classList.toggle("active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });

      activeSectionFrame = false;
    };

    const requestActiveSectionUpdate = () => {
      if (!activeSectionFrame) {
        window.requestAnimationFrame(updateActiveSection);
        activeSectionFrame = true;
      }
    };

    window.addEventListener("scroll", requestActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", requestActiveSectionUpdate);
    requestActiveSectionUpdate();
  }

  document.querySelectorAll(".navbar-collapse .nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const menu = document.querySelector(".navbar-collapse.show");
      if (menu && window.bootstrap) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });
})();
