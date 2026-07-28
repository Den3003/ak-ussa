import 'modern-normalize';
import '../styles/main.scss';

import { initScrollTimeline } from './modules/timeline';
import { initShowcase } from './modules/showcase';
// import { createAccordion } from './modules/accordion';

document.addEventListener('DOMContentLoaded', () => {
  /* const root = document.querySelector('.accordion');
  createAccordion(root); */
  initShowcase('.showcase');
  initScrollTimeline();
});
