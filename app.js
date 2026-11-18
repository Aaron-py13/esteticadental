/* =============================================================
   CLÍNICA DENTAL APURÍMAC — WEB INFORMATIVA
   Edita aquí los datos reales de la clínica cuando sea necesario.
   ============================================================= */
const CONFIG = {
  whatsapp: '51927841896', // Número que recibe consultas y reservas
  telefono: '51956218387', // Número para llamadas
  facebook: 'https://www.facebook.com/altaesteticaabancay/',
  direccion: 'Av. Días Bárcenas 208, Abancay, Perú, 03001'
};

const TRATAMIENTOS = {
  limpieza: {
    nombre: 'Limpieza dental',
    imagen: 'assets/limpieza.jpg',
    descripcion: 'Cuidado preventivo que ayuda a mantener una buena higiene bucal. Consulta por una evaluación profesional.'
  },
  blanqueamiento: {
    nombre: 'Blanqueamiento dental',
    imagen: 'assets/blanqueamiento.jpg',
    descripcion: 'Tratamiento estético para mejorar el tono de la sonrisa, sujeto a una evaluación odontológica previa.'
  },
  ortodoncia: {
    nombre: 'Ortodoncia',
    imagen: 'assets/ortodoncia.jpg',
    descripcion: 'Opciones para evaluar y corregir la posición dental, de acuerdo con las necesidades de cada paciente.'
  },
  diseno: {
    nombre: 'Diseño de sonrisa',
    imagen: 'assets/diseno.jpg',
    descripcion: 'Planificación estética personalizada según las características y la salud bucal del paciente.'
  },
  implantes: {
    nombre: 'Implantes dentales',
    imagen: 'assets/implantes.jpg',
    descripcion: 'Alternativas de rehabilitación oral que requieren una valoración especializada.'
  }
};

const $ = (selector) => document.querySelector(selector);
const modalShell = $('#modalShell');
const modalContent = $('#modalContent');
const modalPanel = $('.modal-panel');
let focusedBeforeModal = null;

