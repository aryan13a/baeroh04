// Baeroh Design Studio - Interactivity & Animations

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & Modal Setup
  const header = document.querySelector('header');
  const modal = document.querySelector('.project-modal');
  const isTransparentInit = header ? header.classList.contains('header-transparent') : false;

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
  window.addEventListener('scroll', handleScroll);
  if (modal) {
    modal.addEventListener('scroll', handleScroll);
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
    rootMargin: '0px',
    threshold: 0.1
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
    animationObserver.observe(el);
  });

  // Project Database
  const projects = {
    'canvas-ambition': {
      title: 'A Canvas for Ambition',
      subtitle: 'Executive Workspace Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'Interior / Workspace',
      image: 'assets/canvas-ambition.jpeg',
      description: 'Great milestones are rarely achieved by chance; they are sculpted in the quiet hours of focused dedication. In this workspace, the clean lines of modern technology meet the grounding warmth of tailored, sophisticated tones. The commanding high-back chair stands ready for the visionary, while a golden bull sits quietly on the desk, a silent testament to strength, market conviction, and resilience. Wrapped in soft, ambient light that removes the harshness of the corporate world, this desk is more than a place to work—it is the launchpad where raw ambition is refined into legacy.',
      details: 'Great milestones are rarely achieved by chance; they are sculpted in the quiet hours of focused dedication. In this workspace, the clean lines of modern technology meet the grounding warmth of tailored, sophisticated tones. The commanding high-back chair stands ready for the visionary, while a golden bull sits quietly on the desk, a silent testament to strength, market conviction, and resilience.',
      detailsSecondary: 'Wrapped in soft, ambient light that removes the harshness of the corporate world, this desk is more than a place to work—it is the launchpad where raw ambition is refined into legacy.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The commanding high-back chair and workspace detail featuring modern technology and warm, sophisticated tones.',
      gallery: [
        'assets/canvas-ambition.jpeg'
      ]
    },
    'executive-studio': {
      title: 'Contemporary Executive Studio',
      subtitle: 'Executive Studio Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'Interior / Workspace',
      image: 'assets/unnamed (2).webp',
      description: 'An upscale corporate setting that masterfully balances privacy and collaborative space. Featuring a striking, floor to ceiling glass enclosed office complete with a plush swivel armchair, dark herringbone flooring, and an elegant curved partition wall. Outside, the open plan workspace flows naturally with warm toned desks, ergonomic chairs, and fluid, recessed ceiling lighting that guides the eye through a cohesive, high end professional environment.',
      details: 'Tailored for modern executive leaders, the Contemporary Executive Studio bridges privacy with openness. The central glass-enclosed space defines a premium office corner, complete with dark herringbone flooring and a luxurious neutral-toned lounge swivel chair.',
      detailsSecondary: 'Outside the private enclosure, the open-plan office layout is finished with custom warm timber desks and ergonomic seating. The dynamic ceiling layout features fluid, recessed LED strip profiles that lead the eye through the interior, blending a sense of direction with quiet architectural sophistication.',
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
      year: '2026',
      category: 'Residential / Interior Styling',
      image: 'assets/unnamed (3).webp',
      description: 'A chic dressing corner defined by geometric harmony and warm, earthy tones. The floating wooden vanity table features clean lines, complemented by a perfect circular mirror and an ultra modern, pill shaped vertical cabinet that cuts through the desk space. Set against a rich terracotta brown backdrop, the soft textures of the vanity chair, delicate green potted plant, and curated accessories create an intimate, stylish, and comfortable personal sanctuary.',
      details: 'Focusing on the beauty of daily personal rituals, the Minimalist Vanity Nook balances geometric forms with warm, organic materials. A sleek, floating timber dressing table anchors the corner, designed to offer simple utility while maintaining an uncluttered visual footprint.',
      detailsSecondary: 'The composition is completed by a large circular mirror and a vertical pill-shaped cabinet that extends through the desk, creating a dynamic play on proportions. Set against a rich, earthy terracotta accent wall, this vanity corner features soft fabric textures and minimal curation, forming an intimate personal sanctuary.',
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
      category: 'Interior / Workspace',
      image: 'assets/unnamed.webp',
      description: 'A modern workspace that seamlessly blends sleek minimalism with warm, organic elements. The crisp light wood workstations, ergonomic mesh chairs with subtle warm accents, and clean neutral tones create an inviting yet highly professional environment. Thoughtful architectural detailing including a curved accent wall, fluid LED ceiling lights, and delicate hanging greenery adds a touch of timeless sophistication to this focused, comfortable work layout.',
      details: 'Designed for creative synergy and focused productivity, this Sleek and Sophisticated Open Office merges clean minimalism with warm organic accents. Large modular workstations made from light timber provide spacious areas for individuals and teams, while ergonomic mesh seating ensures maximum comfort.',
      detailsSecondary: 'Fluid LED strip lighting runs gracefully across the ceiling, accentuating the curves of the architectural walls. Hanging planters soften the structural boundaries, introducing nature to the workspace and fostering a fresh, productive atmosphere.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The open office workstations, demonstrating the fusion of clean minimal desk surfaces, ergonomic chairs, and delicate ceiling greenery.',
      gallery: [
        'assets/unnamed.webp',
        'assets/unnamed (1).webp'
      ]
    },
    'elegant-workspace': {
      title: 'Elegant Workspace Design',
      subtitle: 'Workspace Design',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'Interior / Workspace',
      image: 'assets/unnamed (1).webp',
      description: 'Every morning begins with quiet ambition. As sunlight slips through the curtains, the room awakens with warmth and purpose. The wooden desk patiently waits for the next idea, while the comfortable chairs invite conversations that could spark something extraordinary. Here, every detail plays its part in creating a workspace where productivity feels effortless and success finds its home.',
      details: 'Designed for productivity and quiet contemplation, the Elegant Workspace balances architectural structure with tactile comfort. A custom-crafted natural solid wood desk acts as the anchor of the room, surrounded by ergonomic, softly upholstered lounge chairs that invite relaxed but focused conversations.',
      detailsSecondary: 'Concealed ambient lighting highlights the warm neutral plaster walls, while built-in oak storage keeps the environment minimal and free of clutter. The project reflects a thoughtful approach to corporate and home workspaces, proving that professional settings can feel warm, inviting, and deeply personal.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The central desk area, showing the soft contrast between the textured wood grain and the architectural metallic finishes.',
      gallery: [
        'assets/unnamed (1).webp',
        'assets/unnamed.webp'
      ]
    },
    'timeless-design-details': {
      title: 'Timeless Design Details',
      subtitle: 'Interior Detail & Curation',
      location: 'Jaipur, Rajasthan',
      year: '2026',
      category: 'Residential / Interior Styling',
      image: 'assets/unnamed (5).webp',
      description: 'Long before a handshake or a greeting, this space begins telling your story. The warm glow of ambient lighting, elegant finishes, and thoughtfully placed décor quietly assure every visitor they\'ve arrived somewhere special. It\'s a reception that doesn\'t just welcome guests—it introduces the character, care, and craftsmanship behind everything that follows.',
      details: 'Dedicated to the subtle art of space curation, Timeless Design Details represents a synthesis of architectural symmetry, texture, and materiality. Every piece of custom-built shelving and freestanding furniture is arranged to invite interactions, balancing spatial utility with cozy, quiet corners.',
      detailsSecondary: 'Delicate linen drapes diffuse natural sunlight during the day, while strategically placed warm lights illuminate natural stone and oak accents at dusk. This project showcases how minimal styling and high-quality craftsmanship create a home environment that is both modern and welcoming.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Curated corner showing a custom lounge chair positioned by a window where light highlights the organic details.',
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
      category: 'Interior / Meeting Space',
      image: 'assets/unnamed (4).webp',
      description: 'Behind these walls, every conversation has the power to shape what comes next. The warm lighting, refined textures, and elegant finishes create an atmosphere where ideas flow naturally and collaboration feels effortless. It\'s a space where first impressions become lasting partnerships, everyday meetings turn into meaningful milestones, and every detail is designed to inspire confidence.',
      details: 'Centered around collaboration and corporate excellence, the Sophisticated Meeting Space marries a bold architectural presence with state-of-the-art utility. A premium acoustic timber slatted wall anchors the room, filtering peripheral noise while offering a rich organic backdrop to the custom conference table and ergonomic leather chairs.',
      detailsSecondary: 'Intelligent warm lighting transitions dynamically across the ceiling to align with presentation modes, enhancing focus and eye comfort. Rich textures and clean structural lines reflect a modern corporate identity that values design, craftsmanship, and professional comfort.',
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
      category: 'Commercial / Retail',
      image: 'assets/unnamed.webp',
      description: 'Rather than a conventional retail interior, the Polène Flagship Store is conceived as an environment to be felt as much as seen – a place where material, light, and proportion come together to create a calm, tactile landscape that invites visitors to slow down, engage the senses, and experience the enduring relationship between form, hand, and material.',
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
      category: 'Residential / Interior Styling',
      image: 'assets/unnamed (3).webp',
      description: 'A minimal, calm apartment in the center of Reykjavik. The renovation focused on clarifying the layout, bringing in light, and curating tactile materials that respond to the volcanic light of Iceland.',
      details: 'The design strategy stripped back modern additions to reveal the structural concrete columns, which are balanced with warm dark-stained oak cabinetry and soft linen textiles. Bathrooms are finished in a dark lava stone tiles, while the living areas remain bright and open. A curated selection of custom and vintage furniture gives the space a lived-in, warm, and highly personal character.',
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
      year: '2026',
      category: 'Interior / Residential',
      image: 'assets/bedroom-two.jpeg',
      description: 'As daylight gently filters through the room, every detail comes to life with quiet elegance. The artistic mural tells a story of nature, while the soft textures, layered cushions, and warm neutral tones create a space that invites you to slow down and unwind. More than just a bedroom, it\'s a peaceful retreat where every morning begins with serenity and every evening ends in comfort.',
      details: 'Designed as a sanctuary from the outside world, this bedroom balances elegant form with soothing comfort. A large artistic nature-inspired mural commands the feature wall, setting a peaceful, organic tone for the entire space.',
      detailsSecondary: 'Layered fabrics, rich textured cushions, and warm neutral tones harmonize to create a deeply relaxing environment. Every corner is carefully composed to encourage rest, reflection, and a slower pace of daily life.',
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
      year: '2026',
      category: 'Interior / Residential',
      image: 'assets/bedroom-one-2.jpeg',
      description: 'The day demands our energy, but the evening asks for our stories. In this quiet corner, the textured canopy of the wallpaper mimics a moonlit forest, while the soft, warm glow from the built-in shelving casts a gentle light on the objects we gather through life. Here, surrounded by favorite books, mindful details, and the plush comfort of the bed, the rush of the world fades into the background. It is a space designed not just for sleeping, but for resetting where the final chapter of today softly transitions into the quiet promise of tomorrow.',
      details: 'Designed as a sanctuary from the outside world, this bedroom balances structural precision with tactile warmth. The custom built-in shelving unit with integrated LED profile lighting serves as both a soft ambient light source and a curated display for books and personal treasures.',
      detailsSecondary: 'The textured forest-patterned wallpaper provides a rich, natural canopy backdrop, complementing the dark-toned linen bedding. Every element, from the warm wood veneers to the subtle ambient lighting, is thoughtfully composed to create a quiet, restful retreat.',
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
      year: '2026',
      category: 'Interior / Residential',
      image: 'assets/bedroom-one-1.jpeg',
      description: 'True comfort isn\'t just about a soft place to rest; it’s about where your mind goes when you finally close your eyes. In this space, the delicate sketch of birds soaring past ancient trees transforms a simple wall into a canvas of endless horizons. The thoughtful contrast of neutral textures and deep, grounding tones creates a safe harbor from the daily rush. Here, as the evening settles, the boundaries of the room seem to expand, inviting you to leave the weight of the day behind and drift into a landscape of quiet wonder.',
      details: 'Designed as a sanctuary from the outside world, this bedroom balances structural precision with tactile warmth. The custom wallpaper mural with birds in flight introduces a sense of organic movement and open sky, while the neutral textiles keep the atmosphere grounded.',
      detailsSecondary: 'Concealed warm lighting highlights the natural textures of the plaster walls and wood surfaces, while built-in oak storage keeps the space minimal and free of clutter. The project reflects a thoughtful approach to bedroom sanctuaries, proving that rest spaces can feel open, cozy, and deeply personal.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Close-up of the bed area, showing the birds-in-flight wallpaper backdrop, layered pillows, and textured sheets.',
      gallery: [
        'assets/bedroom-one-1.jpeg',
        'assets/unnamed (5).webp'
      ]
    }
  };

  // Modal Functionality
  const modalClose = document.querySelector('.modal-close');
  const modalContent = document.querySelector('.modal-content');

  const openProject = (id) => {
    const data = projects[id];
    if (!data || !modal || !modalContent) return;

    // Dynamically format category: split by / and join with |
    const formattedCategory = data.category
      .split('/')
      .map(s => s.trim().toUpperCase())
      .join(' \u00a0|\u00a0 ');

    modalContent.innerHTML = `
      <!-- Fullscreen Cover -->
      <div class="modal-hero-cover" style="position: relative; width: 100%; height: 100vh; overflow: hidden; background-color: var(--color-charcoal);">
        <div class="modal-cover-bg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${data.image}'); background-size: cover; background-position: center; filter: brightness(0.75);"></div>
        
        <!-- Hero content overlaid on cover -->
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 3; color: #ffffff; padding: 0 40px;">
          <!-- Centered Title & Metadata -->
          <div style="text-align: center; margin-top: auto; margin-bottom: auto; transform: translateY(40px);">
            <h1 class="font-display-hero" style="color: #ffffff; font-size: clamp(32px, 5vw, 64px); font-weight: 300; letter-spacing: 0.3em; margin-bottom: 16px; text-transform: uppercase; line-height: 1.3;">${data.title}</h1>
            <div style="font-family: var(--font-display); font-size: 14px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-top: 15px;">${formattedCategory}</div>
          </div>
          
          <!-- Bottom Description -->
          <div style="max-width: 800px; text-align: center; margin-bottom: 60px; margin-top: auto;">
            <p style="font-family: var(--font-body); font-weight: 300; color: rgba(255, 255, 255, 0.95); font-size: clamp(12px, 1.6vw, 13px); line-height: 1.8; text-align: center;">${data.description}</p>
          </div>
        </div>
      </div>
      
      <!-- Scrolled Content Section -->
      <div class="modal-scrolled-body" style="background-color: var(--color-ivory); padding: 120px 0;">
        <div class="container" style="max-width: 100%; padding: 0 80px;">
          <div class="modal-detail-grid">
            <!-- Left Meta Column -->
            <div class="modal-meta-col">
              <div class="modal-detail-meta-item">
                <span class="font-label">LOCATION</span>
                <p class="meta-value">${data.location}</p>
              </div>
              <div class="modal-detail-meta-item">
                <span class="font-label">PHOTOGRAPHY</span>
                <p class="meta-value">${data.photography}</p>
              </div>
              <div class="modal-detail-meta-item">
                <span class="font-label">STYLING</span>
                <p class="meta-value">${data.styling}</p>
              </div>
              <div class="modal-detail-meta-item">
                <span class="font-label">CATEGORY</span>
                <p class="meta-value">${data.category}</p>
              </div>
              <div class="modal-detail-meta-item">
                <span class="font-label">YEAR</span>
                <p class="meta-value">${data.year}</p>
              </div>
            </div>
            
            <!-- Middle Narrative Column -->
            <div class="modal-narrative-col">
              <p>${data.details}</p>
              ${data.detailsSecondary ? `<p class="modal-narrative-secondary">${data.detailsSecondary}</p>` : ''}
            </div>
            
            <!-- Right Sidebar Image Column -->
            <div class="modal-sidebar-col">
              <div style="width: 100%;">
                <img src="${data.gallery[0] || data.image}" alt="${data.title} detail" style="width: 100%; height: auto; object-fit: contain; display: block;">
                <p class="modal-sidebar-caption">
                  ${data.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0; // reset modal scroll position
    handleScroll();
  };

  const closeProject = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.classList.remove('modal-active');
    document.body.style.overflow = '';
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

  // Close modal with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProject();
    }
  });

  // Contact Form Submission (WhatsApp Redirect)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject') ? document.getElementById('subject').value : '';
      const messageText = document.getElementById('message').value;

      // Construct WhatsApp message
      let waMessage = `Hello Baeroh,\n\n*Name:* ${name}\n*Email:* ${email}`;
      if (subject) {
        waMessage += `\n*Subject:* ${subject}`;
      }
      waMessage += `\n\n*Message:* ${messageText}`;

      // WhatsApp URL (using phone number +91 95096 28808 -> 919509628808)
      const waUrl = `https://wa.me/919509628808?text=${encodeURIComponent(waMessage)}`;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Redirecting to WhatsApp...';
      submitBtn.disabled = true;

      // Redirect in a new tab
      setTimeout(() => {
        window.open(waUrl, '_blank');
        submitBtn.innerText = 'Sent';
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 1000);
    });
  }
});
