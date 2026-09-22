/**
 * JAPAN TOURS — INTERACTIVE JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Header scroll detection
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Booking Modal Logic
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const bookButtons = document.querySelectorAll('.open-booking-modal');
  const modalForm = document.getElementById('modal-form');

  const openModal = () => {
    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  bookButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  modalClose.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Reserving...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Thank you! Your Japan tour booking request has been received. Our team will contact you shortly.');
        modalForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        closeModal();
      }, 1000);
    });
  }

  // 3. Request Form Submission (Bottom Section)
  const requestForm = document.getElementById('request-form');
  if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('btn-submit-form');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Request Sent Successfully! We will reach out to you within 24 hours.');
        requestForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 900);
    });
  }

  // 4. Hero Card Click Interaction (Scrolls to relevant timeline/section)
  const heroCards = document.querySelectorAll('.hero-card');
  heroCards.forEach(card => {
    card.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});
