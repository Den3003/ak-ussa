import 'modern-normalize';
import '../styles/main.scss';

import { initScrollTimeline } from './modules/timeline';
import { createAccordion } from './modules/accordion';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.accordion');
  createAccordion(root);
  initScrollTimeline();
});


const bg = document.querySelector('.sticky-bg-fixed');
const start = document.getElementById('sticky-start');

const observer = new IntersectionObserver(
  ([entry]) => {
    // как только маркер ушёл за верх экрана — включаем фон,
    // и дальше он держится сам по себе до конца страницы
    bg.classList.toggle('is-visible', entry.boundingClientRect.top <= 0);
  },
  { threshold: 0 }
);

observer.observe(start);