function waLink(message = '') {
  return `https://wa.me/${CONFIG.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}
function mapsLink() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.direccion)}`;
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .06, rootMargin: '0px 0px 60px 0px' });
  items.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 65, 270)}ms`;
    observer.observe(el);
  });
}

const icon = (id) => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
function treatmentCards() {
  return Object.entries(TRATAMIENTOS).map(([key, treatment]) => `
    <article class="modal-treatment">
      <img src="${treatment.imagen}" alt="Imagen ilustrativa: ${treatment.nombre}" loading="lazy">
      <div class="modal-treatment__text">
        <h4>${treatment.nombre}</h4>
        <p>${treatment.descripcion}</p>
        <a href="${waLink(`Hola, quisiera consultar por ${treatment.nombre} en Clínica Dental Apurímac.`)}" target="_blank" rel="noopener noreferrer">CONSULTAR ${icon('arrow')}</a>
      </div>
    </article>`).join('');
}

function getModalHTML(kind, detailKey) {
  if (kind === 'tratamientos') {
    if (detailKey && TRATAMIENTOS[detailKey]) {
      const t = TRATAMIENTOS[detailKey];
      return `
        <div class="modal-kicker">${icon('tooth')} Cuidado y estética dental</div>
        <h2 class="modal-title" id="modalTitle">${t.nombre}</h2>
        <img class="modal-hero-img" src="${t.imagen}" alt="Imagen ilustrativa de ${t.nombre}">
        <p class="modal-lead">${t.descripcion}</p>
        <div class="modal-info">Un odontólogo debe determinar qué tratamiento es adecuado tras una evaluación. <strong>Confirma directamente con la clínica si el servicio está disponible.</strong></div>
        <div class="modal-actions">
          <a class="action-link" href="${waLink(`Hola, quisiera información sobre ${t.nombre} en Clínica Dental Apurímac.`)}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} CONSULTAR POR WHATSAPP</a>
          <button class="action-link action-link--secondary" data-modal="tratamientos" type="button">VER TODOS</button>
        </div>`;
    }
    return `
      <div class="modal-kicker">${icon('tooth')} SERVICIOS ODONTOLÓGICOS</div>
      <h2 class="modal-title" id="modalTitle">Nuestros tratamientos</h2>
      <p class="modal-lead">Explora estas opciones de referencia. Los tratamientos ofrecidos y su disponibilidad deben confirmarse directamente con Clínica Dental Apurímac.</p>
      <div class="modal-treatment-grid">${treatmentCards()}</div>`;
  }
  if (kind === 'promociones') {
    return `
      <div class="modal-kicker">${icon('gift')} CAMPAÑAS Y NOVEDADES</div>
      <h2 class="modal-title" id="modalTitle">Promociones especiales</h2>
      <img src="assets/promo.jpg" class="modal-hero-img" alt="Ilustración de una caja de regalo con lazo celeste">
      <p class="modal-lead">¿Quieres conocer las promociones vigentes? Escríbenos y consulta las campañas disponibles para ti.</p>
      <div class="modal-info"><strong>Promociones por confirmar.</strong> No mostramos precios ni descuentos que la clínica todavía no haya autorizado.</div>
      <div class="modal-actions"><a class="action-link" href="${waLink('Hola, quisiera conocer las promociones vigentes de Clínica Dental Apurímac.')}" target="_blank" rel="noopener noreferrer">${icon('whatsapp')} CONSULTAR PROMOCIONES</a></div>`;
  }
  if (kind === 'reserva') {
    const minDate = getLocalDateISO();
    return `
      <div class="modal-kicker">${icon('calendar')} SOLICITA TU ATENCIÓN</div>
      <h2 class="modal-title" id="modalTitle">Reserva tu cita</h2>
      <p class="modal-lead">Completa tus datos y enviaremos tu solicitud por WhatsApp. La clínica confirmará la disponibilidad del horario.</p>
      <form class="book-form" id="bookingForm">
        <div class="field field--full"><label for="nombre">Nombre y apellidos *</label><input type="text" name="nombre" id="nombre" maxlength="90" autocomplete="name" placeholder="Escribe tu nombre completo" required></div>
        <div class="field"><label for="celular">Tu número de contacto</label><input type="tel" name="celular" id="celular" maxlength="20" autocomplete="tel" placeholder="Tu celular (opcional)"></div>
        <div class="field"><label for="tratamiento">Motivo de consulta *</label><select name="tratamiento" id="tratamiento" required><option value="">Selecciona una opción</option><option>Evaluación dental</option><option>Limpieza dental</option><option>Blanqueamiento dental</option><option>Ortodoncia</option><option>Diseño de sonrisa</option><option>Otro tratamiento / consulta</option></select></div>
        <div class="field"><label for="fecha">Fecha preferida *</label><input type="date" name="fecha" id="fecha" min="${minDate}" required></div>
        <div class="field"><label for="hora">Hora preferida *</label><input type="time" name="hora" id="hora" required></div>
        <div class="field field--full"><label for="comentarios">Comentarios (opcional)</label><textarea id="comentarios" name="comentarios" maxlength="500" placeholder="¿Hay algo que te gustaría consultar?"></textarea></div>
        <p class="form-note field--full">Al enviar, se abrirá WhatsApp con tu solicitud escrita. La cita no quedará confirmada hasta que la clínica te responda.</p>
        <button type="submit" class="action-link">${icon('whatsapp')} SOLICITAR CITA POR WHATSAPP</button>
      </form>`;
  }
  if (kind === 'ubicacion') {
    const encodedQuery = encodeURIComponent(CONFIG.direccion);
    return `
      <div class="modal-kicker">${icon('pin')} ENCUÉNTRANOS EN ABANCAY</div>
      <h2 class="modal-title" id="modalTitle">Nuestra sede</h2>
      <div class="address-panel">${icon('pin')}<div><strong>${CONFIG.direccion}</strong><span>Abancay, Apurímac, Perú</span></div></div>
      <iframe class="map-embed" loading="lazy" title="Mapa de nuestra sede en Abancay" src="https://www.google.com/maps?q=${encodedQuery}&output=embed" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <div class="modal-actions">
        <a class="action-link" href="${mapsLink()}" target="_blank" rel="noopener noreferrer">${icon('pin')} ABRIR EN GOOGLE MAPS</a>
        <a class="action-link action-link--secondary" href="tel:+${CONFIG.telefono}">${icon('phone')} LLAMAR A LA CLÍNICA</a>
      </div>`;
  }
  return `<h2 class="modal-title" id="modalTitle">Información</h2>`;
}
function getLocalDateISO() {
  const date = new Date();
  const padded = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${padded(date.getMonth() + 1)}-${padded(date.getDate())}`;
}
function openModal(kind, detailKey) {
  if (!modalShell.hidden) {
    // El botón "ver todos" dentro del diálogo no debe cambiar el punto de retorno.
  } else {
    focusedBeforeModal = document.activeElement;
  }
  modalContent.innerHTML = getModalHTML(kind, detailKey);
  modalShell.hidden = false;
  document.body.classList.add('is-locked');
  modalPanel.scrollTop = 0;
  modalPanel.focus({ preventScroll: true });
  if (kind === 'reserva') {
    $('#bookingForm').addEventListener('submit', onBook);
  }
}
function closeModal() {
  modalShell.hidden = true;
  modalContent.innerHTML = '';
  document.body.classList.remove('is-locked');
  if (focusedBeforeModal && focusedBeforeModal.isConnected) focusedBeforeModal.focus({ preventScroll: true });
  focusedBeforeModal = null;
}
function onBook(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const dateString = String(data.get('fecha'));
  const [year, month, day] = dateString.split('-');
  const message = [
    '¡Hola, Clínica Dental Apurímac! Quisiera solicitar una cita 🦷',
    '',
    `Nombre: ${String(data.get('nombre')).trim()}`,
    `Celular: ${String(data.get('celular')).trim() || 'No indicado'}`,
    `Motivo: ${data.get('tratamiento')}`,
    `Fecha preferida: ${day}/${month}/${year}`,
    `Hora preferida: ${data.get('hora')}`,
    `Comentarios: ${String(data.get('comentarios')).trim() || 'Ninguno'}`,
    '',
    'Quedo pendiente de su confirmación. ¡Gracias!'
  ].join('\n');
  const destination = waLink(message);
  const anchor = document.createElement('a');
  anchor.href = destination;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.click();
}

// Delegación de eventos: cada tarjeta abre su apartado correspondiente.
document.addEventListener('click', (event) => {
  const treatmentTrigger = event.target.closest('[data-treatment]');
  if (treatmentTrigger) {
    openModal('tratamientos', treatmentTrigger.dataset.treatment);
    return;
  }
  const modalTrigger = event.target.closest('[data-modal]');
  if (modalTrigger) {
    openModal(modalTrigger.dataset.modal);
    return;
  }
  if (event.target.closest('[data-close]') || event.target.closest('#closeModal')) {
    closeModal();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalShell.hidden) closeModal();
  if (event.key === 'Tab' && !modalShell.hidden) {
    const focusable = [...modalPanel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])')];
    if (!focusable.length) { event.preventDefault(); modalPanel.focus(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === modalPanel)) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
  }
});
$('#year').textContent = new Date().getFullYear();
initReveal();
