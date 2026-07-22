// Studio manifesto accordion: one panel remains open at a time.
document.addEventListener('DOMContentLoaded', () => {
  const accordion = document.querySelector('[data-studio-accordion]');
  if (!accordion) return;

  const triggers = Array.from(accordion.querySelectorAll('.studio-accordion__trigger'));

  const setExpanded = (activeTrigger) => {
    triggers.forEach((trigger) => {
      const isExpanded = trigger === activeTrigger;
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      const item = trigger.closest('.studio-accordion__item');

      trigger.setAttribute('aria-expanded', String(isExpanded));
      item?.classList.toggle('is-open', isExpanded);
      panel?.setAttribute('aria-hidden', String(!isExpanded));
    });
  };

  const initiallyExpanded = triggers.find((trigger) => trigger.getAttribute('aria-expanded') === 'true');
  if (initiallyExpanded) setExpanded(initiallyExpanded);

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (trigger.getAttribute('aria-expanded') !== 'true') {
        setExpanded(trigger);
      }
    });

    trigger.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && trigger.getAttribute('aria-expanded') !== 'true') {
        event.preventDefault();
        setExpanded(trigger);
      }
    });
  });
});
