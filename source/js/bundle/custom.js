document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.js-dropdown');

  function closeDropdown() {
    dropdowns.forEach((el) => {
      const Btn = el.querySelector('.js-dropdown-btn');
      const Content = el.querySelector('.js-dropdown-content');

      Btn.classList.remove('open');
      Content.classList.remove('active');
    });
  }

  function toggleDropdown(item) {
    const dropdownBtn = item.querySelector('.js-dropdown-btn');
    const dropdownContent = item.querySelector('.js-dropdown-content');

    if (!dropdownBtn.classList.contains('open')) {
      closeDropdown();

      dropdownBtn.classList.add('open');
      dropdownContent.classList.add('active');

      return;
    }

    closeDropdown();
  }

  dropdowns.forEach((el) => {
    el.querySelector('.js-dropdown-btn').addEventListener(
      'click',
      (event) => {
        event.stopPropagation();
        toggleDropdown(el);
      },
    );
  });

  window.addEventListener('click', (event) => {
    closeDropdown();
  });



});



