/* src/ts/news-filter.ts */

export function initNewsFilter() {
  const filterButtons = document.querySelectorAll('.news-filter-btn') as NodeListOf<HTMLButtonElement>;
  const newsItems = document.querySelectorAll('.news-card') as NodeListOf<HTMLElement>;

  if (filterButtons.length === 0 || newsItems.length === 0) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach((b) => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter') || 'all';

      // Hide all items with fade out animation
      newsItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        item.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            
            // Fade in matching items
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
  });
}
