// Baeroh Design Studio - Interactivity & Animations
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  // Branded loader: full cinematic entrance once per browser session.
  const siteLoader = document.getElementById('site-loader');
  if (siteLoader) {
    const loaderEnabled = document.documentElement.classList.contains('site-loader-enabled');
    const loaderProgress = siteLoader.querySelector('.site-loader__progress');

    if (!loaderEnabled) {
      siteLoader.remove();
    } else {
      let loaderComplete = false;
      let currentProgress = 0;
      let progressTimer = null;
      const loaderStartTime = performance.now();
      const trackedImages = Array.from(document.images).filter(image => !image.closest('.site-loader'));

      try {
        sessionStorage.setItem('baeroh-loader-seen', 'true');
      } catch (error) {
        // The loader still works when storage is unavailable.
      }

      const setLoaderProgress = value => {
        currentProgress = Math.max(currentProgress, Math.min(1, value));
        if (loaderProgress) {
          loaderProgress.style.transform = `scaleX(${currentProgress})`;
        }
      };

      const updateProgressFromAssets = () => {
        if (loaderComplete || trackedImages.length === 0) return;
        const completedImages = trackedImages.filter(image => image.complete).length;
        const assetRatio = completedImages / trackedImages.length;
        setLoaderProgress(0.12 + (assetRatio * 0.73));
      };

      const finishSiteLoader = () => {
        if (loaderComplete) return;
        loaderComplete = true;
        window.clearInterval(progressTimer);
        setLoaderProgress(1);

        window.setTimeout(() => {
          siteLoader.classList.add('is-content-leaving');

          window.setTimeout(() => {
            siteLoader.classList.add('is-leaving');
            document.documentElement.classList.remove('site-loader-enabled');

            window.setTimeout(() => siteLoader.remove(), 520);
          }, 250);
        }, 150);
      };

      trackedImages.forEach(image => {
        if (!image.complete) {
          image.addEventListener('load', updateProgressFromAssets, { once: true });
          image.addEventListener('error', updateProgressFromAssets, { once: true });
        }
      });

      window.requestAnimationFrame(() => {
        siteLoader.classList.add('is-active');
        setLoaderProgress(0.06);
        updateProgressFromAssets();
      });

      progressTimer = window.setInterval(() => {
        const elapsedRatio = Math.min(1, (performance.now() - loaderStartTime) / 3200);
        const easedProgress = 0.12 + (0.73 * (1 - Math.pow(1 - elapsedRatio, 2)));
        setLoaderProgress(Math.min(0.85, easedProgress));
        updateProgressFromAssets();
      }, 120);

      if (document.readyState === 'complete') {
        window.setTimeout(finishSiteLoader, 450);
      } else {
        window.addEventListener('load', () => {
          const minimumDisplay = 900;
          const remainingTime = Math.max(0, minimumDisplay - (performance.now() - loaderStartTime));
          window.setTimeout(finishSiteLoader, remainingTime);
        }, { once: true });
      }

      window.setTimeout(finishSiteLoader, 5000);
    }
  }

  // Navigation & Modal Setup
  const header = document.querySelector('header');
  const modal = document.querySelector('.project-modal');
  const isTransparentInit = header ? header.classList.contains('header-transparent') : false;
  let headerScrollTicking = false;

  const handleScroll = () => {
    if (!header) return;
    const isModalActive = modal ? modal.classList.contains('active') : false;
    const scrollTop = isModalActive ? modal.scrollTop : window.scrollY;

    if (scrollTop > 50) {
      header.classList.add('scrolled');
      header.classList.remove('header-transparent');
    } else {
      header.classList.remove('scrolled');
      if (isTransparentInit || isModalActive) {
        header.classList.add('header-transparent');
      } else {
        header.classList.remove('header-transparent');
      }
    }
  };
  const requestHeaderUpdate = () => {
    if (headerScrollTicking) return;
    headerScrollTicking = true;
    window.requestAnimationFrame(() => {
      handleScroll();
      headerScrollTicking = false;
    });
  };

  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  if (modal) {
    modal.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  }
  handleScroll(); // Call once initially

  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    mobileNav.inert = !mobileNav.classList.contains('active');

    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      const isMenuOpen = mobileNav.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', String(isMenuOpen));
      mobileNav.setAttribute('aria-hidden', String(!isMenuOpen));
      mobileNav.inert = !isMenuOpen;
      header?.classList.toggle('menu-open', isMenuOpen);
      document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking links
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.inert = true;
        header?.classList.remove('menu-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Hero Slider
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentSlide = 0;
  let slideInterval;
  let progressVisibilityTimer;

  if (slides.length > 0) {
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Show slide ${idx + 1} of ${slides.length}`);
        dot.setAttribute('aria-current', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = document.querySelectorAll('.slider-dot');

    const goToSlide = (idx) => {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      currentSlide = idx;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
        dots.forEach((dot, dotIndex) => {
          dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
        });
      }
      resetInterval();
    };

    const nextSlide = () => {
      goToSlide((currentSlide + 1) % slides.length);
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 10000); // 10 seconds per slide
    };

    resetInterval();
    brieflyRevealProgress();

    // Arrows navigation support
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
      });
      nextBtn.addEventListener('click', () => {
        goToSlide((currentSlide + 1) % slides.length);
      });
    }

    // Touch Swipe support
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
      let touchStartX = 0;
      let touchEndX = 0;
      
      sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
      
      const handleSwipe = () => {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
          // Swiped left, go to next slide
          goToSlide((currentSlide + 1) % slides.length);
        } else if (touchEndX > touchStartX + threshold) {
          // Swiped right, go to previous slide
          goToSlide((currentSlide - 1 + slides.length) % slides.length);
        }
      };
    }
  }

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '200px 0px',
    threshold: 0.01
  };

  const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appeared');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 300) {
      el.classList.add('appeared');
    } else {
      animationObserver.observe(el);
    }
  });

  // Homepage story split: activate imagery and supporting copy on hover or focus.
  const storySplitRoot = document.querySelector('[data-story-split]');
  if (storySplitRoot) {
    const storyPanels = Array.from(storySplitRoot.querySelectorAll('[data-story-panel]'));
    const storySwitch = storySplitRoot.querySelector('[data-story-switch]');
    const storySwitchLabel = storySwitch?.querySelector('[data-story-switch-label]');
    const storySwitchArrow = storySwitch?.querySelector('[data-story-switch-arrow]');

    const updateStorySwitch = panelName => {
      if (!storySwitch || !storySwitchLabel || !storySwitchArrow) return;

      if (panelName === 'origin') {
        storySwitchLabel.textContent = 'EXPLORE WHY BAEROH';
        storySwitchArrow.textContent = '→';
        storySwitch.dataset.target = 'name';
        storySwitch.setAttribute('aria-label', 'Explore Why Baeroh');
        storySwitch.setAttribute('aria-controls', 'story-panel-name');
      } else if (panelName === 'name') {
        storySwitchLabel.textContent = 'EXPLORE THE STORY';
        storySwitchArrow.textContent = '←';
        storySwitch.dataset.target = 'origin';
        storySwitch.setAttribute('aria-label', 'Explore the story behind Baeroh');
        storySwitch.setAttribute('aria-controls', 'story-panel-origin');
      } else {
        storySwitchLabel.textContent = 'MOVE TO EXPLORE';
        storySwitchArrow.textContent = '↔';
        storySwitch.dataset.target = 'origin';
        storySwitch.setAttribute('aria-label', 'Explore the story panels');
        storySwitch.setAttribute('aria-controls', 'story-panel-origin story-panel-name');
      }
    };

    const setActiveStoryPanel = panelName => {
      if (panelName) {
        storySplitRoot.dataset.active = panelName;
      } else {
        delete storySplitRoot.dataset.active;
      }
      updateStorySwitch(panelName);
    };

    storyPanels.forEach(panel => {
      const panelName = panel.dataset.storyPanel;

      panel.addEventListener('pointerenter', () => setActiveStoryPanel(panelName));

      panel.addEventListener('focusin', () => setActiveStoryPanel(panelName));
    });

    storySplitRoot.addEventListener('pointerleave', () => setActiveStoryPanel(null));

    storySplitRoot.addEventListener('focusout', () => {
      window.requestAnimationFrame(() => {
        const focusedPanel = document.activeElement.closest?.('[data-story-panel]');
        setActiveStoryPanel(storySplitRoot.contains(document.activeElement) && focusedPanel
          ? focusedPanel.dataset.storyPanel
          : null);
      });
    });

    storySwitch?.addEventListener('click', () => {
      const targetPanel = storyPanels.find(panel => panel.dataset.storyPanel === storySwitch.dataset.target);
      if (!targetPanel) return;

      setActiveStoryPanel(targetPanel.dataset.storyPanel);
      targetPanel.focus({ preventScroll: true });
    });

    updateStorySwitch(null);

  }


  // Accessible horizontal process tabs with persistent selection.
  const processTabsRoot = document.querySelector('[data-process-tabs]');
  if (processTabsRoot) {
    const processTabs = Array.from(processTabsRoot.querySelectorAll('[role="tab"]'));
    const processPanels = Array.from(processTabsRoot.querySelectorAll('[role="tabpanel"]'));
    const processTimeline = processTabsRoot.querySelector('.process-timeline');
    const processScroller = processTabsRoot.querySelector('[data-process-scroller]');
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const desktopProcessQuery = window.matchMedia('(min-width: 768px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeProcessIndex = Math.max(0, processTabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
    let processResizeTicking = false;

    const scrollProcessTabIntoView = (tab, smooth = true) => {
      if (!processScroller || processScroller.scrollWidth <= processScroller.clientWidth + 1) return;
      const tabBounds = tab.getBoundingClientRect();
      const scrollerBounds = processScroller.getBoundingClientRect();
      const centeredLeft = processScroller.scrollLeft + tabBounds.left - scrollerBounds.left
        - ((scrollerBounds.width - tabBounds.width) / 2);

      processScroller.scrollTo({
        left: Math.max(0, centeredLeft),
        behavior: smooth && !reducedMotionQuery.matches ? 'smooth' : 'auto'
      });
    };

    const setActiveProcessTab = (index, { moveFocus = false, scroll = true } = {}) => {
      const nextIndex = Math.max(0, Math.min(index, processTabs.length - 1));
      activeProcessIndex = nextIndex;

      processTabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === nextIndex;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
      });

      processPanels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === nextIndex;
        panel.classList.toggle('is-active', isActive);
        panel.setAttribute('aria-hidden', String(!isActive));
      });

      const progress = processTabs.length > 1 ? (nextIndex / (processTabs.length - 1)) * 100 : 0;
      processTimeline.style.setProperty('--process-progress', `${progress}%`);

      const activeTab = processTabs[nextIndex];
      if (moveFocus) activeTab.focus({ preventScroll: true });
      if (scroll) window.requestAnimationFrame(() => scrollProcessTabIntoView(activeTab));
    };

    processTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => setActiveProcessTab(index));
      tab.addEventListener('focus', () => setActiveProcessTab(index));
      tab.addEventListener('pointerenter', () => {
        if (finePointerQuery.matches && desktopProcessQuery.matches) {
          setActiveProcessTab(index, { scroll: false });
        }
      });

      tab.addEventListener('keydown', event => {
        let nextIndex = null;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % processTabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + processTabs.length) % processTabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = processTabs.length - 1;
        if (nextIndex === null) return;

        event.preventDefault();
        setActiveProcessTab(nextIndex, { moveFocus: true });
      });
    });

    window.addEventListener('resize', () => {
      if (processResizeTicking) return;
      processResizeTicking = true;
      window.requestAnimationFrame(() => {
        scrollProcessTabIntoView(processTabs[activeProcessIndex], false);
        processResizeTicking = false;
      });
    }, { passive: true });

    setActiveProcessTab(activeProcessIndex, { scroll: false });
  }

  // Project Database
  const projects = {
    'view-from-the-top': {
      title: 'The View from the Top',
      subtitle: 'Executive Workplace Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'INTERIOR · WORKPLACE · 2026',
      image: 'assets/view-from-the-top.jpeg',
      description: 'Leadership needs somewhere to think clearly. This room gives it, holding privacy and openness in the same frame without ever choosing between them.',
      details: 'Every element is positioned with deliberate intent, creating an atmosphere of quiet, powerful focus where key decisions are refined.',
      detailsSecondary: 'Every element is positioned with deliberate intent, creating an atmosphere of quiet, powerful focus where key decisions are refined.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Perspective of the executive desk space, showing the integration of leather detailing and functional technology setup.',
      gallery: [
        'assets/view-from-the-top.jpeg'
      ]
    },
    'gentle-awakening': {
      title: 'The Art of a Gentle Awakening',
      subtitle: 'Bedroom Interior Design',
      location: 'Jaipur, Rajasthan',
      year: '2025',
      category: 'INTERIOR · RESIDENTIAL · 2025',
      image: 'assets/gentle-awakening.png',
      description: 'A hand-chosen mural lifts the eye to a bird mid-flight, so the first thing the morning offers is a little height.',
      details: 'Anchored by dark wainscoting and delicate natural textures, this corner brings peace to your mornings and quiet calm to your nights.',
      detailsSecondary: 'Anchored by dark wainscoting and delicate natural textures, this corner brings peace to your mornings and quiet calm to your nights.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Bedside detail featuring a soft cream floral bouquet, textured wallpaper design, and elegant wainscoting.',
      gallery: [
        'assets/gentle-awakening.png'
      ]
    },
    'canvas-ambition': {
      title: 'A Canvas for Ambition',
      subtitle: 'Executive Workplace Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'INTERIOR · WORKPLACE · 2026',
      image: 'assets/canvas-ambition.jpeg',
      description: 'Built as much for the conversation that changes a decision as for the hours of focus that follow it.',
      details: 'Clean lines of modern technology meet the grounding warmth of tailored, sophisticated tones, wrapped in soft ambient light.',
      detailsSecondary: 'Clean lines of modern technology meet the grounding warmth of tailored, sophisticated tones, wrapped in soft ambient light.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The commanding high-back chair and workplace detail featuring modern technology and warm, sophisticated tones.',
      gallery: [
        'assets/canvas-ambition.jpeg'
      ]
    },
    'executive-studio': {
      title: 'Contemporary Executive Studio',
      subtitle: 'Executive Studio Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'INTERIOR · WORKPLACE · 2026',
      image: 'assets/unnamed (2).webp',
      description: 'Curved walls and a continuous line of light give a private office its authority, without a single hard edge.',
      details: 'Floor-to-ceiling glass-enclosed office with dark herringbone flooring, leading into a cohesive open-concept workplace.',
      detailsSecondary: 'Floor-to-ceiling glass-enclosed office with dark herringbone flooring, leading into a cohesive open-concept workplace.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The floor-to-ceiling glass office, featuring dark herringbone floors, and the outer open-concept workplace.',
      gallery: [
        'assets/unnamed (2).webp',
        'assets/unnamed (3).webp'
      ]
    },
    'vanity-nook': {
      title: 'Minimalist Vanity Nook',
      subtitle: 'Vanity Nook Design',
      location: 'Jaipur, Rajasthan',
      year: '2025',
      category: 'INTERIOR · RESIDENTIAL · 2025',
      image: 'assets/unnamed (3).webp',
      description: 'A dressing corner in warm timber, proportioned so the smallest daily routine feels unhurried.',
      details: 'Set against a rich terracotta backdrop, floating timber surfaces and circular geometries create an intimate personal sanctuary.',
      detailsSecondary: 'Set against a rich terracotta backdrop, floating timber surfaces and circular geometries create an intimate personal sanctuary.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The vanity nook detail, showing the circular mirror, terracotta backdrop, and the floating wood table.',
      gallery: [
        'assets/unnamed (3).webp',
        'assets/unnamed (2).webp'
      ]
    },
    'open-office': {
      title: 'Sleek and Sophisticated Open Office',
      subtitle: 'Open Office Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'INTERIOR · WORKPLACE · 2026',
      image: 'assets/unnamed.webp',
      description: 'An open floor planned so people can gather or concentrate by choice, and the room reads the same at nine in the morning as it does at six.',
      details: 'Fluid LED ceiling profiles and delicate hanging planters introduce nature and spatial clarity across workstations.',
      detailsSecondary: 'Fluid LED ceiling profiles and delicate hanging planters introduce nature and spatial clarity across workstations.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The open office workstations, demonstrating the fusion of clean minimal desk surfaces, ergonomic chairs, and delicate ceiling greenery.',
      gallery: [
        'assets/unnamed.webp',
        'assets/unnamed (1).webp'
      ]
    },
    'timeless-design-details': {
      title: 'Timeless Design Details',
      subtitle: 'Workplace Detail & Utility',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'INTERIOR · WORKPLACE · 2026',
      image: 'assets/unnamed (5).webp',
      description: 'A forgotten corner turned into a working utility space. Proof that nothing in a plan is too small to deserve intention.',
      details: 'Delicate linen drapes, ambient illumination, and oak accents demonstrate how minimal styling brings purpose to utility corners.',
      detailsSecondary: 'Delicate linen drapes, ambient illumination, and oak accents demonstrate how minimal styling brings purpose to utility corners.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Curated corner showing custom utility shelving and warm ambient light detailing.',
      gallery: [
        'assets/unnamed (5).webp',
        'assets/unnamed (2).webp'
      ]
    },
    'sophisticated-meeting-space': {
      title: 'Sophisticated Meeting Space',
      subtitle: 'Meeting Space Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'INTERIOR · WORKPLACE · 2026',
      image: 'assets/unnamed (4).webp',
      description: 'The room a visitor meets first. It sets the tone before anyone has said a word.',
      details: 'Acoustic slatted timber walls and adaptive warm lighting combine to create an atmosphere of quiet confidence and effortless collaboration.',
      detailsSecondary: 'Acoustic slatted timber walls and adaptive warm lighting combine to create an atmosphere of quiet confidence and effortless collaboration.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Close-up of the meeting table and wood slatted feature wall, illustrating the harmony of corporate structure and natural materials.',
      gallery: [
        'assets/unnamed (4).webp',
        'assets/unnamed (3).webp'
      ]
    },
    'polene-store': {
      title: 'Polène Flagship Store',
      subtitle: 'Luxury Retail Landmark',
      location: 'Paris, France',
      year: '2025',
      category: 'INTERIOR · COMMERCIAL · 2025',
      image: 'assets/unnamed.webp',
      description: 'Rather than a conventional retail interior, the Polène Flagship Store is conceived as an environment to be felt as much as seen, a place where material, light, and proportion come together to create a calm, tactile landscape that invites visitors to slow down, engage the senses, and experience the enduring relationship between form, hand, and material.',
      details: 'The store layout utilizes organic curves that guide visitors through a series of sculpted spaces. Local sand-colored limestone forms the monumental display tables, while high ceilings and concealed lighting mimic the softness of natural daylight. There is a deliberate emphasis on negative space, allowing the leather handbags to stand out as pieces of sculpture in a landscape of quiet luxury.',
      detailsSecondary: 'The design emphasizes smooth sand-plaster arches and carved timber shelving. By integrating natural materials and curved geometries, the space offers an immersive retail experience that celebrates tactile exploration and fine leather craftsmanship.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Sculptural display platforms carved from local French limestone, mimicking natural rock formations.',
      gallery: [
        'assets/unnamed.webp',
        'assets/unnamed (5).webp'
      ]
    },
    'heatherhill-house': {
      title: 'Heatherhill Beach House',
      subtitle: 'Private Sanctuary',
      location: 'Zealand, Denmark',
      year: '2023',
      category: 'INTERIOR · RESIDENTIAL · 2023',
      image: 'assets/unnamed (2).webp',
      description: 'Set in the rolling hills of Heatherhill, this private residence is designed to frame the wild seascape. Simple geometries, natural materials, and a muted color palette create a sense of quiet and security in a rugged environment.',
      details: 'The house follows the contours of the landscape, minimizing its footprint. Internally, a central fireplace divider anchors the living space. Large sliding glass doors slide completely into the walls, creating an uninterrupted transition to the outdoor terrace. The styling features warm tones, custom hemp rugs, and raw solid timber furniture, responding directly to the natural site conditions.',
      detailsSecondary: 'Natural light floods the open-plan kitchen and living areas, casting soft shadows across the raw concrete floors. Every design choice, from the raw timber joints to the linen curtains, reinforces a connection to the coastal environment.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The living area framing the coastal landscape, where the inside and outside merge into a single serene space.',
      gallery: [
        'assets/unnamed (2).webp',
        'assets/unnamed.webp'
      ]
    },
    'reykjavik-apartment': {
      title: 'Reykjavik Apartment',
      subtitle: 'Urban Residence',
      location: 'Reykjavik, Iceland',
      year: '2024',
      category: 'INTERIOR · RESIDENTIAL · 2024',
      image: 'assets/unnamed (3).webp',
      description: 'A minimal, calm apartment in the center of Reykjavik. The renovation focused on clarifying the layout, bringing in light, and curating tactile materials that respond to the volcanic light of Iceland.',
      details: 'The design strategy stripped back modern additions to reveal the structural concrete columns, which are balanced with warm dark-stained oak cabinetry and soft linen textiles. Bathrooms are finished in dark lava-stone tiles, while the living areas remain bright and open. A curated selection of custom and vintage furniture gives the space a lived-in, warm, and highly personal character.',
      detailsSecondary: 'The muted color palette features soft volcanic greys, warm sands, and charcoal accents. Tactile elements like wool throws, linen drapes, and raw plaster walls create a cozy refuge from the Icelandic winter.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Detail of the living room, showing the contrast between the rough concrete column and the warm dark oak cabinetry.',
      gallery: [
        'assets/unnamed (3).webp',
        'assets/unnamed (4).webp'
      ]
    },
    'bedroom-calm': {
      title: 'A Bedroom That Whispers Calm',
      subtitle: 'Bedroom Design',
      location: 'Jaipur, Rajasthan',
      year: '2025',
      category: 'INTERIOR · RESIDENTIAL · 2025',
      image: 'assets/bedroom-two.jpeg',
      description: 'A room that lowers your shoulders as you enter it, and asks nothing of you once you are inside.',
      details: 'Layered fabrics, rich textured cushions, and warm neutral tones harmonize to create a deeply relaxing environment.',
      detailsSecondary: 'Layered fabrics, rich textured cushions, and warm neutral tones harmonize to create a deeply relaxing environment.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The serene bedroom space, highlighting the artistic mural, layered textiles, and soft ambient lighting.',
      gallery: [
        'assets/bedroom-two.jpeg',
        'assets/unnamed (5).webp'
      ]
    },
    'bedroom-sanctuary': {
      title: 'A Sanctuary for Whispered Thoughts',
      subtitle: 'Bedroom Design',
      location: 'Jaipur, Rajasthan',
      year: '2025',
      category: 'INTERIOR · RESIDENTIAL · 2025',
      image: 'assets/bedroom-one-2.jpeg',
      description: 'A reading corner for the slower end of the day, lit for lingering rather than for getting things done.',
      details: 'Textured forest-patterned wallpaper and integrated ambient shelf lighting create an intimate evening retreat.',
      detailsSecondary: 'Textured forest-patterned wallpaper and integrated ambient shelf lighting create an intimate evening retreat.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Close-up of the bed and custom built-in shelving, showcasing the warm ambient lighting profile and forest-patterned wallpaper.',
      gallery: [
        'assets/bedroom-one-2.jpeg',
        'assets/unnamed (5).webp'
      ]
    },
    'bedroom-flight': {
      title: 'Where Dreams Take Flight',
      subtitle: 'Bedroom Design',
      location: 'Jaipur, Rajasthan',
      year: '2025',
      category: 'INTERIOR · RESIDENTIAL · 2025',
      image: 'assets/bedroom-one-1.jpeg',
      description: 'A child’s room where the walls carry a little wonder, made for rest and for the imagining that comes before sleep.',
      details: 'Delicate wallpaper artwork with birds in flight introduces organic movement and open sky.',
      detailsSecondary: 'Delicate wallpaper artwork with birds in flight introduces organic movement and open sky.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Close-up of the bed area, showing the birds-in-flight wallpaper backdrop, layered pillows, and textured sheets.',
      gallery: [
        'assets/bedroom-one-1.jpeg',
        'assets/unnamed (5).webp'
      ]
    },
    'quiet-rituals': {
      title: 'A Corner for Quiet Rituals',
      subtitle: 'Vanity & Bedroom Design',
      location: 'Jaipur, Rajasthan',
      year: '2025',
      category: 'INTERIOR · RESIDENTIAL · 2025',
      image: 'assets/bedroom-2.png',
      description: 'Every morning begins here, where soft light meets warm timber and the simplest moments become the most cherished.',
      details: 'A curved pill vanity cabinet, circular accent mirror, and rich terracotta accent wall create a serene personal corner.',
      detailsSecondary: 'A curved pill vanity cabinet, circular accent mirror, and rich terracotta accent wall create a serene personal corner.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'View of the custom built-in vanity corner featuring a curved pill cabinet, warm timber dressing table, and vertical fluted headboard.',
      gallery: [
        'assets/bedroom-2.png',
        'assets/unnamed (3).webp'
      ]
    }
  };

  // Modal Functionality
  const modalClose = document.querySelector('.modal-close');
  const modalContent = document.querySelector('.modal-content');

  // Get list of projects on the active page
  const getPageProjects = () => {
    return Array.from(document.querySelectorAll('[data-project]')).map(el => el.getAttribute('data-project'));
  };

  let activeProjectId = null;
  let activeProjectTrigger = null;

  const openProject = (id) => {
    const data = projects[id];
    if (!data || !modal || !modalContent) return;

    activeProjectId = id;

    // Hide original close button and make modal background dark
    if (modalClose) modalClose.style.display = 'none';
    modal.style.backgroundColor = 'rgba(15, 12, 10, 0.98)';
    modal.style.overflow = 'hidden'; // Disable scrollbar for image-only view

    modalContent.innerHTML = `
      <div class="modal-image-only-wrapper" style="display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh; background-color: rgba(15, 12, 10, 0.98); position: relative; cursor: zoom-out; box-sizing: border-box; padding: 20px;">
        
        <!-- Left Arrow Button -->
        <button class="image-modal-prev" aria-label="Previous" style="position: absolute; left: 30px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.45); border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; font-size: 22px; z-index: 10001; transition: background 0.2s, transform 0.2s; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          &#10094;
        </button>

        <div class="modal-image-container" style="position: relative; max-width: 80%; max-height: 90vh; display: inline-block; cursor: default;">
          <img src="${data.image}" alt="${data.title}" style="max-width: 100%; max-height: 90vh; display: block; object-fit: contain; box-shadow: 0 20px 50px rgba(0,0,0,0.6); border-radius: 4px;">
          <button class="image-modal-close" aria-label="Close" style="position: absolute; top: 15px; right: 15px; background: rgba(0, 0, 0, 0.6); border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10002; color: #ffffff; font-size: 24px; line-height: 1; transition: background 0.2s, transform 0.2s; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
            &times;
          </button>
        </div>

        <!-- Right Arrow Button -->
        <button class="image-modal-next" aria-label="Next" style="position: absolute; right: 30px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.45); border: none; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; font-size: 22px; z-index: 10001; transition: background 0.2s, transform 0.2s; font-family: sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          &#10095;
        </button>
      </div>
    `;

    // Bind close events
    const closeBtn = modalContent.querySelector('.image-modal-close');
    const container = modalContent.querySelector('.modal-image-container');
    const wrapper = modalContent.querySelector('.modal-image-only-wrapper');
    const prevBtn = modalContent.querySelector('.image-modal-prev');
    const nextBtn = modalContent.querySelector('.image-modal-next');

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeProject();
      });
      // Hover effects
      closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(0, 0, 0, 0.85)';
        closeBtn.style.transform = 'scale(1.05)';
      });
      closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(0, 0, 0, 0.6)';
        closeBtn.style.transform = 'scale(1)';
      });
    }

    if (container) {
      container.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    if (wrapper) {
      wrapper.addEventListener('click', () => {
        closeProject();
      });

      // Mobile gallery navigation: a clear horizontal swipe mirrors the arrows.
      if (window.matchMedia('(max-width: 767px)').matches) {
        let swipeStartX = 0;
        let swipeStartY = 0;

        wrapper.addEventListener('touchstart', (event) => {
          const touch = event.changedTouches[0];
          swipeStartX = touch.clientX;
          swipeStartY = touch.clientY;
        }, { passive: true });

        wrapper.addEventListener('touchend', (event) => {
          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - swipeStartX;
          const deltaY = touch.clientY - swipeStartY;

          if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

          const targetButton = deltaX < 0 ? nextBtn : prevBtn;
          targetButton?.click();
        }, { passive: true });
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pageProjects = getPageProjects();
        const currentIndex = pageProjects.indexOf(id);
        if (currentIndex !== -1) {
          const prevIndex = (currentIndex - 1 + pageProjects.length) % pageProjects.length;
          openProject(pageProjects[prevIndex]);
        }
      });
      // Hover effects
      prevBtn.addEventListener('mouseenter', () => {
        prevBtn.style.background = 'rgba(0, 0, 0, 0.75)';
        prevBtn.style.transform = 'translateY(-50%) scale(1.05)';
      });
      prevBtn.addEventListener('mouseleave', () => {
        prevBtn.style.background = 'rgba(0, 0, 0, 0.45)';
        prevBtn.style.transform = 'translateY(-50%) scale(1)';
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pageProjects = getPageProjects();
        const currentIndex = pageProjects.indexOf(id);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % pageProjects.length;
          openProject(pageProjects[nextIndex]);
        }
      });
      // Hover effects
      nextBtn.addEventListener('mouseenter', () => {
        nextBtn.style.background = 'rgba(0, 0, 0, 0.75)';
        nextBtn.style.transform = 'translateY(-50%) scale(1.05)';
      });
      nextBtn.addEventListener('mouseleave', () => {
        nextBtn.style.background = 'rgba(0, 0, 0, 0.45)';
        nextBtn.style.transform = 'translateY(-50%) scale(1)';
      });
    }

    modal.classList.add('active');
    modal.inert = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0; // reset modal scroll position
    window.requestAnimationFrame(() => closeBtn?.focus({ preventScroll: true }));
    handleScroll();
  };

  const closeProject = () => {
    if (!modal) return;
    activeProjectId = null;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-active');
    document.body.style.overflow = '';
    if (modalClose) modalClose.style.display = '';
    modal.style.backgroundColor = '';
    modal.style.overflow = '';
    activeProjectTrigger?.focus({ preventScroll: true });
    modal.inert = true;
    activeProjectTrigger = null;
    handleScroll();
  };

  // Bind project clicks
  document.querySelectorAll('[data-project]').forEach(card => {
    const projectName = card.querySelector('h2, h3')?.textContent.trim() || 'project';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${projectName}`);

    card.addEventListener('click', () => {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (currentPage !== 'work.html') {
        window.location.href = 'work.html';
      } else {
        const id = card.getAttribute('data-project');
        activeProjectTrigger = card;
        openProject(id);
      }
    });

    card.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      card.click();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeProject);
  }

  // Close modal when header links or logo are clicked
  if (header) {
    header.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (modal && modal.classList.contains('active')) {
          const href = link.getAttribute('href');
          const currentPage = window.location.pathname.split('/').pop() || 'index.html';
          if (href === currentPage || href === 'index.html' && currentPage === '') {
            e.preventDefault();
            closeProject();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            document.body.classList.remove('modal-active');
            document.body.style.overflow = '';
          }
        }
      });
    });
  }

  // Close modal with ESC key & support left/right arrow keys
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProject();
    } else if (activeProjectId) {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        const pageProjects = getPageProjects();
        const currentIndex = pageProjects.indexOf(activeProjectId);
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % pageProjects.length;
          openProject(pageProjects[nextIndex]);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        const pageProjects = getPageProjects();
        const currentIndex = pageProjects.indexOf(activeProjectId);
        if (currentIndex !== -1) {
          const prevIndex = (currentIndex - 1 + pageProjects.length) % pageProjects.length;
          openProject(pageProjects[prevIndex]);
        }
      }
    }
  });

  // Contact Form Handling with Field Validation & Inline Confirmation Message
  const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form');
  const formConfirmation = document.getElementById('form-confirmation');

  if (contactForm) {
    const clearFieldError = field => {
      if (!field) return;
      const parent = field.closest('.form-group');
      const errorMsg = parent ? parent.querySelector('.field-error-msg') : null;
      field.classList.remove('is-invalid');
      field.setAttribute('aria-invalid', 'false');
      field.style.borderColor = '';
      if (errorMsg) errorMsg.hidden = true;
    };

    contactForm.addEventListener('input', event => {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

      if (field.name === 'project_type') {
        const projectTypeField = field.closest('.contact-project-type');
        const errorMsg = projectTypeField ? projectTypeField.querySelector('.field-error-msg') : null;
        projectTypeField?.classList.remove('is-invalid');
        projectTypeField?.setAttribute('aria-invalid', 'false');
        contactForm.querySelectorAll('input[name="project_type"]').forEach(input => {
          input.setAttribute('aria-invalid', 'false');
        });
        if (errorMsg) errorMsg.hidden = true;
        return;
      }

      clearFieldError(field);
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nameInput = contactForm.querySelector('#name');
      const emailInput = contactForm.querySelector('#email');
      const projectTypeInput = contactForm.querySelector('input[name="project_type"]:checked');
      const projectTypeField = contactForm.querySelector('.contact-project-type');
      const projectLocationInput = contactForm.querySelector('#project-location');
      const messageInput = contactForm.querySelector('#message');
      const projectSizeInput = contactForm.querySelector('#project-size');
      const projectTimelineInput = contactForm.querySelector('#project-timeline');

      const fields = [
        { field: nameInput, validate: (v) => v.trim().length > 0 },
        { field: emailInput, validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
        { field: projectLocationInput, validate: (v) => v.trim().length > 0 },
        { field: messageInput, validate: (v) => v.trim().length > 0 }
      ];
      let firstInvalidField = null;

      fields.forEach(item => {
        if (!item.field) return;
        const parent = item.field.closest('.form-group');
        const errorMsg = parent ? parent.querySelector('.field-error-msg') : null;
        if (!item.validate(item.field.value)) {
          isValid = false;
          firstInvalidField ||= item.field;
          item.field.classList.add('is-invalid');
          item.field.setAttribute('aria-invalid', 'true');
          item.field.style.borderColor = 'var(--color-cinnamon-deep)';
          if (errorMsg) errorMsg.hidden = false;
        } else {
          item.field.classList.remove('is-invalid');
          item.field.setAttribute('aria-invalid', 'false');
          item.field.style.borderColor = '';
          if (errorMsg) errorMsg.hidden = true;
        }
      });

      const projectTypeError = projectTypeField ? projectTypeField.querySelector('.field-error-msg') : null;
      projectTypeField?.classList.toggle('is-invalid', !projectTypeInput);
      projectTypeField?.setAttribute('aria-invalid', String(!projectTypeInput));
      contactForm.querySelectorAll('input[name="project_type"]').forEach(input => {
        input.setAttribute('aria-invalid', String(!projectTypeInput));
      });
      if (projectTypeError) projectTypeError.hidden = Boolean(projectTypeInput);
      if (!projectTypeInput) {
        isValid = false;
        firstInvalidField ||= contactForm.querySelector('input[name="project_type"]');
      }

      if (isValid) {
        const whatsappNumber = '919509628808';
        const whatsappLines = [
          'Hello Baeroh, I’d like to start a conversation.',
          '',
          `Name: ${nameInput.value.trim()}`,
          `Email: ${emailInput.value.trim()}`,
          `Project type: ${projectTypeInput.value.trim()}`,
          `Project location: ${projectLocationInput.value.trim()}`,
          `What I’m imagining: ${messageInput.value.trim()}`
        ];

        if (projectSizeInput?.value.trim()) {
          whatsappLines.push(`Approximate project size: ${projectSizeInput.value.trim()}`);
        }
        if (projectTimelineInput?.value.trim()) {
          whatsappLines.push(`Preferred starting timeline: ${projectTimelineInput.value.trim()}`);
        }

        const whatsappMessage = whatsappLines.join('\n');
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        if (formConfirmation) {
          formConfirmation.hidden = false;
        }
        window.location.assign(whatsappUrl);
      } else {
        firstInvalidField?.focus({ preventScroll: true });
        firstInvalidField?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'center'
        });
      }
    });
  }

  // FAQ Premium Split Modal
  const faqTriggers = document.querySelectorAll('[data-faq-trigger]');
  let faqModal = document.getElementById('faq-modal');

  if (!faqModal && faqTriggers.length) {
    faqModal = document.createElement('div');
    faqModal.className = 'faq-modal';
    faqModal.id = 'faq-modal';
    faqModal.setAttribute('aria-hidden', 'true');
    faqModal.setAttribute('role', 'dialog');
    faqModal.setAttribute('aria-labelledby', 'faq-modal-title');
    faqModal.inert = true;
    faqModal.innerHTML = `
      <div class="faq-modal-overlay" data-faq-close></div>
      <div class="faq-modal-container"></div>
    `;
    document.body.appendChild(faqModal);
  }

  if (faqModal) {
    const faqIsPage = faqModal.hasAttribute('data-faq-page');
    const faqItems = [
      {
        category: 'getting-started',
        question: 'How do we start working together?',
        answer: [
          'It begins with a conversation. We meet, in person or on a call, to understand the space, how you live or work, and what you are hoping for.',
          'If we feel like the right fit for each other, we follow that with a proposal setting out the scope, process and next steps. Nothing is committed until that feels right to you.'
        ]
      },
      {
        category: 'getting-started',
        question: 'Where do you take on projects?',
        answer: [
          'Our studio is in Jaipur, and right now we are focused on projects across Rajasthan and Punjab. It lets us stay close to our sites and the craftspeople we work with.',
          'If you are a little beyond that, it is still worth asking. We will always be honest about whether we are the right studio for where you are.'
        ]
      },
      {
        category: 'getting-started',
        question: 'What kinds of spaces do you design?',
        answer: [
          'Homes, workplaces, hospitality, and retail spaces. Whether the space is brand new or already lived in, our approach is the same: we understand the people first, then design around them.'
        ]
      },
      {
        category: 'working-together',
        question: 'What does a project with Baeroh actually involve?',
        answer: [
          'We stay closely involved from the first conversation to the final walkthrough. That usually means understanding your brief, planning the layout and budget, resolving the design room by room, refining the details, and coordinating the people who bring it to life on site.',
          'You keep one point of contact throughout, so you always know who to ask and what is happening next.'
        ]
      },
      {
        category: 'execution',
        question: 'Do you handle the building work, or only the design?',
        answer: [
          'Both, if you would like us to. We offer turnkey execution, which means we coordinate the consultants, contractors and craftspeople and see the project through on site, so you are not left managing trades yourself.',
          'If you prefer to handle execution separately, we can design to hand over cleanly to your own team.'
        ]
      },
      {
        category: 'time-cost',
        question: 'How long does a project take?',
        answer: [
          'It depends entirely on the size and nature of the space, and we will give you a realistic timeline in your proposal rather than a hopeful one.',
          'Interiors and renovations often run over many months. Part of our job is to foresee the delays that others do not, so the timeline you are given is one you can genuinely plan around.'
        ]
      },
      {
        category: 'time-cost',
        question: 'How do you charge?',
        answer: [
          'Our fee depends on the scope and scale of the work, so we prefer to quote against your specific project rather than publish a single number that would not fit anyone.',
          'What we can promise is transparency. You will know what things cost, and why, before decisions are made, so there are no uncomfortable surprises later.'
        ]
      },
      {
        category: 'time-cost',
        question: 'Is there a minimum project size?',
        answer: [
          'We take on a considered number of projects at a time so that each receives real attention. That means we are not always the right choice for very small, single-room jobs, but the honest answer is that it depends on the project.',
          'Tell us what you have in mind and we will say plainly whether we are the right studio for it.'
        ]
      },
      {
        category: 'trust',
        question: 'We have never worked with a designer before. Is that a problem?',
        answer: [
          'Not at all. Most of the people we work with are doing this for the first time, and a good part of our role is simply to reduce the uncertainty of it.',
          'We will explain each stage as it comes, so you are never guessing what happens next.'
        ]
      },
      {
        category: 'trust',
        question: 'What does the name Baeroh mean?',
        answer: [
          'In the Rajasthani dialect, “baero” means to know. Not knowing in the ordinary sense, but the quiet certainty in a voice that says: I know the way, don’t worry, we’re here now.',
          'We added the H so the word could travel, and stay ours.'
        ]
      },
      {
        category: 'working-together',
        question: 'How involved will I need to be?',
        answer: [
          'As much as you would like, and never more than you are comfortable with. Some clients want to weigh in on every material; others prefer to trust us with the detail once the direction is set.',
          'We will find the rhythm that suits you early, and keep you informed at the points that matter.'
        ]
      },
      {
        category: 'working-together',
        question: 'Can you help if we are outside your location?',
        answer: [
          'Yes, depending on the project. We begin with a conversation to understand the scope, location and level of site involvement the work will need.',
          'For projects beyond our current focus areas, we will be transparent about what can be coordinated remotely, when our presence is essential, and whether we are the right studio for you.'
        ]
      }
    ];

    const faqCategories = [
      { id: 'getting-started', label: 'Getting Started' },
      { id: 'working-together', label: 'Working Together' },
      { id: 'execution', label: 'Execution' },
      { id: 'time-cost', label: 'Time and Cost' },
      { id: 'trust', label: 'Trust' }
    ];

    if (faqIsPage && !document.getElementById('faq-structured-data')) {
      const faqStructuredData = document.createElement('script');
      faqStructuredData.id = 'faq-structured-data';
      faqStructuredData.type = 'application/ld+json';
      faqStructuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer.join(' ')
          }
        }))
      });
      document.head.appendChild(faqStructuredData);
    }

    const modalContainer = faqModal.querySelector('.faq-modal-container');
    const modalOverlay = faqModal.querySelector('.faq-modal-overlay');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const answerTransitionDelay = reducedMotion ? 0 : 150;
    const closeDelay = reducedMotion ? 0 : 450;
    const searchIcon = `
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="6.5"></circle>
        <path d="m16 16 4 4"></path>
      </svg>
    `;
    const closeIcon = `
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
        <path d="M5 5l14 14"></path>
        <path d="M19 5 5 19"></path>
      </svg>
    `;

    let activeTrigger = null;
    let activeIndex = 0;
    let expandedAccordionIndex = null;
    let searchTerm = '';
    let savedScrollY = 0;
    let bodyStyleState = null;
    let closeTimer = null;
    let answerTimer = null;
    let isInitialized = false;
    const openCategories = new Set(['getting-started']);

    let searchInput;
    let categoryHost;
    let noResults;
    let rightScroll;
    let rightContent;

    const padNumber = (number) => String(number).padStart(2, '0');
    const normalizedText = (value) => value.toLocaleLowerCase().trim();
    const itemSearchText = (item) => normalizedText(`${item.question} ${item.answer.join(' ')}`);
    const categoryForItem = (index) => faqItems[index].category;
    const categoryIndices = (categoryId) => faqItems
      .map((item, index) => ({ item, index }))
      .filter(entry => entry.item.category === categoryId)
      .map(entry => entry.index);

    const getFilteredIndices = () => {
      const query = normalizedText(searchTerm);
      if (!query) return faqItems.map((_, index) => index);
      return faqItems
        .map((item, index) => ({ item, index }))
        .filter(entry => itemSearchText(entry.item).includes(query))
        .map(entry => entry.index);
    };

    const getRelatedIndices = (index) => {
      const sameCategory = categoryIndices(categoryForItem(index)).filter(itemIndex => itemIndex !== index);
      const nearby = faqItems
        .map((_, itemIndex) => itemIndex)
        .filter(itemIndex => itemIndex !== index && !sameCategory.includes(itemIndex))
        .sort((a, b) => Math.abs(a - index) - Math.abs(b - index));
      return [...sameCategory, ...nearby].slice(0, 3);
    };

    const readingTime = (item) => {
      const wordCount = item.answer.join(' ').split(/\s+/).filter(Boolean).length;
      return Math.max(1, Math.ceil(wordCount / 180));
    };

    const categoryMarkup = () => {
      const filteredIndices = getFilteredIndices();
      const hasQuery = Boolean(searchTerm.trim());

      noResults.hidden = filteredIndices.length > 0;

      return faqCategories.map(category => {
        const indices = categoryIndices(category.id).filter(index => filteredIndices.includes(index));
        if (hasQuery && !indices.length) return '';

        const isActiveCategory = category.id === categoryForItem(activeIndex);
        const isOpen = hasQuery || openCategories.has(category.id);

        return `
          <section class="faq-nav-group${isActiveCategory ? ' is-active' : ''}" data-faq-category-group="${category.id}">
            <button
              class="faq-nav-category"
              type="button"
              data-faq-category="${category.id}"
              aria-expanded="${isOpen}"
              aria-controls="faq-category-panel-${category.id}"
            >
              <span>${category.label}</span>
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
                <path d="m3 6 5 5 5-5"></path>
              </svg>
            </button>
            <div
              class="faq-nav-questions${isOpen ? ' is-open' : ''}"
              id="faq-category-panel-${category.id}"
              aria-hidden="${!isOpen}"
              ${isOpen ? '' : 'inert'}
            >
              <div>
                ${indices.map(index => `
                  <button
                    class="faq-nav-question${index === activeIndex ? ' is-active' : ''}"
                    type="button"
                    data-faq-select="${index}"
                    ${index === activeIndex ? 'aria-current="true"' : ''}
                  >
                    <span class="faq-nav-question-dot" aria-hidden="true"></span>
                    <span>${faqItems[index].question}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          </section>
        `;
      }).join('');
    };

    const accordionMarkup = () => faqItems
      .map((item, index) => ({ item, index }))
      .filter(entry => entry.index !== activeIndex)
      .map(({ item, index }) => {
        const isExpanded = expandedAccordionIndex === index;
        return `
          <section class="faq-right-row${isExpanded ? ' is-open' : ''}">
            <button
              class="faq-right-question"
              type="button"
              data-faq-accordion="${index}"
              aria-expanded="${isExpanded}"
              aria-controls="faq-right-answer-${index}"
            >
              <span class="faq-right-number">${padNumber(index + 1)}</span>
              <span class="faq-right-question-text">${item.question}</span>
              <span class="faq-right-toggle" aria-hidden="true">${isExpanded ? '−' : '+'}</span>
            </button>
            <div
              class="faq-right-answer-wrap"
              id="faq-right-answer-${index}"
              aria-hidden="${!isExpanded}"
              ${isExpanded ? '' : 'inert'}
            >
              <div>
                <div class="faq-right-inline-answer">
                  ${item.answer.map(paragraph => `<p>${paragraph}</p>`).join('')}
                </div>
              </div>
            </div>
          </section>
        `;
      }).join('');

    const rightMarkup = () => {
      const item = faqItems[activeIndex];
      const relatedIndices = getRelatedIndices(activeIndex);

      return `
        <article class="faq-featured-answer" aria-labelledby="faq-active-question">
          <div class="faq-featured-heading">
            <span class="faq-featured-number">${padNumber(activeIndex + 1)}</span>
            <h3 id="faq-active-question" tabindex="-1">${item.question}</h3>
            <span class="faq-read-time">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.2">
                <circle cx="10" cy="10" r="7"></circle>
                <path d="M10 6v4l2.5 1.5"></path>
              </svg>
              ${readingTime(item)} min read
            </span>
          </div>

          <div class="faq-featured-divider" aria-hidden="true"></div>

          <div class="faq-featured-copy">
            ${item.answer.map(paragraph => `<p>${paragraph}</p>`).join('')}
          </div>

          <div class="faq-related">
            <span class="faq-related-label">Related Questions</span>
            <div class="faq-related-links">
              ${relatedIndices.map(index => `
                <button type="button" data-faq-select="${index}">
                  <span>${faqItems[index].question}</span>
                  <span aria-hidden="true">&rarr;</span>
                </button>
              `).join('')}
            </div>
          </div>
        </article>

        <div class="faq-right-list" aria-label="More frequently asked questions">
          ${accordionMarkup()}
        </div>

        <footer class="faq-closing">
          <div>
            <h3>Still wondering something?<br>Let&rsquo;s talk.</h3>
          </div>
          <button class="faq-closing-link" type="button" data-faq-contact>
            Start a Conversation <span aria-hidden="true">&rarr;</span>
          </button>
        </footer>
      `;
    };

    const renderCategories = () => {
      categoryHost.innerHTML = categoryMarkup();
    };

    const renderRight = ({ focusHeading = false, preserveScroll = false } = {}) => {
      const scrollTop = preserveScroll ? rightScroll.scrollTop : 0;
      rightContent.innerHTML = rightMarkup();
      rightScroll.scrollTop = scrollTop;

      if (focusHeading) {
        window.requestAnimationFrame(() => {
          rightContent.querySelector('#faq-active-question')?.focus({ preventScroll: true });
        });
      }
    };

    const selectQuestion = (index, { focusHeading = true } = {}) => {
      const nextIndex = Math.max(0, Math.min(index, faqItems.length - 1));
      window.clearTimeout(answerTimer);
      activeIndex = nextIndex;
      expandedAccordionIndex = null;
      openCategories.add(categoryForItem(activeIndex));
      renderCategories();
      rightContent.classList.add('is-changing');

      answerTimer = window.setTimeout(() => {
        renderRight({ focusHeading });
        window.requestAnimationFrame(() => {
          rightContent.classList.remove('is-changing');
        });
      }, answerTransitionDelay);
    };

    const toggleAccordion = (index) => {
      expandedAccordionIndex = expandedAccordionIndex === index ? null : index;
      renderRight({ preserveScroll: true });

      window.requestAnimationFrame(() => {
        const button = rightContent.querySelector(`[data-faq-accordion="${index}"]`);
        button?.focus({ preventScroll: true });
        if (expandedAccordionIndex === index) {
          button?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'nearest'
          });
        }
      });
    };

    const initializeFaq = () => {
      modalContainer.setAttribute('tabindex', '-1');
      modalContainer.setAttribute('role', 'document');
      if (faqIsPage) {
        faqModal.setAttribute('role', 'region');
        faqModal.removeAttribute('aria-modal');
      } else {
        faqModal.setAttribute('aria-modal', 'true');
      }
      modalContainer.innerHTML = `
        <div class="faq-editorial-left">
          <div class="faq-left-intro">
            <img class="faq-brand-logo" src="assets/logo.png" width="614" height="602" alt="Baeroh">
            <${faqIsPage ? 'h1' : 'h2'} class="faq-editorial-title" id="faq-modal-title" tabindex="-1">
              <span>Questions,</span>
              <span>Answered</span>
            </${faqIsPage ? 'h1' : 'h2'}>
            <p>Everything people quietly wonder<br>before they begin.</p>
          </div>

          <div class="faq-search">
            <label for="faq-search-input">Search frequently asked questions</label>
            ${searchIcon}
            <input
              id="faq-search-input"
              type="search"
              autocomplete="off"
              placeholder="What would you like to know?"
            >
          </div>

          <p class="faq-no-results" role="status" aria-live="polite" hidden>No matching questions</p>
          <nav class="faq-category-nav" aria-label="FAQ categories"></nav>
        </div>

        <section class="faq-editorial-right" aria-label="FAQ answers">
          <button class="faq-modal-close" type="button" data-faq-close aria-label="Close FAQ">
            ${closeIcon}
          </button>
          <div class="faq-right-scroll">
            <div class="faq-right-content" aria-live="polite"></div>
          </div>
        </section>
      `;

      searchInput = modalContainer.querySelector('#faq-search-input');
      categoryHost = modalContainer.querySelector('.faq-category-nav');
      noResults = modalContainer.querySelector('.faq-no-results');
      rightScroll = modalContainer.querySelector('.faq-right-scroll');
      rightContent = modalContainer.querySelector('.faq-right-content');

      renderCategories();
      renderRight();
      isInitialized = true;
    };

    const lockPageScroll = () => {
      savedScrollY = window.scrollY;
      bodyStyleState = {
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        overflow: document.body.style.overflow
      };
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    };

    const unlockPageScroll = () => {
      if (!bodyStyleState) return;
      document.body.style.position = bodyStyleState.position;
      document.body.style.top = bodyStyleState.top;
      document.body.style.width = bodyStyleState.width;
      document.body.style.overflow = bodyStyleState.overflow;
      window.scrollTo(0, savedScrollY);
      bodyStyleState = null;
    };

    const closeFaqModal = (afterClose = null) => {
      if (faqIsPage) return;
      if (!faqModal.classList.contains('is-active')) return;
      window.clearTimeout(closeTimer);
      faqModal.classList.remove('is-active');

      closeTimer = window.setTimeout(() => {
        faqModal.setAttribute('aria-hidden', 'true');
        faqModal.inert = true;
        unlockPageScroll();
        if (typeof afterClose === 'function') {
          afterClose();
        } else if (activeTrigger && document.contains(activeTrigger)) {
          activeTrigger.focus({ preventScroll: true });
        }
      }, closeDelay);
    };

    const goToContact = () => {
      if (faqIsPage) {
        window.location.href = 'contact.html#contact-form';
        return;
      }

      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const isContactPage = currentPage === 'contact.html';

      closeFaqModal(() => {
        if (isContactPage) {
          document.getElementById('contact-form')?.scrollIntoView({
            behavior: reducedMotion ? 'auto' : 'smooth',
            block: 'start'
          });
        } else {
          window.location.href = 'contact.html#contact-form';
        }
      });
    };

    const resetFaqState = () => {
      activeIndex = 0;
      expandedAccordionIndex = null;
      searchTerm = '';
      openCategories.clear();
      openCategories.add('getting-started');
      if (searchInput) searchInput.value = '';
      renderCategories();
      renderRight();
      rightScroll.scrollTop = 0;
    };

    const openFaqModal = (event) => {
      if (faqIsPage) return;
      if (window.matchMedia('(max-width: 768px)').matches) return;
      event?.preventDefault();
      if (!isInitialized) initializeFaq();
      window.clearTimeout(closeTimer);

      activeTrigger = event?.currentTarget || document.activeElement;
      resetFaqState();
      faqModal.inert = false;
      faqModal.setAttribute('aria-hidden', 'false');
      lockPageScroll();

      const menuToggle = document.querySelector('.menu-toggle');
      const mobileNav = document.querySelector('.mobile-nav');
      menuToggle?.classList.remove('active');
      mobileNav?.classList.remove('active');
      menuToggle?.setAttribute('aria-expanded', 'false');
      mobileNav?.setAttribute('aria-hidden', 'true');
      if (mobileNav) mobileNav.inert = true;
      document.querySelector('header')?.classList.remove('menu-open');

      window.requestAnimationFrame(() => {
        faqModal.classList.add('is-active');
      });

      window.setTimeout(() => {
        modalContainer.querySelector('#faq-modal-title')?.focus({ preventScroll: true });
      }, reducedMotion ? 0 : 460);
    };

    const getFocusableElements = () => Array.from(
      modalContainer.querySelectorAll(
        'a[href], input:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(element => !element.hasAttribute('hidden') && element.offsetParent !== null);

    if (!faqIsPage) {
      faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', openFaqModal);
      });
    }

    modalOverlay?.addEventListener('click', () => closeFaqModal());

    modalContainer.addEventListener('input', (event) => {
      if (event.target !== searchInput) return;
      searchTerm = searchInput.value;
      renderCategories();
    });

    modalContainer.addEventListener('click', (event) => {
      if (event.target.closest('[data-faq-close]')) {
        closeFaqModal();
        return;
      }

      const categoryButton = event.target.closest('[data-faq-category]');
      if (categoryButton) {
        const categoryId = categoryButton.dataset.faqCategory;
        if (openCategories.has(categoryId)) {
          openCategories.delete(categoryId);
        } else {
          openCategories.add(categoryId);
        }
        renderCategories();
        modalContainer
          .querySelector(`[data-faq-category="${categoryId}"]`)
          ?.focus({ preventScroll: true });
        return;
      }

      const selectButton = event.target.closest('[data-faq-select]');
      if (selectButton) {
        selectQuestion(Number(selectButton.dataset.faqSelect));
        return;
      }

      const accordionButton = event.target.closest('[data-faq-accordion]');
      if (accordionButton) {
        toggleAccordion(Number(accordionButton.dataset.faqAccordion));
        return;
      }

      if (event.target.closest('[data-faq-contact]')) {
        event.preventDefault();
        goToContact();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (faqIsPage) return;
      if (!faqModal.classList.contains('is-active')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeFaqModal();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusableElements = getFocusableElements();
      if (!focusableElements.length) {
        event.preventDefault();
        modalContainer.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    });

    if (faqIsPage) {
      initializeFaq();
      faqModal.setAttribute('aria-hidden', 'false');
      faqModal.classList.add('is-active');
    } else if (
      window.location.hash === '#faq'
      && !window.matchMedia('(max-width: 768px)').matches
    ) {
      openFaqModal();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`
      );
    }
  }

});
