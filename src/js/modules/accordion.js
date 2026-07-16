/**
 * Список слева.
 * Текст описания едет по вертикали к активному пункту (--desc-offset).
 * Картинка — статичный блок фиксированного размера/позиции,
 * при переключении пункта у неё меняется только src (с фейдом).
 * Без ES6-классов — обычные функции и замыкания.
 */

export function createAccordion(root) {
  const items = Array.from(root.querySelectorAll('.accordion__item'));
  const contentOuter = root.querySelector('.accordion__content-outer');
  const descEl = root.querySelector('.accordion__desc');
  const imgEl = root.querySelector('.accordion__image');

  const SWITCH_DELAY = 160; // должен совпадать с $transition-fast в SCSS

  let activeItem = items.find((item) => item.dataset.open === 'true') || null;

  // ---- Текст: подстраиваем вертикальный сдвиг под активный пункт ----
  function moveDescTo(item) {
    if (!item) {
      return;
    };
    const trigger = item.querySelector('.accordion__trigger');
    const offset = trigger.offsetTop; // позиция триггера внутри списка
    descEl.style.setProperty('--desc-offset', `${offset}px`);
  }

  // ---- Подстановка текста и картинки из data-атрибутов ----
  function fillContent(item) {
    const trigger = item.querySelector('.accordion__trigger');
    descEl.textContent = trigger.dataset.desc || '';
    imgEl.src = trigger.dataset.img || '';
    imgEl.alt = trigger.dataset.alt || '';
  }

  // ---- Схлопывание / разворот ВСЕГО правого блока по высоте ----
  function expandOuter() {
    contentOuter.dataset.collapsed = 'false';
  }

  function collapseOuter() {
    contentOuter.dataset.collapsed = 'true';
  }

  // ---- Переключение на новый активный пункт ----
  function activateItem(item) {
    const wasCollapsed = contentOuter.dataset.collapsed === 'true';

    items.forEach((i) => {
      const isTarget = i === item;
      i.dataset.open = String(isTarget);
      i.querySelector('.accordion__trigger').setAttribute('aria-expanded', String(isTarget));
    });

    activeItem = item;
    moveDescTo(item);
    expandOuter();

    // короткий fade текста и картинки перед подменой содержимого —
    // картинка при этом НЕ меняет размер и позицию, только opacity/src.
    // Если блок до этого был схлопнут — не мигаем контентом,
    // а ждём, пока анимация высоты подрастёт
    const fillDelay = wasCollapsed ? 0 : SWITCH_DELAY;

    if (!wasCollapsed) {
      descEl.classList.add('accordion__desc--switching');
      imgEl.classList.add('accordion__image--switching');
    }

    window.setTimeout(() => {
      fillContent(item);
      descEl.classList.remove('accordion__desc--switching');
      imgEl.classList.remove('accordion__image--switching');
    }, fillDelay);
  }

  function deactivateAll() {
    items.forEach((i) => {
      i.dataset.open = 'false';
      i.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
    });
    activeItem = null;
    collapseOuter(); // анимированно схлопываем высоту блока текст+картинка
  }

  function toggleItem(item) {
    if (activeItem === item) {
      deactivateAll();
    } else {
      activateItem(item);
    }
  }

  // ---- Навигация стрелками между заголовками ----
  function focusTriggerAt(index) {
    const clamped = (index + items.length) % items.length;
    items[clamped].querySelector('.accordion__trigger').focus();
  }

  function handleKeydown(event, index) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusTriggerAt(index + 1);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusTriggerAt(index - 1);
    }
  }

  items.forEach((item, index) => {
    const trigger = item.querySelector('.accordion__trigger');
    trigger.addEventListener('click', () => toggleItem(item));
    trigger.addEventListener('keydown', (event) => handleKeydown(event, index));
  });

  // Пересчитываем сдвиг текста при ресайзе (высота строк может измениться)
  window.addEventListener('resize', () => moveDescTo(activeItem));

  // ---- Начальное состояние ----
  if (activeItem) {
    fillContent(activeItem);
    moveDescTo(activeItem);
    expandOuter();
  } else {
    collapseOuter();
  }

  return { activateItem, deactivateAll, toggleItem };
}