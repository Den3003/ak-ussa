
export function initScrollTimeline() {
  const timelines = document.querySelectorAll('.timeline__wrapper');
  if (!timelines.length) {
    return;
  }

  // Уважаем системную настройку "уменьшить анимацию"
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    timelines.forEach(el => el.classList.add('is-visible', 'no-anim'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // запускаем один раз
        }
      });
    },
    {
      threshold: 0.25, // блок должен быть виден на 25%
      rootMargin: '0px 0px -10% 0px', // небольшой запас снизу
    }
  );

  timelines.forEach((el) => observer.observe(el));
}