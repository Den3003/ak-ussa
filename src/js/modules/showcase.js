export function initShowcase(containerSelector = '#showcase-block') {
  const container = document.querySelector(containerSelector);
  if (!container) {
    return;
  }

  const items = Array.from(container.querySelectorAll('.showcase__item'));

  /**
   * Активация выбранного раздела
   * @param {number} activeIndex 
   */
  function setActiveItem(activeIndex) {
    items.forEach((item, index) => {
      const isActive = index === activeIndex;

      // Переключаем активный класс на контейнере раздела
      item.classList.toggle('showcase__item--active', isActive);

      // Обновляем атрибуты доступности (A11y)
      const button = item.querySelector('.showcase__tab');
      if (button) {
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        button.setAttribute('tabindex', isActive ? '0' : '-1');
      }
    });
  }

  // Делегирование события клика
  container.addEventListener('click', (e) => {
    const button = e.target.closest('.showcase__tab');
    if (!button) {
      return;
    }

    const parentItem = button.closest('.showcase__item');
    if (!parentItem) {
      return;
    }

    const index = items.indexOf(parentItem);
    if (index !== -1) {
      setActiveItem(index);
    }
  });

  const keyHandlers = {
    ArrowDown: (idx, len) => (idx + 1) % len,
    ArrowUp: (idx, len) => (idx - 1 + len) % len,
    Home: () => 0,
    End: (_, len) => len - 1,
  };

  // Навигация с клавиатуры (стрелки Вверх/Вниз, Home, End)
  container.addEventListener('keydown', (e) => {
    const currentActiveIndex = items.findIndex(item => item.classList.contains('showcase__item--active'));

    const handler = keyHandlers[e.key];
    if (!handler || e.ctrlKey || e.metaKey) {
      return;
    }

    e.preventDefault();

    const newIndex = handler(currentActiveIndex, items.length);
    setActiveItem(newIndex);

    // Устанавливаем фокус на активную кнопку
    const newButton = items[newIndex].querySelector('.showcase__tab');
    if (newButton) {
      newButton.focus();
    }
  });
}