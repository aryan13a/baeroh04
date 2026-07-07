// Baeroh Design Studio - Interactivity & Animations

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Scroll Handling
  const header = document.querySelector('header');
  const isTransparentInit = header ? header.classList.contains('header-transparent') : false;

  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (isTransparentInit) header.classList.remove('header-transparent');
    } else {
      header.classList.remove('scrolled');
      if (isTransparentInit) header.classList.add('header-transparent');
    }
  };
  window.addEventListener('scroll', handleScroll);
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
    'shoreline-studio': {
      title: 'Shoreline Studio',
      subtitle: 'Residential Retreat',
      location: 'Northern Coast, Denmark',
      year: '2024',
      category: 'Residential / Creative Space',
      image: 'assets/515682765_17873657493379780_5956521238110530393_n.jpg',
      description: 'In the windswept coastal landscape of Denmark, where meadow meets dune and pine bends in the coastal breeze, Shoreline Studio rests as a retreat for artistic immersion. Conceived as a space apart from yet connected to the rhythms of a family summerhouse, it balances Danish building tradition with the contemplative sensibility of Japanese architecture.',
      details: 'Designed to serve as a writing and painting studio, the space features natural oak paneling and minimal built-in furniture. A singular monumental window frames the view of the North Sea, creating a constantly shifting backdrop that reflects the seasons. Tactile materials like woven linen and textured plaster finish ensure a quiet, peaceful atmosphere that encourages concentration and creative reflection.',
      gallery: [
        'assets/unnamed.webp',
        'assets/unnamed (1).webp'
      ]
    },
    'dan-bakstudio': {
      title: 'Dan Bakstudio',
      subtitle: 'Artisanal Bakery & Cafe',
      location: 'Varberg, Sweden',
      year: '2024',
      category: 'Hospitality / Retail',
      image: 'assets/515018580_17873657514379780_114806818264473941_n.jpg',
      description: 'Conceived as an open and atmospheric bakery in the coastal town of Varberg, Sweden, Dan Bakstudio reimagines the traditional bakery as a space where craftsmanship becomes part of the sensory experience. Rooted in the beauty of everyday rituals, it unfolds as a warm and immersive environment where materiality, movement, and atmosphere come together in harmony.',
      details: 'The interior balances raw structural concrete walls with soft sand-colored clay plaster finishes. Monolithic travertine counters host the display of artisanal baked goods, while open kitchen views invite guests to observe the baking process. Custom-curated lighting creates shadows and highlights, offering a space that feels deeply connected to the natural rhythms of day and night.',
      gallery: [
        'assets/unnamed (2).webp',
        'assets/unnamed (3).webp'
      ]
    },
    'polene-store': {
      title: 'Polène Flagship Store',
      subtitle: 'Luxury Retail Landmark',
      location: 'Paris, France',
      year: '2025',
      category: 'Commercial / Retail',
      image: 'assets/515375713_17873657511379780_1361309602168478996_n.jpg',
      description: 'Rather than a conventional retail interior, the Polène Flagship Store is conceived as an environment to be felt as much as seen – a place where material, light, and proportion come together to create a calm, tactile landscape that invites visitors to slow down, engage the senses, and experience the enduring relationship between form, hand, and material.',
      details: 'The store layout utilizes organic curves that guide visitors through a series of sculpted spaces. Local sand-colored limestone forms the monumental display tables, while high ceilings and concealed lighting mimic the softness of natural daylight. There is a deliberate emphasis on negative space, allowing the leather handbags to stand out as pieces of sculpture in a landscape of quiet luxury.',
      gallery: [
        'assets/unnamed (4).webp',
        'assets/unnamed (5).webp'
      ]
    },
    'heatherhill-house': {
      title: 'Heatherhill Beach House',
      subtitle: 'Private Sanctuary',
      location: 'Zealand, Denmark',
      year: '2023',
      category: 'Residential / Architecture',
      image: 'assets/515903200_17873657496379780_2094141731495515911_n.jpg',
      description: 'Set in the rolling hills of Heatherhill, this private residence is designed to frame the wild seascape. Simple geometries, natural materials, and a muted color palette create a sense of quiet and security in a rugged environment.',
      details: 'The house follows the contours of the landscape, minimizing its footprint. Internally, a central fireplace divider anchors the living space. Large sliding glass doors slide completely into the walls, creating an uninterrupted transition to the outdoor terrace. The styling features warm tones, custom hemp rugs, and raw solid timber furniture, responding directly to the natural site conditions.',
      gallery: [
        'assets/unnamed.webp',
        'assets/unnamed (2).webp'
      ]
    },
    'reykjavik-apartment': {
      title: 'Reykjavik Apartment',
      subtitle: 'Urban Residence',
      location: 'Reykjavik, Iceland',
      year: '2024',
      category: 'Residential / Interior Styling',
      image: 'assets/515963142_17873657523379780_8362843561450044996_n.jpg',
      description: 'A minimal, calm apartment in the center of Reykjavik. The renovation focused on clarifying the layout, bringing in light, and curating tactile materials that respond to the volcanic light of Iceland.',
      details: 'The design strategy stripped back modern additions to reveal the structural concrete columns, which are balanced with warm dark-stained oak cabinetry and soft linen textiles. Bathrooms are finished in a dark lava stone tiles, while the living areas remain bright and open. A curated selection of custom and vintage furniture gives the space a lived-in, warm, and highly personal character.',
      gallery: [
        'assets/unnamed (1).webp',
        'assets/unnamed (4).webp'
      ]
    }
  };

  // Modal Functionality
  const modal = document.querySelector('.project-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalContent = document.querySelector('.modal-content');

  const openProject = (id) => {
    const data = projects[id];
    if (!data || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-hero">
        <img src="${data.image}" alt="${data.title}">
      </div>
      <div class="container">
        <div class="modal-grid">
          <div>
            <div class="modal-meta-item">
              <span class="font-label">Location</span>
              <p style="margin-top: 8px; font-weight: 300;">${data.location}</p>
            </div>
            <div class="modal-meta-item">
              <span class="font-label">Year</span>
              <p style="margin-top: 8px; font-weight: 300;">${data.year}</p>
            </div>
            <div class="modal-meta-item">
              <span class="font-label">Category</span>
              <p style="margin-top: 8px; font-weight: 300;">${data.category}</p>
            </div>
          </div>
          <div>
            <h1 class="font-display-section" style="margin-bottom: 24px;">${data.title}</h1>
            <p class="font-display-lead" style="margin-bottom: 30px; color: var(--color-olive);">${data.description}</p>
            <p class="font-body-copy" style="color: var(--color-olive); margin-bottom: 40px;">${data.details}</p>
          </div>
        </div>
        
        <div class="modal-gallery">
          ${data.gallery.map((img, i) => `
            <img src="${img}" alt="${data.title} - View ${i + 1}" class="${i % 3 === 2 ? 'span-2' : ''}">
          `).join('')}
        </div>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeProject = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
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

  // Close modal with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProject();
    }
  });

  // Contact Form Submission (Mock)
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerText = 'Thank You';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
});
