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
    'harbour-swivel': {
      title: 'Harbour Lounge Swivel',
      subtitle: 'Design & Furniture',
      location: 'Copenhagen, Denmark',
      year: '2026',
      category: 'Design / Furniture',
      image: 'assets/unnamed (2).webp',
      description: 'A luxurious bouclé swivel armchair designed for comfort and sensory touch, balancing soft organic shapes with a clean structural metal base.',
      details: 'Crafted in partnership with MENU, the Harbour Lounge Chair features a molded foam shell covered in premium textured bouclé wool fabric. The sleek swivel base allows for effortless movement, making it a perfect fit for minimalist living spaces, library corners, and modern workplace environments.',
      detailsSecondary: 'The design emphasizes tactile simplicity and structural integrity. By stripping away excess ornamentation, the chair highlights the conversation between the soft, organic textile and the dark, architectural frame.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The Harbour Lounge Swivel in a light neutral bouclé, captured against a minimalist plaster wall to highlight its organic form.',
      gallery: [
        'assets/unnamed (2).webp',
        'assets/unnamed (3).webp'
      ]
    },
    'eave-chair': {
      title: 'Eave Seamline Lounge Chair',
      subtitle: 'Design & Furniture',
      location: 'Copenhagen, Denmark',
      year: '2026',
      category: 'Design / Furniture',
      image: 'assets/unnamed (3).webp',
      description: 'Inspired by the eaves of a building, the Eave Seamline Lounge Chair is a study in organic geometry, textures, and structural support.',
      details: 'With its curved, welcoming form, this lounge chair is upholstered in high-end neutral bouclé fabric. The name is derived from architecture, reflecting how the design integrates form and structure. The low profile and deep seat offer a relaxed posture, combining contemporary Danish aesthetic with timeless comfort.',
      detailsSecondary: 'Designed to fit seamlessly into open-plan spaces, the Eave Lounge Chair encourages relaxation and connection. Its distinct seamline detailing outlines the organic curves, emphasizing the sculptural qualities of the piece.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Detail of the Eave Seamline chair, showcasing the texture of the bouclé fabric and the soft curves of the low-slung frame.',
      gallery: [
        'assets/unnamed (3).webp',
        'assets/unnamed (2).webp'
      ]
    },
    'composed-matter': {
      title: 'Composed Matter',
      subtitle: 'Creative Exhibition',
      location: 'Galleri Sonja, Denmark',
      year: '2026',
      category: 'Creative / Exhibitions',
      image: 'assets/unnamed.webp',
      description: 'Rooted in a shared appreciation for tactility, craftsmanship and sensory experience, Composed Matter unfolded as a series of installations where eelgrass, light and touch entered into dialogue.',
      details: 'The installation explored natural ecological materials, including textured cork wall panels and compressed eelgrass screens. The curation prioritized silence, tactile exploration, and negative space. It acted as an experimental sanctuary during the 3daysofdesign exhibition, highlighting sustainable local design craft.',
      detailsSecondary: 'By showcasing the artistic potential of raw, native materials, the exhibition invited visitors to pause and engage with their surroundings in a quiet, mindful way. The installation serves as a testament to the power of nature-led design.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'An view of the Composed Matter installation, illustrating the serene play of light on organic textures and cork panels.',
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
      description: 'A refined office space that blends warmth, functionality, and modern sophistication. The natural wood desk, soft upholstered chairs, and ambient lighting create a welcoming environment for focused work and meaningful conversations. Clean lines, neutral tones, and thoughtful detailing give the space a timeless aesthetic that feels both professional and comfortable.',
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
    'shoreline-studio': {
      title: 'Shoreline Studio',
      subtitle: 'Residential Retreat',
      location: 'Northern Coast, Denmark',
      year: '2024',
      category: 'Residential / Creative Space',
      image: 'assets/unnamed (5).webp',
      description: 'In the windswept coastal landscape of Denmark, where meadow meets dune and pine bends in the coastal breeze, Shoreline Studio rests as a retreat for artistic immersion. Conceived as a space apart from yet connected to the rhythms of a summerhouse, it balances Danish building tradition with the contemplative sensibility of Japanese architecture.',
      details: 'Designed to serve as a writing and painting studio, the space features natural oak paneling and minimal built-in furniture. A singular monumental window frames the view of the North Sea, creating a constantly shifting backdrop that reflects the seasons. Tactile materials like woven linen and textured plaster finish ensure a quiet, peaceful atmosphere that encourages concentration and creative reflection.',
      detailsSecondary: 'The interior design focuses on local oak craftsmanship and warm, earthly tones. Sliding screens allow for control of natural light, mimicking shoji screens, while the exterior charred timber cladding blends the structure into the coastal tree line.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'The studio workspace, showing the custom oak desk and the window looking out to the wild Danish coastal dunes.',
      gallery: [
        'assets/unnamed (5).webp',
        'assets/unnamed (2).webp'
      ]
    },
    'dan-bakstudio': {
      title: 'Dan Bakstudio',
      subtitle: 'Artisanal Bakery & Cafe',
      location: 'Varberg, Sweden',
      year: '2024',
      category: 'Hospitality / Retail',
      image: 'assets/unnamed (4).webp',
      description: 'Conceived as an open and atmospheric bakery in the coastal town of Varberg, Sweden, Dan Bakstudio reimagines the traditional bakery as a space where craftsmanship becomes part of the sensory experience. Rooted in the beauty of everyday rituals, it unfolds as a warm and immersive environment where materiality, movement, and atmosphere come together in harmony.',
      details: 'The interior balances raw structural concrete walls with soft sand-colored clay plaster finishes. Monolithic travertine counters host the display of artisanal baked goods, while open kitchen views invite guests to observe the baking process. Custom-curated lighting creates shadows and highlights, offering a space that feels deeply connected to the natural rhythms of day and night.',
      detailsSecondary: 'Warm timber benches and stools invite guests to linger and enjoy the aromas of fresh sourdough. The selection of materials reflects the local coastal environment, ensuring the space feels both grounded and contemporary.',
      photography: 'Common Studio',
      styling: 'Stacy Tsai / Wool Studio',
      caption: 'Monolithic stone display counter showing the interaction of light, shadow, and tactile finishes inside the bakery.',
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
      const id = card.getAttribute('data-project');
      openProject(id);
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
