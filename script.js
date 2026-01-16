// Hermes site JS: mobile menu, gallery lightbox, booking -> WhatsApp
(function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Lightbox for gallery
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.classList.add('show');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  document.querySelectorAll('#gallery img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Booking -> WhatsApp (no server)
  const form = document.getElementById('bookingForm');
  
    // Enforce at least one service checkbox selected
    const serviceCheckboxes = Array.from(form.querySelectorAll('input[name="service"]'));
    const firstService = serviceCheckboxes[0];
    const syncServiceRequired = () => {
      const anyChecked = serviceCheckboxes.some(cb => cb.checked);
      if (firstService) firstService.required = !anyChecked;
    };
    serviceCheckboxes.forEach(cb => cb.addEventListener('change', syncServiceRequired));
    syncServiceRequired();

// Populate time slots (09:00-22:00) in 30-minute intervals
  const timeSel = document.getElementById('timeSlot');
  if (timeSel && timeSel.options.length <= 1) {
    const start = 9 * 60;   // 09:00
    const end = 22 * 60;    // 22:00
    for (let m = start; m < end; m += 30) {
      const h1 = String(Math.floor(m / 60)).padStart(2, '0');
      const min1 = String(m % 60).padStart(2, '0');
      const m2 = m + 30;
      const h2 = String(Math.floor(m2 / 60)).padStart(2, '0');
      const min2 = String(m2 % 60).padStart(2, '0');
      const label = `${h1}:${min1} - ${h2}:${min2}`;
      const opt = document.createElement('option');
      opt.value = label;
      opt.textContent = label;
      timeSel.appendChild(opt);
    }
  }
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const services = (data.getAll('service') || []).map(s => (s||'').toString().trim()).filter(Boolean);
      const serviceText = services.join(', ');
      const time = (data.get('time') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      const lines = [
        'Përshëndetje! Dua të rezervoj një takim te Hermes Men\'s Salon.',
        name ? 'Emri: ' + name : null,
        phone ? 'Telefoni: ' + phone : null,
        serviceText ? 'Shërbimet: ' + serviceText : null,
        time ? 'Orari: ' + time : null,
        message ? 'Mesazh: ' + message : null
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const wa = 'https://wa.me/355698892469?text=' + text;
      window.open(wa, '_blank');
    });
  }
})();
