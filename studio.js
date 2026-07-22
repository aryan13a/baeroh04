// Studio Table interaction: hover/focus previews a stage; click commits it.
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('[data-studio-table]');
  if (!table) return;

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
});
