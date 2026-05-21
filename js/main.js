import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { supabaseUrl, supabaseKey } from './config.js';

const supabase = createClient(supabaseUrl, supabaseKey);

const header = document.querySelector('.header');
const menuBtn = document.querySelector('.header__menu-btn');
const nav = document.querySelector('.header__nav');
const form = document.querySelector('.discovery-form');
const formMessage = document.querySelector('.discovery-form__message');
const hero = document.querySelector('.hero');
const topBtn = document.querySelector('.top-btn');

/* Header scroll background & top button visibility */
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('active');
  } else {
    header.classList.remove('active');
  }

  if (window.scrollY > 400) {
    topBtn?.classList.add('is-visible');
  } else {
    topBtn?.classList.remove('is-visible');
  }
}, { passive: true });

topBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Mobile menu */
menuBtn?.addEventListener('click', () => {
  const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('is-open', !isOpen);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  });
});

/* Hero load animation */
requestAnimationFrame(() => {
  hero?.classList.add('is-loaded');
});

/* Image fallback for local assets */
const imageFallbacks = {
  marrakech: 'assets/perfume1.jpg',
  tacit: 'assets/perfume2.jpg',
  hwyl: 'assets/perfume3.jpg',
  eremia: 'assets/perfume4.jpg',
  eidesis: 'assets/perfume5.jpg',
  steorra: 'assets/perfume6.jpg',
  aurner: 'assets/perfume7.jpg',
  ouranon: 'assets/perfume8.jpg',
  hero: 'assets/mainvisual.png',
};

document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', () => {
    const product = img.closest('[data-product]')?.dataset.product;
    const key = product || (img.closest('.hero') ? 'hero' : null);
    if (key && imageFallbacks[key] && !img.src.endsWith(imageFallbacks[key])) {
      img.src = imageFallbacks[key];
    }
  }, { once: true });
});

/* Scroll reveal */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* Collection carousel */
const collectionSlider = document.querySelector('[data-collection-slider]');

if (collectionSlider) {
  const track = collectionSlider.querySelector('.collection-slider__track');
  const prevBtn = collectionSlider.querySelector('.collection-slider__btn--prev');
  const nextBtn = collectionSlider.querySelector('.collection-slider__btn--next');
  const viewport = collectionSlider.querySelector('.collection-slider__viewport');
  const cards = [...track.querySelectorAll('.product-card')];
  let slideIndex = 0;

  function getGap() {
    return parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
  }

  function getVisibleCount() {
    if (window.matchMedia('(max-width: 600px)').matches) return 1;
    if (window.matchMedia('(max-width: 1024px)').matches) return 2;
    return 4;
  }

  function updateCollectionSlider() {
    const visible = getVisibleCount();
    const maxIndex = Math.max(0, cards.length - visible);
    slideIndex = Math.min(slideIndex, maxIndex);

    const gap = getGap();
    const slideWidth = (viewport.clientWidth - gap * (visible - 1)) / visible;
    track.style.setProperty('--slide-width', `${slideWidth}px`);
    cards.forEach((card) => {
      card.style.flexBasis = `${slideWidth}px`;
      card.style.width = `${slideWidth}px`;
    });

    const offset = slideIndex * (slideWidth + gap);
    track.style.transform = `translate3d(-${offset}px, 0, 0)`;

    prevBtn.disabled = slideIndex === 0;
    nextBtn.disabled = slideIndex >= maxIndex;
  }

  prevBtn.addEventListener('click', () => {
    if (slideIndex > 0) {
      slideIndex -= 1;
      updateCollectionSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    const maxIndex = Math.max(0, cards.length - getVisibleCount());
    if (slideIndex < maxIndex) {
      slideIndex += 1;
      updateCollectionSlider();
    }
  });

  window.addEventListener('resize', updateCollectionSlider);
  updateCollectionSlider();
}

/* Form validation & Supabase submit */
function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = 'discovery-form__message';
  if (type) formMessage.classList.add(`is-${type}`);
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('.discovery-form__submit');
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const email = form.email.value.trim();

  if (!name) {
    showMessage('이름을 입력해 주세요.', 'error');
    form.name.focus();
    return;
  }

  if (!validatePhone(phone)) {
    showMessage('올바른 핸드폰 번호를 입력해 주세요.', 'error');
    form.phone.focus();
    return;
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showMessage('올바른 이메일을 입력해 주세요.', 'error');
    form.email.focus();
    return;
  }

  if (!form.privacy?.checked) {
    showMessage('개인정보 수집 및 이용에 동의해 주세요.', 'error');
    form.privacy?.focus();
    return;
  }

  submitBtn.disabled = true;
  showMessage('신청 중...', '');

  const { error } = await supabase.from('discovery_signups').insert([
    { name, phone, email }
  ]);

  submitBtn.disabled = false;

  if (error) {
    console.error(error);
    showMessage('신청에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    return;
  }

  showMessage('신청이 완료되었습니다.', 'success');
  form.reset();
});
