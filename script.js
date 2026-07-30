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
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking links
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Hero Slider
  const slides = document.querySelectorAll('.hero-slider .slide');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentSlide = 0;
  let slideInterval;

  if (slides.length > 0 && dotsContainer) {
    // Generate dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    const goToSlide = (idx) => {
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      currentSlide = idx;
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      resetInterval();
    };

    const nextSlide = () => {
      goToSlide((currentSlide + 1) % slides.length);
    };

    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 7000); // 7 seconds per slide
    };

    resetInterval();

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
      details: 'Floor-to-ceiling glass enclosed office with dark herringbone flooring, leading into a cohesive open-concept workplace.',
      detailsSecondary: 'Floor-to-ceiling glass enclosed office with dark herringbone flooring, leading into a cohesive open-concept workplace.',
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
      category: 'Commercial · Retail',
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
      category: 'Residential / Architecture',
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
      category: 'Interior · Residential',
      image: 'assets/unnamed (3).webp',
      description: 'A minimal, calm apartment in the center of Reykjavik. The renovation focused on clarifying the layout, bringing in light, and curating tactile materials that respond to the volcanic light of Iceland.',
      details: 'The design strategy stripped back modern additions to reveal the structural concrete columns, which are balanced with warm dark-stained oak cabinetry and soft linen textiles. Bathrooms are finished in dark lava stone tiles, while the living areas remain bright and open. A curated selection of custom and vintage furniture gives the space a lived-in, warm, and highly personal character.',
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
    document.body.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0; // reset modal scroll position
    handleScroll();
  };

  const closeProject = () => {
    if (!modal) return;
    activeProjectId = null;
    modal.classList.remove('active');
    document.body.classList.remove('modal-active');
    document.body.style.overflow = '';
    if (modalClose) modalClose.style.display = '';
    modal.style.backgroundColor = '';
    modal.style.overflow = '';
    handleScroll();
  };

  // Bind project clicks
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      if (currentPage !== 'work.html') {
        window.location.href = 'work.html';
      } else {
        const id = card.getAttribute('data-project');
        openProject(id);
      }
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
      field.style.borderColor = '';
      if (errorMsg) errorMsg.style.display = 'none';
    };

    contactForm.addEventListener('input', event => {
      const field = event.target;
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;

      if (field.name === 'project_type') {
        const projectTypeField = field.closest('.contact-project-type');
        const errorMsg = projectTypeField ? projectTypeField.querySelector('.field-error-msg') : null;
        projectTypeField?.classList.remove('is-invalid');
        if (errorMsg) errorMsg.style.display = 'none';
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

      fields.forEach(item => {
        if (!item.field) return;
        const parent = item.field.closest('.form-group');
        const errorMsg = parent ? parent.querySelector('.field-error-msg') : null;
        if (!item.validate(item.field.value)) {
          isValid = false;
          item.field.classList.add('is-invalid');
          item.field.style.borderColor = 'var(--color-cinnamon-deep)';
          if (errorMsg) errorMsg.style.display = 'block';
        } else {
          item.field.classList.remove('is-invalid');
          item.field.style.borderColor = '';
          if (errorMsg) errorMsg.style.display = 'none';
        }
      });

      const projectTypeError = projectTypeField ? projectTypeField.querySelector('.field-error-msg') : null;
      projectTypeField?.classList.toggle('is-invalid', !projectTypeInput);
      if (projectTypeError) projectTypeError.style.display = projectTypeInput ? 'none' : 'block';
      if (!projectTypeInput) isValid = false;

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
          formConfirmation.style.display = 'block';
        }
        window.location.assign(whatsappUrl);
      }
    });
  }

  // FAQ Editorial Booklet
  const faqTriggers = document.querySelectorAll('[data-faq-trigger]');
  const faqModal = document.getElementById('faq-modal');

  if (faqModal) {
    const faqItems = [
      {
        question: 'How do we start working together?',
        answer: [
          'It begins with a conversation. We meet, in person or on a call, to understand the space, how you live or work, and what you are hoping for.',
          'If we feel like the right fit for each other, we follow that with a proposal setting out the scope, process and next steps. Nothing is committed until that feels right to you.'
        ]
      },
      {
        question: 'Where do you take on projects?',
        answer: [
          'Our studio is in Jaipur, and right now we are focused on projects across Rajasthan and Punjab. It lets us stay close to our sites and the craftspeople we work with.',
          'If you are a little beyond that, it is still worth asking. We will always be honest about whether we are the right studio for where you are.'
        ]
      },
      {
        question: 'What kinds of spaces do you design?',
        answer: [
          'Homes, workplaces, hospitality and retail spaces. Whether the space is brand new or already lived in, our approach is the same: we understand the people first, then design around them.'
        ]
      },
      {
        question: 'What does a project with Baeroh actually involve?',
        answer: [
          'We stay closely involved from the first conversation to the final walkthrough. That usually means understanding your brief, planning the layout and budget, resolving the design room by room, refining the details, and coordinating the people who bring it to life on site.',
          'You keep one point of contact throughout, so you always know who to ask and what is happening next.'
        ]
      },
      {
        question: 'Do you handle the building work, or only the design?',
        answer: [
          'Both, if you would like us to. We offer turnkey execution, which means we coordinate the consultants, contractors and craftspeople and see the project through on site, so you are not left managing trades yourself.',
          'If you prefer to handle execution separately, we can design to hand over cleanly to your own team.'
        ]
      },
      {
        question: 'How long does a project take?',
        answer: [
          'It depends entirely on the size and nature of the space, and we will give you a realistic timeline in your proposal rather than a hopeful one.',
          'Interiors and renovations often run over many months. Part of our job is to foresee the delays that others do not, so the timeline you are given is one you can genuinely plan around.'
        ]
      },
      {
        question: 'How do you charge?',
        answer: [
          'Our fee depends on the scope and scale of the work, so we prefer to quote against your specific project rather than publish a single number that would not fit anyone.',
          'What we can promise is transparency. You will know what things cost, and why, before decisions are made, so there are no uncomfortable surprises later.'
        ]
      },
      {
        question: 'Is there a minimum project size?',
        answer: [
          'We take on a considered number of projects at a time so that each receives real attention. That means we are not always the right choice for very small, single-room jobs, but the honest answer is that it depends on the project.',
          'Tell us what you have in mind and we will say plainly whether we are the right studio for it.'
        ]
      },
      {
        question: 'We have never worked with a designer before. Is that a problem?',
        answer: [
          'Not at all. Most of the people we work with are doing this for the first time, and a good part of our role is simply to reduce the uncertainty of it.',
          'We will explain each stage as it comes, so you are never guessing what happens next.'
        ]
      },
      {
        question: 'What does the name Baeroh mean?',
        answer: [
          'In the Rajasthani dialect, “baero” means to know. Not knowing in the ordinary sense, but the quiet certainty in a voice that says: I know the way, don’t worry, we’re here now.',
          'We added the H so the word could travel, and stay ours.'
        ]
      },
      {
        question: 'How involved will I need to be?',
        answer: [
          'As much as you would like, and never more than you are comfortable with. Some clients want to weigh in on every material; others prefer to trust us with the detail once the direction is set.',
          'We will find the rhythm that suits you early, and keep you informed at the points that matter.'
        ]
      },
      {
        question: 'Can you help if we are outside your location?',
        answer: [
          'Yes, depending on the project. We begin with a conversation to understand the scope, location and level of site involvement the work will need.',
          'For projects beyond our current focus areas, we will be transparent about what can be coordinated remotely, when our presence is essential, and whether we are the right studio for you.'
        ]
      }
    ];

    const modalContainer = faqModal.querySelector('.faq-modal-container');
    const modalOverlay = faqModal.querySelector('.faq-modal-overlay');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const transitionDelay = reducedMotion ? 0 : 180;
    const closeDelay = reducedMotion ? 0 : 450;
    const arrowLeft = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"></path><path d="m11 18-6-6 6-6"></path></svg>';
    const arrowRight = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>';

    let faqStage;
    let closeButton;
    let activeTrigger = null;
    let currentIndex = 0;
    let currentView = 'list';
    let savedScrollY = 0;
    let transitionTimer = null;
    let closeTimer = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let bodyStyleState = null;
    let isInitialized = false;

    const padNumber = (number) => String(number).padStart(2, '0');
    const currentCounter = (index) => `${padNumber(index + 1)} / ${padNumber(faqItems.length)}`;

    const dotsMarkup = (activeIndex) => `
      <div class="faq-dots" aria-label="FAQ question navigation">
        ${faqItems.map((item, index) => `
          <button
            class="faq-dot${index === activeIndex ? ' is-active' : ''}"
            type="button"
            data-faq-dot="${index}"
            aria-label="Open question ${index + 1}: ${item.question}"
            ${index === activeIndex ? 'aria-current="true"' : ''}
          ></button>
        `).join('')}
      </div>
    `;

    const listMarkup = () => `
      <section class="faq-view faq-view--list" aria-labelledby="faq-modal-title">
        <header class="faq-list-header">
          <span class="faq-counter">01 / ${padNumber(faqItems.length)}</span>
          <h2 class="faq-list-title" id="faq-modal-title" tabindex="-1">
            <span>Questions,</span>
            <span>Answered</span>
          </h2>
          <p class="faq-list-intro">Everything people quietly wonder<br>before they begin.</p>
        </header>

        <div class="faq-list-scroll">
          <div class="faq-list" role="list">
            ${faqItems.map((item, index) => `
              <div class="faq-list-entry" role="listitem">
                <button
                  class="faq-list-question"
                  type="button"
                  data-faq-index="${index}"
                  aria-label="Read answer ${index + 1} of ${faqItems.length}: ${item.question}"
                >
                  <span class="faq-list-question-text">${item.question}</span>
                  <span class="faq-list-plus" aria-hidden="true">+</span>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <footer class="faq-list-footer">
          <strong>Still wondering something?</strong>
          <p>We&rsquo;d rather answer it in person.</p>
          <button class="faq-text-link" type="button" data-faq-contact>
            Start a conversation <span aria-hidden="true">&rarr;</span>
          </button>
        </footer>
      </section>
    `;

    const answerMarkup = (index) => {
      const item = faqItems[index];
      return `
        <section class="faq-view faq-view--answer" aria-labelledby="faq-modal-title">
          <header class="faq-answer-topbar">
            <button class="faq-back-button" type="button" data-faq-back aria-label="Back to all questions">
              ${arrowLeft}<span>All questions</span>
            </button>
            <span class="faq-counter">${currentCounter(index)}</span>
            <span aria-hidden="true"></span>
          </header>

          <div class="faq-answer-content">
            <h2 class="faq-answer-question" id="faq-modal-title" tabindex="-1">${item.question}</h2>
            <div class="faq-answer-divider" aria-hidden="true"></div>
            <div class="faq-answer-copy">
              ${item.answer.map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
          </div>

          <footer class="faq-answer-footer">
            <div class="faq-answer-nav-row">
              <button
                class="faq-answer-nav-button faq-answer-nav-button--prev"
                type="button"
                data-faq-prev
                ${index === 0 ? 'disabled' : ''}
              >
                ${arrowLeft}<span>Previous Question</span>
              </button>
              <button
                class="faq-answer-nav-button faq-answer-nav-button--next"
                type="button"
                data-faq-next
              >
                <span>Next Question</span>${arrowRight}
              </button>
            </div>
            ${dotsMarkup(index)}
          </footer>
        </section>
      `;
    };

    const finalMarkup = () => `
      <section class="faq-view faq-view--final" aria-labelledby="faq-modal-title">
        <header class="faq-answer-topbar">
          <button class="faq-back-button" type="button" data-faq-final-back aria-label="Back to the last question">
            ${arrowLeft}<span>Last question</span>
          </button>
          <span class="faq-counter">${padNumber(faqItems.length)} / ${padNumber(faqItems.length)}</span>
          <span aria-hidden="true"></span>
        </header>

        <div class="faq-answer-content">
          <svg class="faq-final-ornament" aria-hidden="true" viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 64c17-12 29-30 39-51"></path>
            <path d="M29 51c-9-1-14-6-15-14 9 1 14 5 15 14Z"></path>
            <path d="M40 37c-8-3-11-9-10-17 8 3 12 9 10 17Z"></path>
            <path d="M47 29c8 0 13-4 16-11-8-1-14 3-16 11Z"></path>
            <path d="M35 45c8 1 14-2 18-9-8-2-14 1-18 9Z"></path>
          </svg>
          <h2 class="faq-final-title" id="faq-modal-title" tabindex="-1">Still wondering something?</h2>
          <p class="faq-final-copy">We&rsquo;d rather answer it in person.</p>
          <a class="btn btn-primary faq-final-cta" href="contact.html#contact-form" data-faq-contact>
            Start a Conversation <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <footer class="faq-answer-footer">
          ${dotsMarkup(faqItems.length - 1)}
        </footer>
      </section>
    `;

    const focusAfterRender = (selector) => {
      window.requestAnimationFrame(() => {
        const target = modalContainer.querySelector(selector);
        if (target) target.focus({ preventScroll: true });
      });
    };

    const renderList = (focusIndex = null) => {
      currentView = 'list';
      faqStage.innerHTML = listMarkup();
      if (Number.isInteger(focusIndex)) {
        focusAfterRender(`[data-faq-index="${focusIndex}"]`);
      }
    };

    const renderAnswer = (index) => {
      currentIndex = Math.max(0, Math.min(index, faqItems.length - 1));
      currentView = 'answer';
      faqStage.innerHTML = answerMarkup(currentIndex);
      focusAfterRender('.faq-answer-question');
    };

    const renderFinal = () => {
      currentView = 'final';
      faqStage.innerHTML = finalMarkup();
      focusAfterRender('.faq-final-title');
    };

    const transitionTo = (renderView) => {
      window.clearTimeout(transitionTimer);
      faqStage.classList.add('is-transitioning');
      transitionTimer = window.setTimeout(() => {
        renderView();
        window.requestAnimationFrame(() => {
          faqStage.classList.remove('is-transitioning');
        });
      }, transitionDelay);
    };

    const showPrevious = () => {
      if (currentView === 'final') {
        transitionTo(() => renderAnswer(faqItems.length - 1));
      } else if (currentView === 'answer' && currentIndex > 0) {
        transitionTo(() => renderAnswer(currentIndex - 1));
      }
    };

    const showNext = () => {
      if (currentView !== 'answer') return;
      if (currentIndex < faqItems.length - 1) {
        transitionTo(() => renderAnswer(currentIndex + 1));
      } else {
        transitionTo(renderFinal);
      }
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

    const initializeFaq = () => {
      modalContainer.setAttribute('tabindex', '-1');
      modalContainer.setAttribute('role', 'document');
      faqModal.setAttribute('aria-modal', 'true');
      modalContainer.innerHTML = `
        <button class="faq-modal-close" type="button" data-faq-close aria-label="Close Questions, Answered">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
            <path d="M6 6l12 12"></path>
            <path d="M18 6 6 18"></path>
          </svg>
        </button>
        <div class="faq-modal-stage" data-faq-stage aria-live="polite"></div>
      `;
      closeButton = modalContainer.querySelector('[data-faq-close]');
      faqStage = modalContainer.querySelector('[data-faq-stage]');
      renderList();
      isInitialized = true;
    };

    const closeFaqModal = (afterClose = null) => {
      if (!faqModal.classList.contains('is-active')) return;
      window.clearTimeout(closeTimer);
      faqModal.classList.remove('is-active');
      faqModal.setAttribute('aria-hidden', 'true');

      closeTimer = window.setTimeout(() => {
        unlockPageScroll();
        if (typeof afterClose === 'function') {
          afterClose();
        } else if (activeTrigger && document.contains(activeTrigger)) {
          activeTrigger.focus({ preventScroll: true });
        }
      }, closeDelay);
    };

    const goToContact = () => {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      const isContactPage = currentPage === 'contact.html';

      closeFaqModal(() => {
        if (isContactPage) {
          const contactTarget = document.getElementById('contact-form') || document.querySelector('.contact-section-inner');
          if (contactTarget) {
            contactTarget.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
          }
        } else {
          window.location.href = 'contact.html#contact-form';
        }
      });
    };

    const openFaqModal = (event) => {
      if (event) event.preventDefault();
      if (!isInitialized) initializeFaq();
      window.clearTimeout(closeTimer);

      activeTrigger = event ? event.currentTarget : document.activeElement;
      renderList();
      faqModal.setAttribute('aria-hidden', 'false');
      lockPageScroll();

      const menuToggle = document.querySelector('.menu-toggle');
      const mobileNav = document.querySelector('.mobile-nav');
      if (menuToggle && mobileNav) {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
      }

      window.requestAnimationFrame(() => {
        faqModal.classList.add('is-active');
      });

      window.setTimeout(() => {
        const modalTitle = modalContainer.querySelector('#faq-modal-title');
        if (modalTitle) modalTitle.focus({ preventScroll: true });
      }, reducedMotion ? 0 : 460);
    };

    const getFocusableElements = () => Array.from(
      modalContainer.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(element => !element.hasAttribute('hidden'));

    faqTriggers.forEach(trigger => {
      trigger.addEventListener('click', openFaqModal);
    });

    modalOverlay.addEventListener('click', () => closeFaqModal());

    modalContainer.addEventListener('click', (event) => {
      if (event.target.closest('[data-faq-close]')) {
        closeFaqModal();
        return;
      }

      const questionButton = event.target.closest('[data-faq-index]');
      if (questionButton) {
        const index = Number(questionButton.dataset.faqIndex);
        transitionTo(() => renderAnswer(index));
        return;
      }

      if (event.target.closest('[data-faq-back]')) {
        transitionTo(() => renderList(currentIndex));
        return;
      }

      if (event.target.closest('[data-faq-prev]')) {
        showPrevious();
        return;
      }

      if (event.target.closest('[data-faq-next]')) {
        showNext();
        return;
      }

      if (event.target.closest('[data-faq-final-back]')) {
        transitionTo(() => renderAnswer(faqItems.length - 1));
        return;
      }

      const dot = event.target.closest('[data-faq-dot]');
      if (dot) {
        transitionTo(() => renderAnswer(Number(dot.dataset.faqDot)));
        return;
      }

      if (event.target.closest('[data-faq-contact]')) {
        event.preventDefault();
        goToContact();
      }
    });

    modalContainer.addEventListener('touchstart', (event) => {
      if (event.touches.length !== 1) return;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }, { passive: true });

    modalContainer.addEventListener('touchend', (event) => {
      if (!event.changedTouches.length || (currentView !== 'answer' && currentView !== 'final')) return;
      const deltaX = event.changedTouches[0].clientX - touchStartX;
      const deltaY = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
      if (deltaX < 0) {
        showNext();
      } else {
        showPrevious();
      }
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
      if (!faqModal.classList.contains('is-active')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeFaqModal();
        return;
      }

      if (event.key === 'ArrowLeft' && (currentView === 'answer' || currentView === 'final')) {
        event.preventDefault();
        showPrevious();
        return;
      }

      if (event.key === 'ArrowRight' && currentView === 'answer') {
        event.preventDefault();
        showNext();
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

  }
});
