export function initGlassSelect() {
  const root = document.querySelector('[data-glass-select]');
  const nativeSelect = root?.querySelector('.glass-select__native');
  const trigger = root?.querySelector('[data-glass-select-trigger]');
  const value = root?.querySelector('[data-glass-select-value]');
  const menu = root?.querySelector('[data-glass-select-menu]');
  if (!root || !nativeSelect || !trigger || !value || !menu) return;

  let optionButtons = [];

  const setOpen = (open, focusSelected = false) => {
    root.classList.toggle('is-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    if (open && focusSelected) {
      requestAnimationFrame(() => optionButtons[nativeSelect.selectedIndex]?.focus());
    }
  };

  const selectIndex = (index, returnFocus = true) => {
    if (index < 0 || index >= nativeSelect.options.length) return;
    nativeSelect.selectedIndex = index;
    nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
    value.textContent = nativeSelect.options[index].textContent.trim();
    optionButtons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-selected', buttonIndex === index);
      button.setAttribute('aria-selected', String(buttonIndex === index));
    });
    setOpen(false);
    if (returnFocus) trigger.focus();
  };

  const buildOptions = () => {
    const selectedIndex = Math.max(nativeSelect.selectedIndex, 0);
    menu.replaceChildren();
    optionButtons = [...nativeSelect.options].map((option, index) => {
      const button = document.createElement('button');
      button.id = `contact-service-option-${index}`;
      button.className = 'glass-select__option';
      button.type = 'button';
      button.setAttribute('role', 'option');
      button.textContent = option.textContent.trim();
      button.classList.toggle('is-selected', index === selectedIndex);
      button.setAttribute('aria-selected', String(index === selectedIndex));
      button.addEventListener('click', () => selectIndex(index));
      menu.append(button);
      return button;
    });
    value.textContent = nativeSelect.options[selectedIndex]?.textContent.trim() || '';
  };

  const moveFocus = (direction) => {
    const currentIndex = optionButtons.indexOf(document.activeElement);
    const fallback = nativeSelect.selectedIndex;
    const nextIndex = (currentIndex < 0 ? fallback : currentIndex) + direction;
    optionButtons[(nextIndex + optionButtons.length) % optionButtons.length]?.focus();
  };

  trigger.addEventListener('click', () => setOpen(menu.hidden, true));
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setOpen(true, true);
    }
  });

  menu.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      optionButtons[event.key === 'Home' ? 0 : optionButtons.length - 1]?.focus();
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      setOpen(false);
      if (event.key === 'Escape') {
        event.preventDefault();
        trigger.focus();
      }
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (!root.contains(event.target)) setOpen(false);
  });
  window.addEventListener('portfolio:languagechange', buildOptions);
  window.addEventListener('resize', () => setOpen(false), { passive: true });

  buildOptions();
}
