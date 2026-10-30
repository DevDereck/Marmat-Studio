/* ==========================================================================
   MARMAT STUDIO - ATELIER FLORAL & GLOBOS COSTA RICA
   Lógica Interactiva & Cotizaciones Directas a WhatsApp (+506 7165-3777)
   ========================================================================== */

const MARMAT_WHATSAPP = '50671653777';

function openWhatsAppMessage(message) {
  const url = new URL('https://api.whatsapp.com/send');
  url.searchParams.set('phone', MARMAT_WHATSAPP);
  url.searchParams.set('text', message);
  window.open(url.toString(), '_blank');
}

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MENÚ MÓVIL (DRAWER RESPONSIVO)
  // ==========================================
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileIcon = mobileBtn ? mobileBtn.querySelector('.material-symbols-outlined') : null;

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      if (mobileIcon) {
        mobileIcon.textContent = isHidden ? 'menu' : 'close';
      }
    });

    // Cerrar el menú al hacer click en cualquiera de los enlaces móviles
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (mobileIcon) mobileIcon.textContent = 'menu';
      });
    });
  }

  // ==========================================
  // 2. FILTRADO Y BÚSQUEDA DEL CATÁLOGO EN VIVO
  // ==========================================
  const catalogFilters = document.querySelectorAll('#catalog-filters .filter-btn');
  const productCards = document.querySelectorAll('#products-grid .product-card');
  const searchInput = document.getElementById('catalog-search');

  function filterCatalog() {
    const activeFilterBtn = document.querySelector('#catalog-filters .active-filter');
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

      const matchCategory = (activeCategory === 'all' || category === activeCategory);
      const matchQuery = (query === '' || title.includes(query) || desc.includes(query));

      if (matchCategory && matchQuery) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  if (catalogFilters.length > 0) {
    catalogFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        catalogFilters.forEach(b => {
          b.classList.remove('active-filter', 'bg-lila', 'text-white', 'shadow-lila-soft');
          b.classList.add('bg-white', 'text-ink-muted');
        });
        btn.classList.add('active-filter', 'bg-lila', 'text-white', 'shadow-lila-soft');
        btn.classList.remove('bg-white', 'text-ink-muted');
        filterCatalog();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCatalog);
  }

  // ==========================================
  // 3. COTIZACIÓN DIRECTA POR WHATSAPP (PRODUCTO)
  // ==========================================
  window.sendProductQuote = function (productName, price, btn) {
    const card = btn.closest('.product-card');
    const dateInput = card.querySelector('.order-date');
    const phraseInput = card.querySelector('.order-phrase');

    const dateVal = dateInput && dateInput.value ? dateInput.value : 'Por coordinar con Marmat';
    const phraseVal = phraseInput && phraseInput.value.trim() !== '' ? phraseInput.value.trim() : 'Por definir con Marmat';

    const message = 
      `Hola Marmat Studio! Deseo cotizar el siguiente producto del catálogo:\n\n` +
      `🌸 Producto: ${productName}\n` +
      `💰 Precio de referencia: ${price}\n` +
      `📅 Fecha estimada de entrega GAM: ${dateVal}\n` +
      `📝 Frase en el globo / dedicatoria: "${phraseVal}"\n\n` +
      `¿Me podrían confirmar disponibilidad de agenda y zona de entrega? ¡Gracias!`;

    openWhatsAppMessage(message);
  };

  // ==========================================
  // 4. COTIZADOR INTERACTIVO A MEDIDA EN 3 PASOS
  // ==========================================
  let customOccasion = "Cumpleaños";
  let customPalette = "Firma Marmat (Lila Pastel & Verde Agua)";
  let customBudget = "₡35,000 - ₡60,000 CRC";

  // Paso 1: Ocasión
  document.querySelectorAll('#step-occasion .step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#step-occasion .step-btn').forEach(b => {
        b.classList.remove('active-step', 'bg-lila-soft', 'text-lila-dark', 'font-bold', 'border-lila-light');
        b.classList.add('bg-white', 'text-ink', 'font-medium', 'border-surface-border');
      });
      btn.classList.remove('bg-white', 'text-ink', 'font-medium', 'border-surface-border');
      btn.classList.add('active-step', 'bg-lila-soft', 'text-lila-dark', 'font-bold', 'border-lila-light');
      customOccasion = btn.getAttribute('data-val');
    });
  });

  // Paso 2: Paleta
  document.querySelectorAll('#step-palette .palette-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#step-palette .palette-btn').forEach(b => {
        b.classList.remove('active-palette', 'bg-lila-soft', 'text-lila-dark', 'font-bold', 'border-lila-light');
        b.classList.add('bg-white', 'text-ink', 'border-surface-border');
      });
      btn.classList.remove('bg-white', 'text-ink', 'border-surface-border');
      btn.classList.add('active-palette', 'bg-lila-soft', 'text-lila-dark', 'font-bold', 'border-lila-light');
      customPalette = btn.getAttribute('data-val');
    });
  });

  // Paso 3: Presupuesto
  document.querySelectorAll('#step-budget .budget-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#step-budget .budget-btn').forEach(b => {
        b.classList.remove('active-budget', 'bg-lila', 'text-white', 'shadow-lila-soft', 'font-bold');
        b.classList.add('bg-white', 'text-ink', 'font-semibold', 'border-surface-border');
      });
      btn.classList.remove('bg-white', 'text-ink', 'font-semibold', 'border-surface-border');
      btn.classList.add('active-budget', 'bg-lila', 'text-white', 'shadow-lila-soft', 'font-bold');
      customBudget = btn.getAttribute('data-val');
    });
  });

  window.sendCustomWizardQuote = function () {
    const notesInput = document.getElementById('custom-notes');
    const extraNotes = notesInput && notesInput.value.trim() !== '' ? notesInput.value.trim() : 'Sin requerimientos extras';

    const message = 
      `Hola Marmat Studio! Acabo de diseñar mi arreglo personalizado en el cotizador de la web:\n\n` +
      `✨ Ocasión especial: ${customOccasion}\n` +
      `🎨 Paleta de color: ${customPalette}\n` +
      `💰 Presupuesto estimado: ${customBudget}\n` +
      `📝 Ideas / notas adicionales: ${extraNotes}\n\n` +
      `¿Me podrían brindar asesoría y fotos de referencia para entrega en el GAM?`;

    openWhatsAppMessage(message);
  };

  // ==========================================================================
  // 5. TESTIMONIOS: CONTROLES DE AUTO-MOVIMIENTO MARQUEE
  // ==========================================================================
  const marqueeTrack = document.getElementById('marquee-track');
  const toggleBtn = document.getElementById('testimonial-toggle-btn');
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');
  const statusDot = document.getElementById('testimonial-status-dot');
  const statusText = document.getElementById('testimonial-status-text');

  if (marqueeTrack && toggleBtn) {
    let isPaused = false;

    // Botón Pausar / Reanudar
    toggleBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      if (isPaused) {
        marqueeTrack.classList.add('is-paused');
        toggleBtn.innerHTML = '<span class="material-symbols-outlined text-[17px]">play_arrow</span><span>Reanudar</span>';
        if (statusDot) statusDot.classList.replace('bg-mint', 'bg-gray-400');
        if (statusText) statusText.textContent = 'Pausado';
      } else {
        marqueeTrack.classList.remove('is-paused');
        toggleBtn.innerHTML = '<span class="material-symbols-outlined text-[17px]">pause</span><span>Pausar</span>';
        if (statusDot) statusDot.classList.replace('bg-gray-400', 'bg-mint');
        if (statusText) statusText.textContent = 'En movimiento continuo';
      }
    });

    // Botón Anterior: invierte la dirección hacia la derecha
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        marqueeTrack.classList.add('reverse-marquee');
        if (statusText) statusText.textContent = 'Hacia la derecha';
        setTimeout(() => {
          marqueeTrack.classList.remove('reverse-marquee');
          if (!isPaused && statusText) statusText.textContent = 'En movimiento continuo';
        }, 4000);
      });
    }

    // Botón Siguiente: asegura dirección normal y acelera suavemente
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        marqueeTrack.classList.remove('reverse-marquee');
        marqueeTrack.classList.add('fast-marquee');
        setTimeout(() => {
          marqueeTrack.classList.remove('fast-marquee');
        }, 3000);
      });
    }
  }

  // ==========================================
  // 6. PREGUNTAS FRECUENTES (FAQ ACORDEÓN) — sección galería eliminada
  // ==========================================
  document.querySelectorAll('#faq-accordion .faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const icon = item.querySelector('.faq-icon');
      const isHidden = content.classList.contains('hidden');

      // Cerrar todos los demás items para mantener orden limpio
      document.querySelectorAll('#faq-accordion .faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('#faq-accordion .faq-icon').forEach(i => i.classList.remove('rotate-180'));

      // Abrir o cerrar el actual
      if (isHidden) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
      }
    });
  });

});
