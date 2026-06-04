/* src/main.ts */
import './style.css';
import { initParticles } from './ts/particles';
import { initContactForm } from './ts/contact-form';
import { initNewsFilter } from './ts/news-filter';

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. THEME TOGGLE SYSTEM ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    rootElement.classList.add('light-theme');
    updateThemeToggleIcon(true);
  } else {
    rootElement.classList.remove('light-theme');
    updateThemeToggleIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = rootElement.classList.toggle('light-theme');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateThemeToggleIcon(isLight);
    });
  }

  function updateThemeToggleIcon(isLight: boolean) {
    const sunIcon = document.getElementById('theme-icon-sun');
    const moonIcon = document.getElementById('theme-icon-moon');
    if (sunIcon && moonIcon) {
      if (isLight) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      }
    }
  }

  // --- 2. HEADER SCROLL SHRINK EFFECT ---
  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger initial scroll check

  // --- 3. MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when links are clicked
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }

  // --- 4. INITIALIZE FEATURE-SPECIFIC SCRIPTS ---
  // Particle background for home/other heroes
  if (document.getElementById('particles-canvas')) {
    initParticles('particles-canvas');
  }

  // Contact form validation
  if (document.getElementById('contact-form')) {
    initContactForm();
  }

  // News list filter
  if (document.querySelector('.news-filter-btn')) {
    initNewsFilter();
  }

  // --- 5. ACTIVE LINK STATE ---
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link') as NodeListOf<HTMLAnchorElement>;
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      // Check if current path ends with href or contains it
      if (
        (href === '/' && (currentPath === '/' || currentPath.endsWith('index.html'))) ||
        (href !== '/' && currentPath.includes(href.replace('.html', '')))
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});
