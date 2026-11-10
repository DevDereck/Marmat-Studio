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
  const categoryButtons = document.querySelectorAll('#catalog-categories .catalog-category-card');
  const categoryPicker = document.getElementById('catalog-categories');
  const productsView = document.getElementById('catalog-products-view');
  const backToCategoriesButton = document.getElementById('catalog-back-button');
  const activeCategoryTitle = document.getElementById('catalog-active-title');
  const activeCategoryDescription = document.getElementById('catalog-active-description');
  const resultsCount = document.getElementById('catalog-results-count');
  const emptyState = document.getElementById('catalog-empty-state');
  const emptyStateTitle = document.getElementById('catalog-empty-title');
  const emptyStateMessage = document.getElementById('catalog-empty-message');
  const emptyStateLink = emptyState ? emptyState.querySelector('a') : null;
  const productCards = document.querySelectorAll('#products-grid .product-card');
  const productsGrid = document.getElementById('products-grid');
  const searchInput = document.getElementById('catalog-search');
  let activeCategory = null;

  function scrollToCatalogView(element) {
    const stickyHeader = document.querySelector('header');
    const headerHeight = stickyHeader ? stickyHeader.getBoundingClientRect().height : 0;
    const top = element.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top, behavior: 'instant' });
  }

  function filterCatalog() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let categoryProductCount = 0;
    let visibleProductCount = 0;

    productCards.forEach(card => {
      const categories = (card.getAttribute('data-categories') || card.getAttribute('data-category') || '')
        .split(/\s+/);
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

      const matchCategory = activeCategory !== null && categories.includes(activeCategory);
      const matchQuery = query === '' || title.includes(query) || desc.includes(query);
      const isVisible = matchCategory && matchQuery;

      if (matchCategory) categoryProductCount += 1;
      if (isVisible) {
        visibleProductCount += 1;
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    if (productsGrid) {
      productsGrid.classList.toggle('hidden', activeCategory === null || visibleProductCount === 0);
    }

    if (resultsCount) {
      resultsCount.textContent = `${visibleProductCount} ${visibleProductCount === 1 ? 'opción' : 'opciones'}`;
    }

    if (emptyState) {
      const showEmptyState = activeCategory !== null && visibleProductCount === 0;
      emptyState.classList.toggle('hidden', !showEmptyState);

      if (showEmptyState) {
        const categoryHasProducts = categoryProductCount > 0;
        emptyStateTitle.textContent = categoryHasProducts
          ? 'No encontramos resultados'
          : 'Estamos preparando esta categoría';
        emptyStateMessage.textContent = categoryHasProducts
          ? 'Prueba con otros términos de búsqueda.'
          : 'Consulta por WhatsApp las opciones disponibles para esta categoría.';
        if (emptyStateLink) emptyStateLink.classList.toggle('hidden', categoryHasProducts);
      }
    }
  }

  if (categoryButtons.length > 0) {
    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        activeCategory = button.getAttribute('data-category');
        if (activeCategoryTitle) {
          activeCategoryTitle.textContent = button.querySelector('.catalog-category-title')?.textContent || '';
        }
        if (activeCategoryDescription) {
          activeCategoryDescription.textContent = button.querySelector('.catalog-category-description')?.textContent || '';
        }
        if (emptyStateLink) {
          const categoryName = activeCategoryTitle ? activeCategoryTitle.textContent : 'esta categoría';
          const message = `Hola Marmat Studio, quisiera consultar por opciones de ${categoryName}.`;
          emptyStateLink.href = `https://wa.me/${MARMAT_WHATSAPP}?text=${encodeURIComponent(message)}`;
        }
        if (searchInput) searchInput.value = '';
        button.blur();
        categoryPicker.classList.add('hidden');
        productsView.classList.remove('hidden');
        filterCatalog();
        scrollToCatalogView(productsView);
      });
    });
  }

  if (backToCategoriesButton) {
    backToCategoriesButton.addEventListener('click', () => {
      activeCategory = null;
      productsView.classList.add('hidden');
      categoryPicker.classList.remove('hidden');
      if (searchInput) searchInput.value = '';
      filterCatalog();
      scrollToCatalogView(categoryPicker);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCatalog);
  }

  filterCatalog();

  // ==========================================
  // 3. VISTA AMPLIADA DE FOTOS DEL CATÁLOGO
  // ==========================================
  if (productsGrid) {
    const imageDialog = document.createElement('dialog');
    imageDialog.className = 'product-image-dialog';
    imageDialog.setAttribute('aria-label', 'Vista ampliada del producto');

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'product-image-dialog-close';
    closeButton.setAttribute('aria-label', 'Cerrar imagen');
    closeButton.textContent = '×';

    const enlargedImage = document.createElement('img');
    enlargedImage.className = 'product-image-dialog-image';

    const imageCaption = document.createElement('p');
    imageCaption.className = 'product-image-dialog-caption';

    imageDialog.append(closeButton, enlargedImage, imageCaption);
    document.body.append(imageDialog);

    productsGrid.querySelectorAll('.product-card img').forEach(image => {
      image.setAttribute('role', 'button');
      image.setAttribute('tabindex', '0');
      image.setAttribute('aria-label', `Ampliar foto: ${image.alt || 'producto'}`);
    });

    function openProductImage(image) {
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      enlargedImage.src = image.currentSrc || image.src;
      enlargedImage.alt = image.alt;
      imageCaption.textContent = image.alt;
      imageDialog.showModal();
      closeButton.focus({ preventScroll: true });
      window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
    }

    productsGrid.addEventListener('click', event => {
      const image = event.target.closest('.product-card img');
      if (image) openProductImage(image);
    });

    productsGrid.addEventListener('keydown', event => {
      const image = event.target.closest('.product-card img');
      if (image && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openProductImage(image);
      }
    });

    closeButton.addEventListener('click', () => imageDialog.close());
    imageDialog.addEventListener('keydown', event => {
      if (event.key === 'Escape') imageDialog.close();
    });
    imageDialog.addEventListener('click', event => {
      if (event.target === imageDialog) imageDialog.close();
    });
  }

  // ==========================================
  // 4. COTIZACIÓN DIRECTA POR WHATSAPP (PRODUCTO)
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
  // 5. COTIZADOR INTERACTIVO A MEDIDA EN 3 PASOS
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
  // 6. TESTIMONIOS: CONTROLES DE AUTO-MOVIMIENTO MARQUEE
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
