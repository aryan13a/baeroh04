// Studio Table interaction: hover/focus previews a stage; click commits it.
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('[data-studio-table]');
  if (table) {
    const stageControls = Array.from(table.querySelectorAll('[data-studio-stage]'));
    const stageTabs = Array.from(table.querySelectorAll('.studio-table-tab'));
    const description = table.querySelector('#studio-stage-description');
    const stageDescriptions = [
      'Conversation and context.',
      'Habits, movement and need.',
      'Space, material and atmosphere.',
      'Detail, coordination and execution.'
    ];
    let committedStage = 0;

    const renderStudioStage = (index) => {
      if (!Number.isInteger(index) || index < 0 || index >= stageDescriptions.length) return;

      stageControls.forEach((control) => {
        const isActive = Number(control.dataset.studioStage) === index;
        control.classList.toggle('is-active', isActive);
        if (control.matches('[role="tab"]')) {
          control.setAttribute('aria-selected', String(isActive));
        } else {
          control.setAttribute('aria-pressed', String(isActive));
        }
      });

      if (description) {
        description.textContent = stageDescriptions[index];
        description.setAttribute('aria-labelledby', `studio-stage-tab-${index + 1}`);
      }
    };

    // Kept public so the active Studio stage can be updated from future controls.
    window.setActiveStudioStage = (index) => {
      const parsedIndex = Number(index);
      if (!Number.isInteger(parsedIndex) || parsedIndex < 0 || parsedIndex >= stageDescriptions.length) return;
      committedStage = parsedIndex;
      renderStudioStage(committedStage);
    };

    stageControls.forEach((control) => {
      const index = Number(control.dataset.studioStage);

      control.addEventListener('pointerenter', () => renderStudioStage(index));
      control.addEventListener('focus', () => renderStudioStage(index));
      control.addEventListener('click', () => window.setActiveStudioStage(index));
    });

    table.addEventListener('pointerleave', () => renderStudioStage(committedStage));
    table.addEventListener('focusout', (event) => {
      if (!table.contains(event.relatedTarget)) renderStudioStage(committedStage);
    });

    stageTabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();

        let nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = (index + 1) % stageTabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (index - 1 + stageTabs.length) % stageTabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = stageTabs.length - 1;

        stageTabs[nextIndex].focus();
        window.setActiveStudioStage(nextIndex);
      });
    });

    window.setActiveStudioStage(0);
  }

  // Mobile founder carousel: native swipe with a restrained numeric progress indicator.
  const founderCarousel = document.querySelector('[data-founder-carousel]');
  if (founderCarousel) {
    const founderTrack = founderCarousel.querySelector('[data-founder-track]');
    const founderSlides = Array.from(founderCarousel.querySelectorAll('[data-founder-slide]'));
    const founderCurrent = founderCarousel.querySelector('[data-founder-current]');
    let activeFounderIndex = 0;
    let founderScrollTicking = false;

    const updateFounderProgress = () => {
      if (!founderTrack || founderSlides.length === 0) return;

      const trackCenter = founderTrack.scrollLeft + (founderTrack.clientWidth / 2);
      activeFounderIndex = founderSlides.reduce((closestIndex, slide, index) => {
        const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
        const closestSlide = founderSlides[closestIndex];
        const closestCenter = closestSlide.offsetLeft + (closestSlide.offsetWidth / 2);
        return Math.abs(slideCenter - trackCenter) < Math.abs(closestCenter - trackCenter)
          ? index
          : closestIndex;
      }, 0);

      if (founderCurrent) founderCurrent.textContent = String(activeFounderIndex + 1);
      founderSlides.forEach((slide, index) => {
        if (index === activeFounderIndex) {
          slide.setAttribute('aria-current', 'true');
        } else {
          slide.removeAttribute('aria-current');
        }
      });
    };

    founderTrack?.addEventListener('scroll', () => {
      if (founderScrollTicking) return;
      founderScrollTicking = true;
      window.requestAnimationFrame(() => {
        updateFounderProgress();
        founderScrollTicking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', updateFounderProgress, { passive: true });
    updateFounderProgress();
  }
});
