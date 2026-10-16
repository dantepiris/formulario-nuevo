/* ══════════════════════════════════════════════════════════════════════
   House & Flats — Formulario de búsqueda en 3 pasos (demo, sin API)
   Controles portados de hyf-front (NfCombo, NfSegmented, chips, tarjetas,
   presupuesto, barra con avión). En el lateral: título y carrusel de
   partners. El progreso se guarda en localStorage.
══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ══ DATOS ═══════════════════════════════════════════════════════════ */
  // Ciudades y zonas: los mismos `value` que nfData.js de hyf-front.
  var COUNTRY = {
    argentina: ['Argentina', 'AR'], chile: ['Chile', 'CL'], espana: ['España', 'ES'], italia: ['Italia', 'IT'],
    alemania: ['Alemania', 'DE'], francia: ['Francia', 'FR'], netherlands: ['Países Bajos', 'NL'],
    austria: ['Austria', 'AT'], united_kingdom: ['Reino Unido', 'GB'], uruguay: ['Uruguay', 'UY'],
    portugal: ['Portugal', 'PT'], paraguay: ['Paraguay', 'PY'], peru: ['Perú', 'PE'],
  };
  var CITY_GROUPS = [
    ['argentina', ['buenos_aires', 'cordoba', 'mendoza', 'bariloche', 'la_plata', 'mar_del_plata', 'salta', 'neuquen']],
    ['chile', ['santiago', 'valparaiso', 'vina_del_mar', 'concepcion', 'puerto_montt', 'pucon', 'villarrica']],
    ['espana', ['madrid', 'barcelona', 'valencia', 'castellon_de_la_plana', 'sevilla', 'malaga', 'bilbao', 'san_sebastian', 'granada']],
    ['italia', ['milan', 'rome', 'florence', 'turin', 'bologna']],
    ['alemania', ['berlin', 'frankfurt', 'munich', 'dusseldorf', 'stuttgart']],
    ['francia', ['paris', 'lille', 'bordeaux', 'toulouse']],
    ['netherlands', ['amsterdam', 'den_haag']],
    ['austria', ['vienna', 'graz']],
    ['united_kingdom', ['londres']],
    ['uruguay', ['montevideo', 'punta_del_este']],
    ['portugal', ['lisbon', 'coimbra', 'vila_nova_de_gaia']],
    ['paraguay', ['asuncion']],
    ['peru', ['lima']],
  ];
  var CITY_LABELS = {
    buenos_aires: 'Buenos Aires', cordoba: 'Córdoba', mendoza: 'Mendoza', bariloche: 'Bariloche', la_plata: 'La Plata',
    mar_del_plata: 'Mar del Plata', salta: 'Salta', neuquen: 'Neuquén', santiago: 'Santiago', valparaiso: 'Valparaíso',
    vina_del_mar: 'Viña del Mar', concepcion: 'Concepción', puerto_montt: 'Puerto Montt', pucon: 'Pucón',
    villarrica: 'Villarrica', madrid: 'Madrid', barcelona: 'Barcelona', valencia: 'Valencia',
    castellon_de_la_plana: 'Castellón de la Plana', sevilla: 'Sevilla', malaga: 'Málaga', bilbao: 'Bilbao',
    san_sebastian: 'San Sebastián', granada: 'Granada', milan: 'Milán', rome: 'Roma', florence: 'Florencia',
    turin: 'Turín', bologna: 'Bolonia', berlin: 'Berlín', frankfurt: 'Fráncfort', munich: 'Múnich',
    dusseldorf: 'Düsseldorf', stuttgart: 'Stuttgart', paris: 'París', lille: 'Lille', bordeaux: 'Burdeos',
    toulouse: 'Toulouse', amsterdam: 'Ámsterdam', den_haag: 'La Haya', vienna: 'Viena', graz: 'Graz',
    londres: 'Londres', montevideo: 'Montevideo', punta_del_este: 'Punta del Este', lisbon: 'Lisboa',
    coimbra: 'Coímbra', vila_nova_de_gaia: 'Vila Nova de Gaia', asuncion: 'Asunción', lima: 'Lima',
  };
  var ZONES = {
    buenos_aires: ['Palermo', 'Belgrano', 'Recoleta', 'San Telmo', 'Puerto Madero', 'Almagro', 'Caballito', 'Villa Crespo', 'Colegiales', 'Núñez'],
    cordoba: ['Nueva Córdoba', 'Güemes', 'General Paz', 'Alberdi', 'Centro'],
    mendoza: ['Centro', 'Godoy Cruz', 'Luján de Cuyo', 'Maipú'],
    santiago: ['Providencia', 'Ñuñoa', 'Las Condes', 'Vitacura', 'Santiago Centro'],
    valparaiso: ['Cerro Alegre', 'Plan', 'Cerro Concepción'],
    vina_del_mar: ['Centro', 'Reñaca', 'Miramar'],
    concepcion: ['Centro', 'Barrio Universitario'],
    madrid: ['Chamberí', 'Salamanca', 'Retiro', 'Centro', 'Chamartín', 'Malasaña', 'Lavapiés', 'Chueca', 'Moncloa'],
    barcelona: ['Eixample', 'Gràcia', 'Sant Martí', 'Les Corts', 'Barrio Gótico', 'Poble Sec', 'Sant Gervasi'],
    valencia: ['Ruzafa', 'El Carmen', 'Benimaclet', 'Camins al Grau', 'Quatre Carreres'],
    sevilla: ['Centro', 'Triana', 'Los Remedios'],
    malaga: ['Centro', 'El Palo', 'Pedregalejo'],
    bilbao: ['Abando', 'Indautxu', 'Casco Viejo'],
    san_sebastian: ['Centro', 'Gros', 'Amara'],
    granada: ['Centro', 'Realejo', 'Albaicín'],
    montevideo: ['Centro', 'Pocitos', 'Punta Carretas'],
    asuncion: ['Centro', 'Las Mercedes', 'Villa Morra'],
    lima: ['Miraflores', 'San Isidro', 'Barranco'],
  };
  var CITY_COUNTRY = {};
  CITY_GROUPS.forEach(function (g) { g[1].forEach(function (c) { CITY_COUNTRY[c] = g[0]; }); });

  var MOTIVOS = [
    { value: 'estudios', label: 'Estudios' },
    { value: 'trabajo', label: 'Trabajo' },
    { value: 'mudanza', label: 'Mudanza' },
    { value: 'otro', label: 'Otro' },
  ];
  // Ocupación cuando el motivo es trabajo
  var OCUPACIONES = [
    { value: 'tecnologia', label: 'Tecnología / Desarrollo de software' },
    { value: 'datos', label: 'Datos / Inteligencia artificial' },
    { value: 'ingenieria', label: 'Ingeniería' },
    { value: 'salud', label: 'Salud / Medicina' },
    { value: 'enfermeria', label: 'Enfermería / Cuidados' },
    { value: 'educacion', label: 'Educación / Docencia' },
    { value: 'investigacion', label: 'Investigación / Ciencia' },
    { value: 'finanzas', label: 'Finanzas / Banca' },
    { value: 'contabilidad', label: 'Contabilidad / Auditoría' },
    { value: 'consultoria', label: 'Consultoría' },
    { value: 'legal', label: 'Legal / Abogacía' },
    { value: 'marketing', label: 'Marketing / Publicidad' },
    { value: 'comunicacion', label: 'Comunicación / Periodismo' },
    { value: 'diseno', label: 'Diseño / UX' },
    { value: 'arte', label: 'Arte / Cultura / Audiovisual' },
    { value: 'ventas', label: 'Ventas / Comercial' },
    { value: 'rrhh', label: 'Recursos humanos' },
    { value: 'administracion', label: 'Administración / Oficina' },
    { value: 'arquitectura', label: 'Arquitectura / Construcción' },
    { value: 'turismo', label: 'Turismo / Hotelería' },
    { value: 'gastronomia', label: 'Gastronomía' },
    { value: 'logistica', label: 'Logística / Transporte' },
    { value: 'industria', label: 'Industria / Manufactura' },
    { value: 'energia', label: 'Energía / Minería' },
    { value: 'deporte', label: 'Deporte / Bienestar' },
    { value: 'atencion', label: 'Atención al cliente' },
    { value: 'sector_publico', label: 'Sector público / ONG' },
    { value: 'diplomacia', label: 'Diplomacia / Organismos internacionales' },
    { value: 'freelance', label: 'Freelance / Nómada digital' },
    { value: 'emprendimiento', label: 'Emprendimiento / Negocio propio' },
    { value: 'practicas', label: 'Prácticas / Pasantía' },
    { value: 'otro', label: 'Otro' },
  ];
  // Mismos tipos que el formulario de hyf-front (value de la API).
  var TIPOS = [
    { value: 'monoambiente', icon: 'studio', label: 'Estudio', sub: 'Espacio propio con todo integrado' },
    { value: 'habitacion_privada', icon: 'bed', label: 'Habitación privada', sub: 'En apartamento, casa o residencia' },
    { value: 'coliving', icon: 'people', label: 'Coliving / Residencia', sub: 'Espacios pensados para compartir' },
    { value: 'depto_1d', icon: 'building', label: 'Apartamento de 1 habitación', sub: 'Apartamento completo' },
    { value: 'depto_2d', icon: 'buildings', label: 'Apartamento de 2+ habitaciones', sub: 'Para grupo o más espacio' },
    { value: 'indiferente', icon: 'sparkle', label: 'Me es indiferente', sub: 'Muéstrame todas las opciones' },
  ];
  var ICONS = {
    studio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-6h6v6"/></svg>',
    bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18V6M21 18v-5a3 3 0 0 0-3-3H10v8"/><path d="M3 14h18M3 18h18"/><circle cx="6.5" cy="11" r="1.6"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2A5 5 0 0 1 21 19"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/></svg>',
    buildings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="9" height="14" rx="1.2"/><path d="M12 10h7.8a1.2 1.2 0 0 1 1.2 1.2V21H12"/><path d="M6 11h3M6 14.5h3M6 18h3M15 14h3M15 17.5h3M7.5 7V3h4"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="m20.5 20.5-4.8-4.8"/><path d="M11 8v6M8 11h6"/></svg>',
  };
  var PERSONAS = [{ value: 1, label: 'Solo/a' }, { value: 2, label: '2' }, { value: 3, label: '3' }, { value: 4, label: '4 o más' }];
  // Tal cual hf_front_3_pasos.html (elige una)
  var MOMENTOS = [
    { value: 'confirmado', label: '✈️ Ya tengo viaje confirmado' },
    { value: 'en_ciudad', label: '📍 Ya estoy en la ciudad' },
    { value: 'comparando', label: '🔎 Estoy comparando opciones' },
  ];
  var PRIORIDADES = ['Ubicación', 'Precio', 'Calidad', 'Conectividad', 'Flexibilidad'];
  var MONEDAS = {
    EUR: { min: 100, max: 3000, step: 50, ph: 700 },
    USD: { min: 100, max: 3000, step: 50, ph: 700 },
    CLP: { min: 100000, max: 2500000, step: 50000, ph: 550000 },
    ARS: { min: 100000, max: 3000000, step: 50000, ph: 800000 },
  };
  var EURO = ['espana', 'italia', 'alemania', 'francia', 'netherlands', 'austria', 'portugal'];
  var FRECUENTES = ['AR', 'CL', 'ES', 'MX', 'CO', 'PE', 'UY', 'BR', 'US'];

  var LOGOS = [
    { src: 'civitatis.png', name: 'Civitatis', bg: '#F70759', z: 2.2 },
    { src: 'transvip.png', name: 'Transvip', bg: '#FF6B00', z: 2 },
    { src: 'migraeasy.png', name: 'MigraEasy', bg: '#fff', z: 1.5 },
    { src: 'tuki.png', name: 'Tuki', wide: true, pad: '9px 12px' },
    { src: 'expanish.jpeg', name: 'Expanish', bg: '#97D0AF', z: 1.9 },
    { src: 'entre-tramites.png', name: 'Entre Trámites', wide: true, pad: '4px 6px' },
    { src: 'pax-assistance.jpeg', name: 'Pax Assistance', bg: '#430199', z: 1.4 },
    { src: 'work-cafe-santander.png', name: 'Work Café Santander', bg: '#fff', z: 1.1 },
    { src: 'immigration-resolution.webp', name: 'Immigration Resolution', wide: true, pad: '3px 4px' },
    { src: 'kia-ora-travel.png', name: 'Kia Ora Travel', wide: true, pad: '4px' },
  ];

  var STORE_KEY = 'hyf_demo_formulario_3p';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var STEP_NAMES = { 1: 'Tu búsqueda', 2: 'Tu estadía', 3: 'Tus preferencias' };
  var STEP_FIELDS = { 1: ['nombre', 'email', 'whatsapp', 'pais', 'ciudad', 'partner', 'edad', 'partner_nombre', 'motivo', 'ocupacion'], 2: ['fecha_inicio', 'fecha_fin', 'presupuesto', 'tipo', 'momento'], 3: [] };
  var REQUIRED = STEP_FIELDS[1].concat(STEP_FIELDS[2]);
  var LOADER_MIN_MS = 2900;
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  /* ══ ESTADO ══════════════════════════════════════════════════════════ */
  function emptyForm() {
    return {
      nombre: '', email: '', phone_country: '', phone_code: '', whatsapp: '', pais: '', ciudades: [],
      partner: '', partner_nombre: '', edad: '', motivo: '', ocupacion: '',
      fecha_inicio: '', fecha_fin: '', moneda: 'EUR', presupuesto: '', tipo: '', personas: 1, momento: '',
      prioridades: [], universidad_origen: '', universidad_destino: '', notas: '',
    };
  }
  var S = { form: emptyForm(), step: 1, touched: {}, editing: false, busy: false, lastPct: -1, done: false };

  /* ══ UTILIDADES ══════════════════════════════════════════════════════ */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function h(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
    });
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  function fmtThousands(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function parseISO(s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function fmtDate(s, withYear) {
    return parseISO(s).toLocaleDateString('es-ES', withYear ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: 'numeric', month: 'short' }).replace('.', '');
  }
  function cityLabel(c) { return CITY_LABELS[c] || c; }
  function firstName() { return S.form.nombre.trim().split(/\s+/)[0] || ''; }

  function flagEl(code) {
    if (!code) return h('span', { class: 'nf-flag nf-flag-code', 'aria-hidden': 'true' }, '🌐');
    var lc = code.toLowerCase();
    var img = h('img', { class: 'nf-flag', src: 'https://flagcdn.com/w40/' + lc + '.png', srcset: 'https://flagcdn.com/w80/' + lc + '.png 2x', width: 22, height: 16, alt: '', loading: 'lazy' });
    img.addEventListener('error', function () { img.replaceWith(h('span', { class: 'nf-flag nf-flag-code', 'aria-hidden': 'true', text: code.toUpperCase() })); });
    return img;
  }

  /* ══ COMBOBOX CON BUSCADOR (como NfCombo.vue) ════════════════════════ */
  var combos = [];
  var comboSeq = 0;
  function Combo(root, o) {
    this.root = root; this.o = o; this.value = ''; this.isOpen = false; this.active = 0; this.query = '';
    this.uid = 'cb' + (++comboSeq);
    var self = this;
    this.trigger = h('button', { type: 'button', class: 'nf-combo-trigger', id: this.uid + '-btn', 'aria-haspopup': 'listbox', 'aria-expanded': 'false', 'aria-labelledby': this.uid + '-lbl ' + this.uid + '-btn' });
    this.trigger.appendChild(h('span', { class: 'nf-combo-label', id: this.uid + '-lbl', text: o.label }));
    this.valueEl = h('span', { class: 'nf-combo-value' });
    this.trigger.appendChild(this.valueEl);
    this.trigger.insertAdjacentHTML('beforeend', '<svg class="nf-combo-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>');
    root.appendChild(this.trigger);
    this.trigger.addEventListener('click', function () { self.isOpen ? self.close(true) : self.open(); });
    this.trigger.addEventListener('keydown', function (e) { self.onTriggerKey(e); });
    this.onDoc = function (e) { if (!root.contains(e.target)) self.close(false); };
    combos.push(this);
  }
  Combo.prototype.selected = function () {
    var v = this.value;
    return this.o.options.filter(function (x) { return x.value === v && !x.dup; })[0] || null;
  };
  Combo.prototype.isSel = function (x) {
    return this.o.multi ? (this.values || []).indexOf(x.value) !== -1 : x.value === this.value;
  };
  Combo.prototype.set = function (v) {
    if (this.o.multi) {
      var vals = this.values = (Array.isArray(v) ? v : []).slice();
      var sel = this.o.options.filter(function (x) { return !x.dup && vals.indexOf(x.value) !== -1; });
      this.valueEl.innerHTML = '';
      this.root.classList.toggle('has-value', sel.length > 0);
      if (sel.length) {
        if (!this.o.noFlag) this.valueEl.appendChild(flagEl(sel[0].flag));
        var names = sel.map(function (x) { return x.label; });
        var txt = names.length <= 2 ? names.join(', ') : names.slice(0, 2).join(', ') + ' +' + (names.length - 2);
        this.valueEl.appendChild(h('span', { text: txt, title: names.join(', ') }));
      }
      return;
    }
    this.value = v || '';
    var s = this.selected();
    this.valueEl.innerHTML = '';
    this.root.classList.toggle('has-value', !!s);
    if (s) {
      if (!this.o.noFlag) this.valueEl.appendChild(flagEl(s.flag));
      this.valueEl.appendChild(h('span', { text: this.o.showMeta && s.meta ? s.meta : s.label }));
    }
  };
  Combo.prototype.setDisabled = function (d) {
    this.trigger.disabled = !!d;
    this.root.classList.toggle('is-disabled', !!d);
    if (d) this.close(false);
  };
  Combo.prototype.filtered = function () {
    var q = norm(this.query.trim()).replace(/^\+/, '');
    if (!q) return this.o.options;
    return this.o.options.filter(function (x) { return !x.dup && norm(x.label + ' ' + (x.group || '') + ' ' + (x.meta || '')).indexOf(q) !== -1; });
  };
  Combo.prototype.open = function (seed, viaKey) {
    if (this.isOpen) return;
    var self = this;
    combos.forEach(function (c) { if (c !== self) c.close(false); });
    // Espacio real disponible: en móvil la barra de progreso (sticky) y los botones (fixed) tapan parte de la pantalla
    var r = this.root.getBoundingClientRect();
    var nav = $('.nf-nav'), topbar = $('#topbar');
    var bottomLimit = window.innerHeight, topLimit = 0;
    if (nav && getComputedStyle(nav).position === 'fixed') bottomLimit = Math.min(bottomLimit, nav.getBoundingClientRect().top);
    if (topbar && getComputedStyle(topbar).position === 'sticky') topLimit = Math.max(0, topbar.getBoundingClientRect().bottom);
    var below = bottomLimit - r.bottom - 12, above = r.top - topLimit - 12;
    var up = below < 300 && above > below;
    this.root.classList.toggle('drop-up', up);
    // Sube el bloque del combo por encima de los campos siguientes (las animaciones de entrada crean capas)
    this.raised = [];
    for (var el = this.root.parentElement; el && !el.classList.contains('nf-step'); el = el.parentElement) {
      el.classList.add('nf-raise'); this.raised.push(el);
    }
    this.query = typeof seed === 'string' ? seed : '';
    this.isOpen = true;
    this.root.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.pop = h('div', { class: 'nf-combo-pop' });
    var search = h('div', { class: 'nf-combo-search' }, '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>');
    this.input = h('input', { type: 'text', placeholder: this.o.searchPlaceholder || '', autocomplete: 'off', spellcheck: 'false', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': this.uid + '-list', 'aria-autocomplete': 'list', 'aria-label': this.o.searchPlaceholder || this.o.label });
    this.input.value = this.query;
    search.appendChild(this.input);
    this.list = h('ul', { class: 'nf-combo-list', id: this.uid + '-list', role: 'listbox', 'aria-labelledby': this.uid + '-lbl', tabindex: '-1', 'aria-multiselectable': this.o.multi ? 'true' : null });
    this.pop.appendChild(search); this.pop.appendChild(this.list);
    if (this.o.multi) {
      var foot = h('div', { class: 'nf-combo-foot' });
      foot.appendChild(h('span', { text: this.o.multiHint || 'Puedes elegir varias' }));
      var done = h('button', { type: 'button', class: 'nf-combo-done', text: 'Listo' });
      done.addEventListener('click', function () { self.close(true); });
      foot.appendChild(done);
      this.pop.appendChild(foot);
    }
    this.root.appendChild(this.pop);
    // La lista se achica si no hay espacio (pantallas bajas o con barras fijas)
    this.list.style.maxHeight = '';
    var chrome = this.pop.offsetHeight - this.list.offsetHeight;
    var room = (up ? above : below) - chrome;
    this.list.style.maxHeight = Math.max(150, Math.min(280, room)) + 'px';
    this.input.addEventListener('input', function () { self.query = self.input.value; self.renderList(0); });
    this.input.addEventListener('keydown', function (e) { self.onKey(e); });
    this.list.addEventListener('mousemove', function (e) {
      var li = e.target.closest('.nf-combo-option'); if (li) self.setActive(+li.dataset.i, true);
    });
    this.list.addEventListener('click', function (e) {
      var li = e.target.closest('.nf-combo-option'); if (li) self.pick(self.items[+li.dataset.i]);
    });
    var cur = this.o.multi ? 0 : this.filtered().findIndex(function (x) { return x.value === self.value; });
    this.renderList(this.query ? 0 : Math.max(0, cur));
    // En pantallas táctiles no se enfoca el buscador: abriría el teclado y taparía la lista
    if (TOUCH && !viaKey) this.list.focus({ preventScroll: true });
    else this.input.focus({ preventScroll: true });
    // pointerdown (y no click): en iOS el click en zonas vacías no llega al documento
    setTimeout(function () { if (self.isOpen) document.addEventListener('pointerdown', self.onDoc); }, 0);
  };
  Combo.prototype.renderList = function (activeIdx) {
    var items = this.items = this.filtered();
    var self = this;
    this.list.innerHTML = '';
    if (!items.length) { this.list.appendChild(h('li', { class: 'nf-combo-empty', text: this.o.emptyText || 'Sin resultados' })); this.input.removeAttribute('aria-activedescendant'); return; }
    var lastGroup = null;
    items.forEach(function (x, i) {
      if (x.group && x.group !== lastGroup) {
        var g = h('li', { class: 'nf-combo-group', role: 'presentation' });
        if (x.groupFlag) { g.style.display = 'flex'; g.style.alignItems = 'center'; g.style.gap = '8px'; }
        g.textContent = x.group;
        self.list.appendChild(g);
        lastGroup = x.group;
      }
      var li = h('li', { class: 'nf-combo-option', id: self.uid + '-o' + i, role: 'option', 'aria-selected': self.isSel(x) ? 'true' : 'false', 'data-i': i });
      if (!self.o.noFlag) li.appendChild(flagEl(x.flag));
      li.appendChild(h('span', { text: x.label }));
      if (x.meta) li.appendChild(h('span', { class: 'nf-opt-meta', text: x.meta }));
      if (self.o.multi) li.appendChild(h('span', { class: 'nf-opt-check', 'aria-hidden': 'true', text: '✓' }));
      self.list.appendChild(li);
    });
    this.setActive(activeIdx || 0);
  };
  Combo.prototype.setActive = function (i, noScroll) {
    this.active = i;
    $$('.nf-combo-option', this.list).forEach(function (li) { li.classList.toggle('is-active', +li.dataset.i === i); });
    var li = this.list.querySelector('#' + this.uid + '-o' + i);
    if (li) {
      this.input.setAttribute('aria-activedescendant', li.id);
      // Solo mueve la lista (scrollIntoView también movía la página y en móvil saltaba)
      if (!noScroll) {
        var l = this.list, top = li.offsetTop, bot = top + li.offsetHeight;
        if (top < l.scrollTop) l.scrollTop = top - 6;
        else if (bot > l.scrollTop + l.clientHeight) l.scrollTop = bot - l.clientHeight + 6;
      }
    }
  };
  Combo.prototype.close = function (focusTrigger) {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.root.classList.remove('is-open');
    (this.raised || []).forEach(function (el) { el.classList.remove('nf-raise'); });
    this.raised = [];
    this.trigger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', this.onDoc);
    if (this.pop) this.pop.remove();
    this.pop = null;
    if (focusTrigger) this.trigger.focus({ preventScroll: true });
    if (this.o.onClose && !this.picking) this.o.onClose();
  };
  Combo.prototype.onTriggerKey = function (e) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].indexOf(e.key) !== -1) { e.preventDefault(); this.open(undefined, true); }
    else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); this.open(e.key, true); }
  };
  Combo.prototype.onKey = function (e) {
    var n = this.items.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); this.setActive(Math.min(n - 1, this.active + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); this.setActive(Math.max(0, this.active - 1)); }
    else if (e.key === 'PageDown') { e.preventDefault(); this.setActive(Math.min(n - 1, this.active + 8)); }
    else if (e.key === 'PageUp') { e.preventDefault(); this.setActive(Math.max(0, this.active - 8)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (this.items[this.active]) this.pick(this.items[this.active]); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); this.close(true); }
    else if (e.key === 'Tab') { this.close(false); }
  };
  Combo.prototype.pick = function (x) {
    if (this.o.multi) {
      // Marca/desmarca sin cerrar la lista (se actualiza en el lugar para no
      // sacar del DOM el elemento clicado: el click afuera cerraría la lista)
      var vals = (this.values || []).slice(), i = vals.indexOf(x.value);
      if (i === -1) vals.push(x.value); else vals.splice(i, 1);
      this.set(vals);
      var self = this;
      $$('.nf-combo-option', this.list).forEach(function (li) {
        li.setAttribute('aria-selected', self.isSel(self.items[+li.dataset.i]) ? 'true' : 'false');
      });
      if (this.input && !TOUCH) this.input.focus({ preventScroll: true });
      if (this.o.onChange) this.o.onChange(vals.slice(), x);
      return;
    }
    this.set(x.value);
    this.picking = true;      // al elegir no corre onClose (validaría antes de guardar el valor)
    this.close(true);
    this.picking = false;
    if (this.o.onChange) this.o.onChange(x.value, x);
  };

  /* ══ SELECTOR SEGMENTADO (como NfSegmented.vue) ══════════════════════ */
  function Segmented(root, items, onInput) {
    var self = this;
    this.root = root; this.items = items; this.value = null;
    root.setAttribute('role', 'radiogroup');
    this.ind = h('span', { class: 'nf-seg-indicator', 'aria-hidden': 'true' });
    root.appendChild(this.ind);
    this.btns = items.map(function (it) {
      var b = h('button', { type: 'button', class: 'nf-seg-btn', role: 'radio', 'aria-checked': 'false', text: it.label });
      b.addEventListener('click', function () { onInput(it.value); });
      root.appendChild(b);
      return b;
    });
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var i = self.btns.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var n = (i + (e.key === 'ArrowRight' ? 1 : -1) + self.btns.length) % self.btns.length;
      self.btns[n].focus();
      onInput(self.items[n].value);
    });
    if (window.ResizeObserver) new ResizeObserver(function () { self.position(); }).observe(root);
  }
  Segmented.prototype.set = function (v) {
    this.value = v;
    var has = v !== null && v !== '' && v !== undefined;
    this.root.classList.toggle('has-value', has);
    var self = this;
    this.btns.forEach(function (b, i) {
      var on = has && String(self.items[i].value) === String(v);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
      b.tabIndex = on || (!has && i === 0) ? 0 : -1;
    });
    this.position();
  };
  Segmented.prototype.position = function () {
    var i = this.items.findIndex(function (it) { return String(it.value) === String(this.value); }, this);
    var b = this.btns[i];
    if (!b || !b.offsetWidth) return;
    // offsetLeft ya incluye el padding del contenedor (el indicador va con left: 0)
    this.ind.style.width = b.offsetWidth + 'px';
    this.ind.style.transform = 'translateX(' + b.offsetLeft + 'px)';
  };

  /* ══ REFERENCIAS ═════════════════════════════════════════════════════ */
  var formEl = $('#form');
  var inputs = {
    nombre: $('#f-nombre'), email: $('#f-email'), whatsapp: $('#f-whatsapp'), edad: $('#f-edad'),
    universidad_origen: $('#f-uni-origen'), universidad_destino: $('#f-uni-destino'),
    fecha_inicio: $('#f-inicio'), fecha_fin: $('#f-fin'), presupuesto: $('#f-presupuesto'),
    notas: $('#f-notas'), partner_nombre: $('#f-partner'),
  };
  var range = $('#f-range');

  /* ══ CONSTRUIR CONTROLES ═════════════════════════════════════════════ */
  var phoneOptions = [];
  var all = (window.PHONE_COUNTRIES || []).map(function (c) {
    return { value: c.code, label: c.name.replace(/\s*\(\+?\d+\)\s*$/, ''), meta: '+' + c.value, flag: c.code, dial: c.value };
  });
  FRECUENTES.forEach(function (code) {
    var x = all.filter(function (a) { return a.value === code; })[0];
    if (x) phoneOptions.push(Object.assign({}, x, { group: 'Frecuentes', dup: true }));
  });
  all.forEach(function (x) { phoneOptions.push(Object.assign({}, x, { group: 'Todos los países' })); });

  var comboPhone = new Combo($('#comboPhone'), {
    label: 'Código', options: phoneOptions, showMeta: true, searchPlaceholder: 'Busca tu país', emptyText: 'Sin resultados',
    onChange: function (v, x) { S.form.phone_country = v; S.form.phone_code = x.dial; touch('whatsapp'); changed(); inputs.whatsapp.focus(); },
  });

  // Destino en dos pasos: primero el país, después sus ciudades
  var countryOptions = CITY_GROUPS.map(function (g) { return { value: g[0], label: COUNTRY[g[0]][0], flag: COUNTRY[g[0]][1] }; });
  function cityOptionsOf(p) {
    var g = CITY_GROUPS.filter(function (x) { return x[0] === p; })[0];
    return g ? g[1].map(function (c) { return { value: c, label: cityLabel(c), flag: COUNTRY[p][1] }; }) : [];
  }
  function suggestCurrency() {
    // Moneda sugerida según el país (solo si todavía no escribió un presupuesto)
    if (S.form.presupuesto || !S.form.pais) return;
    var p = S.form.pais;
    S.form.moneda = p === 'chile' ? 'CLP' : p === 'argentina' ? 'ARS' : EURO.indexOf(p) !== -1 ? 'EUR' : 'USD';
  }
  var comboCountry = new Combo($('#comboCountry'), {
    label: 'País', options: countryOptions, searchPlaceholder: 'Busca un país', emptyText: 'Sin resultados',
    onChange: function (v) {
      var changedCountry = S.form.pais !== v;
      S.form.pais = v;
      if (changedCountry) S.form.ciudades = S.form.ciudades.filter(function (c) { return CITY_COUNTRY[c] === v; });
      touch('pais'); suggestCurrency(); renderCity(); changed(); renderBudget();
      // Abre la lista de ciudades de ese país
      if (!S.form.ciudades.length) setTimeout(function () { comboCity.open(); }, 60);
    },
    onClose: function () { touch('pais'); validateField('pais'); },
  });
  // Ciudades: se pueden elegir varias del mismo país
  var comboCity = new Combo($('#comboCity'), {
    label: 'Ciudades', options: [], multi: true, multiHint: 'Puedes elegir varias ciudades', searchPlaceholder: 'Busca tus ciudades', emptyText: 'Sin resultados',
    onChange: function (vals) {
      S.form.ciudades = vals;
      touch('ciudad'); changed(); renderBudget();
    },
    onClose: function () { if (S.form.pais) { touch('ciudad'); validateField('ciudad'); } },
  });
  function renderCity() {
    comboCity.o.options = cityOptionsOf(S.form.pais);
    comboCity.setDisabled(!S.form.pais);
    comboCity.set(S.form.ciudades);
    $('#cityHint').textContent = S.form.pais ? 'Puedes elegir más de una.' : 'Primero elige el país.';
  }
  function citiesText() {
    var f = S.form;
    if (!f.ciudades.length) return '';
    return f.ciudades.map(cityLabel).join(', ') + (f.pais ? ' · ' + COUNTRY[f.pais][0] : '');
  }

  // Ocupación (solo si viene por trabajo)
  var comboOcupacion = new Combo($('#comboOcupacion'), {
    label: '¿A qué te dedicas?', options: OCUPACIONES, noFlag: true, searchPlaceholder: 'Busca tu área', emptyText: 'Sin resultados',
    onChange: function (v) {
      S.form.ocupacion = v;
      touch('ocupacion'); renderOcupacion(); changed();
    },
    onClose: function () { touch('ocupacion'); validateField('ocupacion'); },
  });
  function renderOcupacion() {
    comboOcupacion.set(S.form.ocupacion);
  }
  function ocupacionLabel() {
    var f = S.form;
    return (OCUPACIONES.filter(function (o) { return o.value === f.ocupacion; })[0] || {}).label || '';
  }

  // Motivo
  var motivoBox = $('#motivoChips');
  MOTIVOS.forEach(function (m) {
    var b = h('button', { type: 'button', class: 'nf-chip', role: 'radio', 'aria-checked': 'false', 'data-v': m.value, text: m.label });
    b.addEventListener('click', function () {
      S.form.motivo = m.value;
      // Los datos de otro motivo no se envían: universidades solo para estudios, ocupación solo para trabajo
      if (m.value !== 'estudios') {
        S.form.universidad_origen = S.form.universidad_destino = '';
        inputs.universidad_origen.value = inputs.universidad_destino.value = '';
      }
      if (m.value !== 'trabajo') S.form.ocupacion = '';
      touch('motivo'); changed(); renderMotivo();
    });
    motivoBox.appendChild(b);
  });
  radioKeys(motivoBox, '.nf-chip');

  // Tipo de alojamiento
  var tipoBox = $('#tipoCards');
  TIPOS.forEach(function (t) {
    var b = h('button', { type: 'button', class: 'nf-card', role: 'radio', 'aria-checked': 'false', 'data-v': t.value },
      '<span class="nf-card-check" aria-hidden="true"></span><span class="nf-card-icon" aria-hidden="true">' + ICONS[t.icon] + '</span>' +
      '<span class="nf-card-title">' + esc(t.label) + '</span><span class="nf-card-sub">' + esc(t.sub) + '</span>');
    b.addEventListener('click', function () { S.form.tipo = t.value; touch('tipo'); changed(); renderChoices(); });
    tipoBox.appendChild(b);
  });
  radioKeys(tipoBox, '.nf-card');

  // Personas
  var segPeople = new Segmented($('#segPeople'), PERSONAS, function (v) { S.form.personas = v; changed(); segPeople.set(v); });

  // Moneda
  var segCurrency = new Segmented($('#segCurrency'), Object.keys(MONEDAS).map(function (k) { return { value: k, label: k }; }), function (v) {
    if (S.form.moneda === v) return;
    var cfg = MONEDAS[v], n = Number(S.form.presupuesto);
    S.form.moneda = v;
    if (n && (n < cfg.min || n > cfg.max * 3)) S.form.presupuesto = '';
    changed(); renderBudget(); validateField('presupuesto');
  });

  // Momento: chips como en hf_front_3_pasos.html
  var momentoBox = $('#momentoChips');
  MOMENTOS.forEach(function (m) {
    var b = h('button', { type: 'button', class: 'nf-chip', role: 'radio', 'aria-checked': 'false', 'data-v': m.value, text: m.label });
    b.addEventListener('click', function () { S.form.momento = m.value; touch('momento'); changed(); renderChoices(); });
    momentoBox.appendChild(b);
  });
  radioKeys(momentoBox, '.nf-chip');

  // Partner que lo trajo (paso 1): uno de la lista, "Otro" (se escribe) o "Ninguno"
  var PARTNER_OTRO = '__otro', PARTNER_NINGUNO = '__ninguno';
  var partnerOptions = LOGOS.map(function (l) { return { value: l.name, label: l.name }; })
    .concat([{ value: PARTNER_OTRO, label: 'Otro' }, { value: PARTNER_NINGUNO, label: 'Ninguno, llegué por mi cuenta' }]);
  var comboPartner = new Combo($('#comboPartner'), {
    label: '¿Quién te ayudó a llegar?', options: partnerOptions, noFlag: true, searchPlaceholder: 'Busca el partner', emptyText: 'Sin resultados',
    onChange: function (v) {
      S.form.partner = v;
      if (v !== PARTNER_OTRO) S.form.partner_nombre = '';
      touch('partner'); renderPartner(); changed();
      if (v === PARTNER_OTRO) inputs.partner_nombre.focus();
    },
    onClose: function () { touch('partner'); validateField('partner'); },
  });
  function partnerLabel() {
    var f = S.form;
    if (f.partner === PARTNER_OTRO) return f.partner_nombre.trim() || 'Otro';
    if (f.partner === PARTNER_NINGUNO) return 'Ninguno';
    return f.partner;
  }
  function renderPartner() {
    comboPartner.set(S.form.partner);
    $('#revealPartner').hidden = S.form.partner !== PARTNER_OTRO;
    if (inputs.partner_nombre.value !== S.form.partner_nombre) inputs.partner_nombre.value = S.form.partner_nombre;
  }

  // Prioridades
  var prioBox = $('#prioChips');
  PRIORIDADES.forEach(function (p) {
    var b = h('button', { type: 'button', class: 'nf-chip', 'aria-pressed': 'false', 'data-v': p, text: p });
    b.addEventListener('click', function () { toggleIn(S.form.prioridades, p); changed(); renderChoices(); });
    prioBox.appendChild(b);
  });

  // Flechas dentro de un grupo de opciones únicas (radiogroup)
  function radioKeys(box, sel) {
    box.addEventListener('keydown', function (e) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
      var btns = $$(sel, box), i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      var n = btns[(i + d + btns.length) % btns.length];
      n.focus(); n.click();
    });
  }
  function toggleIn(arr, v) { var i = arr.indexOf(v); if (i === -1) arr.push(v); else arr.splice(i, 1); }

  /* ══ PINTAR ESTADO ═══════════════════════════════════════════════════ */
  function setRadio(box, sel, v) {
    var btns = $$(sel, box), any = false;
    btns.forEach(function (b) { var on = b.dataset.v === String(v); any = any || on; b.setAttribute('aria-checked', on ? 'true' : 'false'); b.tabIndex = on ? 0 : -1; });
    if (!any && btns[0]) btns[0].tabIndex = 0;
  }
  function renderMotivo() {
    setRadio(motivoBox, '.nf-chip', S.form.motivo);
    $('#revealTrabajo').hidden = S.form.motivo !== 'trabajo';
    $('#studiesBlock').hidden = S.form.motivo !== 'estudios';
    renderOcupacion();
  }
  function renderChoices() {
    setRadio(tipoBox, '.nf-card', S.form.tipo);
    setRadio(momentoBox, '.nf-chip', S.form.momento);
    $$('.nf-chip', prioBox).forEach(function (b) { b.setAttribute('aria-pressed', S.form.prioridades.indexOf(b.dataset.v) !== -1 ? 'true' : 'false'); });
  }
  function renderBudget() {
    var cfg = MONEDAS[S.form.moneda];
    segCurrency.set(S.form.moneda);
    $('#budgetCur').textContent = S.form.moneda;
    var v = S.form.presupuesto ? Number(S.form.presupuesto) : 0;
    var shown = v ? fmtThousands(v) : '';
    if (inputs.presupuesto.value !== shown) inputs.presupuesto.value = shown;
    inputs.presupuesto.placeholder = fmtThousands(cfg.ph);
    inputs.presupuesto.style.width = Math.max(3, (shown || fmtThousands(cfg.ph)).length) + 0.4 + 'ch';
    range.min = cfg.min; range.max = cfg.max; range.step = cfg.step;
    var rv = Math.min(cfg.max, Math.max(cfg.min, v || cfg.ph));
    range.value = rv;
    range.style.setProperty('--pct', ((rv - cfg.min) / (cfg.max - cfg.min) * 100) + '%');
    $('#rMin').textContent = fmtThousands(cfg.min);
    $('#rMid').textContent = fmtThousands(Math.round((cfg.min + cfg.max) / 2 / cfg.step) * cfg.step);
    $('#rMax').textContent = fmtThousands(cfg.max) + '+';
  }
  function durationText() {
    var a = S.form.fecha_inicio, b = S.form.fecha_fin;
    if (!a || !b || b < a) return '';
    var s = parseISO(a), e = parseISO(b), m = 0;
    for (;;) { var t = new Date(s.getFullYear(), s.getMonth() + m + 1, s.getDate()); if (t <= e) m++; else break; }
    var base = new Date(s.getFullYear(), s.getMonth() + m, s.getDate());
    var d = Math.round((e - base) / 864e5);
    if (!m) return d === 1 ? '1 día' : d + ' días';
    var ms = m === 1 ? '1 mes' : m + ' meses';
    return d ? ms + ' · ' + (d === 1 ? '1 día' : d + ' días') : ms;
  }
  function renderDates() {
    var t = todayISO();
    inputs.fecha_inicio.min = t;
    inputs.fecha_fin.min = S.form.fecha_inicio || t;
    inputs.fecha_inicio.classList.toggle('is-empty', !S.form.fecha_inicio);
    inputs.fecha_fin.classList.toggle('is-empty', !S.form.fecha_fin);
    var txt = durationText();
    $('#duration').hidden = !txt;
    $('#durationText').textContent = txt;
  }
  function syncInputs() {
    ['nombre', 'email', 'edad', 'universidad_origen', 'universidad_destino', 'fecha_inicio', 'fecha_fin', 'notas'].forEach(function (k) {
      if (inputs[k].value !== S.form[k]) inputs[k].value = S.form[k];
    });
    inputs.whatsapp.value = S.form.whatsapp;
    comboPhone.set(S.form.phone_country);
    comboCountry.set(S.form.pais);
    renderCity();
    segPeople.set(S.form.personas);
    $('#c-notas').textContent = S.form.notas.length + ' / 1000';
    renderMotivo(); renderChoices(); renderBudget(); renderDates(); renderPartner();
  }

  /* ══ VALIDACIÓN ══════════════════════════════════════════════════════ */
  function errorOf(k) {
    var f = S.form;
    switch (k) {
      case 'nombre': return f.nombre.trim().length < 2 ? 'Escribe tu nombre' : '';
      case 'email': return !f.email.trim() ? 'Necesitamos tu email para enviarte las opciones' : !EMAIL_RE.test(f.email.trim()) ? 'Revisa el email, parece incompleto' : '';
      case 'whatsapp':
        if (!f.phone_country) return 'Elige el código de tu país';
        return f.whatsapp.length < 6 || f.whatsapp.length > 15 ? 'Escribe tu número, solo dígitos' : '';
      case 'pais': return f.pais ? '' : 'Elige el país al que vas';
      case 'ciudad': return f.ciudades.length ? '' : f.pais ? 'Elige al menos una ciudad' : 'Primero elige el país';
      case 'ocupacion': return f.motivo === 'trabajo' && !f.ocupacion ? 'Cuéntanos a qué te dedicas' : '';
      case 'partner': return f.partner ? '' : 'Cuéntanos quién te ayudó a llegar';
      case 'partner_nombre': return f.partner === PARTNER_OTRO && f.partner_nombre.trim().length < 2 ? 'Escribe el nombre del partner' : '';
      case 'edad':
        var age = Number(f.edad);
        return !f.edad ? 'Escribe tu edad' : age < 16 || age > 99 ? 'Ingresa una edad entre 16 y 99' : '';
      case 'motivo': return f.motivo ? '' : 'Cuéntanos qué te trae';
      case 'fecha_inicio': return !f.fecha_inicio ? 'Elige la fecha de ingreso' : f.fecha_inicio < todayISO() ? 'La fecha de ingreso no puede ser pasada' : '';
      case 'fecha_fin': return !f.fecha_fin ? 'Elige la fecha de salida' : f.fecha_inicio && f.fecha_fin <= f.fecha_inicio ? 'Debe ser posterior al ingreso' : '';
      case 'presupuesto':
        var cfg = MONEDAS[f.moneda];
        return !f.presupuesto || Number(f.presupuesto) < cfg.min ? 'Ingresa un presupuesto de al menos ' + f.moneda + ' ' + fmtThousands(cfg.min) : '';
      case 'tipo': return f.tipo ? '' : 'Elige un tipo de alojamiento';
      case 'momento': return f.momento ? '' : 'Elige una opción';
    }
    return '';
  }
  var TEXTLIKE = ['nombre', 'email', 'whatsapp', 'edad'];
  function fieldEl(k) { return $('[data-field="' + k + '"]'); }
  function validateField(k) {
    var el = fieldEl(k); if (!el) return true;
    var err = errorOf(k);
    var show = !!S.touched[k];   // booleano: toggle(clase, undefined) alterna en vez de quitar
    el.classList.toggle('is-invalid', !!err && show);
    el.classList.toggle('is-valid', !err && TEXTLIKE.indexOf(k) !== -1);
    var p = el.querySelector(':scope > .nf-field-error');
    if (p && (err && show)) p.textContent = err;
    return !err;
  }
  function touch(k) { S.touched[k] = true; }
  function validateStep(n) {
    var bad = null;
    STEP_FIELDS[n].forEach(function (k) { touch(k); if (!validateField(k) && !bad) bad = k; });
    return bad;
  }
  function stepOk(n) { return STEP_FIELDS[n].every(function (k) { return !errorOf(k); }); }

  /* ══ CAMBIOS + GUARDADO ══════════════════════════════════════════════ */
  var saveTimer = null, savedTimer = null;
  var saveStatus = $('#saveStatus');
  function changed() {
    REQUIRED.forEach(function (k) { if (S.touched[k]) validateField(k); });
    TEXTLIKE.forEach(function (k) { validateField(k); });
    renderDates();
    updateProgress();
    renderReview();
    saveStatus.textContent = 'Guardando…';
    saveStatus.className = 'nf-save-status is-visible is-saving';
    clearTimeout(saveTimer); clearTimeout(savedTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(STORE_KEY, JSON.stringify({ form: S.form, step: S.step, at: Date.now() })); } catch (e) { /* sin localStorage */ }
      saveStatus.textContent = 'Guardado';
      saveStatus.className = 'nf-save-status is-visible';
      savedTimer = setTimeout(function () { saveStatus.className = 'nf-save-status'; }, 2200);
    }, 700);
  }

  // Textos
  ['nombre', 'email', 'universidad_origen', 'universidad_destino', 'notas', 'partner_nombre'].forEach(function (k) {
    inputs[k].addEventListener('input', function () {
      S.form[k] = inputs[k].value;
      if (k === 'notas') $('#c-notas').textContent = S.form.notas.length + ' / 1000';
      changed();
    });
  });
  ['nombre', 'email'].forEach(function (k) {
    inputs[k].addEventListener('blur', function () { if (S.form[k]) { touch(k); validateField(k); } });
  });
  inputs.partner_nombre.addEventListener('blur', function () { if (S.form.partner_nombre) { touch('partner_nombre'); validateField('partner_nombre'); } });
  inputs.edad.addEventListener('input', function () {
    var d = inputs.edad.value.replace(/\D/g, '').slice(0, 2);
    if (inputs.edad.value !== d) inputs.edad.value = d;
    S.form.edad = d; changed();
  });
  inputs.edad.addEventListener('blur', function () { if (S.form.edad) { touch('edad'); validateField('edad'); } });
  inputs.whatsapp.addEventListener('input', function () {
    var d = inputs.whatsapp.value.replace(/\D/g, '').slice(0, 15);
    if (inputs.whatsapp.value !== d) inputs.whatsapp.value = d;
    S.form.whatsapp = d; changed();
  });
  inputs.whatsapp.addEventListener('blur', function () { if (S.form.whatsapp) { touch('whatsapp'); validateField('whatsapp'); } });

  // Fechas
  inputs.fecha_inicio.addEventListener('input', function () {
    S.form.fecha_inicio = inputs.fecha_inicio.value; touch('fecha_inicio');
    if (S.form.fecha_fin && S.form.fecha_fin <= S.form.fecha_inicio) { S.form.fecha_fin = ''; inputs.fecha_fin.value = ''; }
    changed();
  });
  inputs.fecha_fin.addEventListener('input', function () { S.form.fecha_fin = inputs.fecha_fin.value; touch('fecha_fin'); changed(); });

  // Presupuesto
  inputs.presupuesto.addEventListener('input', function () {
    var d = inputs.presupuesto.value.replace(/\D/g, '').slice(0, 9).replace(/^0+/, '');
    S.form.presupuesto = d;
    renderBudget();
    var len = inputs.presupuesto.value.length;
    inputs.presupuesto.setSelectionRange(len, len);
    changed();
  });
  inputs.presupuesto.addEventListener('blur', function () { if (S.form.presupuesto) { touch('presupuesto'); validateField('presupuesto'); } });
  range.addEventListener('input', function () { S.form.presupuesto = String(range.value); touch('presupuesto'); renderBudget(); changed(); });

  /* ══ PROGRESO + AVIÓN ════════════════════════════════════════════════ */
  var progress = $('#progress'), plane = $('#plane'), pctEl = $('#pct'), bubbleEl = $('#bubble');
  function pctNow() {
    if (S.done) return 100;
    var ok = REQUIRED.filter(function (k) { return !errorOf(k); }).length;
    var p = Math.round(ok / REQUIRED.length * 90);
    if (S.step === 3) p = Math.max(p, 90);
    return p;
  }
  function updateProgress(force) {
    var p = force != null ? force : pctNow();
    if (p === S.lastPct) return;
    var grew = p > S.lastPct && S.lastPct >= 0;
    S.lastPct = p;
    progress.style.setProperty('--p', p + '%');
    progress.setAttribute('aria-valuenow', p);
    pctEl.textContent = p + '%';
    if (grew) {
      pctEl.classList.remove('is-bump'); void pctEl.offsetWidth; pctEl.classList.add('is-bump');
      plane.classList.remove('is-moving'); void plane.offsetWidth; plane.classList.add('is-moving');
    }
  }
  var bubbleTimer = null;
  function cheer(text) {
    clearTimeout(bubbleTimer);
    bubbleEl.hidden = false;
    bubbleEl.classList.remove('is-out');
    bubbleEl.textContent = text;
    bubbleEl.style.animation = 'none'; void bubbleEl.offsetWidth; bubbleEl.style.animation = '';
    bubbleTimer = setTimeout(function () {
      bubbleEl.classList.add('is-out');
      bubbleTimer = setTimeout(function () { bubbleEl.hidden = true; }, 300);
    }, 2300);
  }

  /* ══ PASOS ═══════════════════════════════════════════════════════════ */
  var backBtn = $('#back'), nextBtn = $('#next'), nextLabel = $('#nextLabel'), saveNote = $('#saveNote');
  function goTo(n, opts) {
    opts = opts || {};
    var prev = S.step;
    S.step = n;
    $$('.nf-step').forEach(function (s) {
      var on = +s.dataset.step === n;
      s.hidden = !on;
      s.classList.remove('is-entering');
      if (on && prev !== n) { void s.offsetWidth; s.classList.add('is-entering'); }
    });
    $('#stepLabel').innerHTML = 'Paso <b>' + n + '</b> de 3 · ' + STEP_NAMES[n];
    backBtn.hidden = n === 1;
    saveNote.hidden = n !== 1;
    nextLabel.textContent = S.editing && n < 3 ? 'Volver al resumen' : n === 1 ? 'Guardar y continuar' : n === 2 ? 'Continuar' : 'Crear mi shortlist';
    nextBtn.classList.toggle('is-final', n === 3);
    segPeople.position(); segCurrency.position();
    updateProgress();
    renderReview();
    if (!opts.silent) {
      var top = formEl.getBoundingClientRect().top + window.scrollY - 12;
      if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' });
      var t = $('.nf-step[data-step="' + n + '"] .nf-step-title');
      if (t) t.focus({ preventScroll: true });
      changed();
    }
  }
  function focusField(k) {
    var el = fieldEl(k); if (!el) return;
    el.classList.remove('is-shake'); void el.offsetWidth; el.classList.add('is-shake');
    setTimeout(function () { el.classList.remove('is-shake'); }, 500);
    var target = el.querySelector('input:not([type=range]), .nf-combo-trigger, button');
    var r = el.getBoundingClientRect();
    if (r.top < 70 || r.bottom > window.innerHeight - 100) el.scrollIntoView({ block: 'center', behavior: REDUCED ? 'auto' : 'smooth' });
    if (target) target.focus({ preventScroll: true });
  }
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    if (S.busy) return;
    combos.forEach(function (c) { c.close(false); });
    if (S.step < 3) {
      var bad = validateStep(S.step);
      if (bad) { focusField(bad); return; }
      var to = S.editing ? 3 : S.step + 1;
      if (S.editing) S.editing = false;
      if (to === 2 && S.lastCheer !== 2) cheer(firstName() ? '¡Genial, ' + firstName() + '! 🎉' : '¡Genial! 🎉');
      if (to === 3 && S.lastCheer !== 3) cheer('¡Último paso! 🏁');
      S.lastCheer = to;
      goTo(to);
    } else {
      finish();
    }
  });
  backBtn.addEventListener('click', function () { S.editing = false; goTo(Math.max(1, S.step - 1)); });

  /* ══ REVISIÓN ════════════════════════════════════════════════════════ */
  var reviewEl = $('#review');
  function reviewRows() {
    var f = S.form;
    var motivo = (MOTIVOS.filter(function (m) { return m.value === f.motivo; })[0] || {}).label || '';
    var extra = f.motivo === 'trabajo' ? ocupacionLabel() : '';
    var fechas = '';
    if (f.fecha_inicio && f.fecha_fin) {
      var sameYear = f.fecha_inicio.slice(0, 4) === f.fecha_fin.slice(0, 4);
      fechas = fmtDate(f.fecha_inicio, !sameYear) + ' – ' + fmtDate(f.fecha_fin, true);
    }
    var tipo = (TIPOS.filter(function (t) { return t.value === f.tipo; })[0] || {}).label || '';
    var personas = f.personas === 1 ? 'Solo/a' : f.personas === 4 ? '4+ personas' : f.personas + ' personas';
    var mom = (MOMENTOS.filter(function (m) { return m.value === f.momento; })[0] || {}).label || '';
    return [
      { k: 'Nombre', v: f.nombre.trim(), s: 1 },
      { k: 'WhatsApp', v: f.phone_code && f.whatsapp ? '+' + f.phone_code + ' ' + f.whatsapp : '', s: 1 },
      { k: S.form.ciudades.length > 1 ? 'Destinos' : 'Destino', v: citiesText(), s: 1 },
      { k: 'Edad', v: f.edad ? f.edad + ' años' : '', s: 1 },
      { k: 'Partner', v: partnerLabel(), s: 1 },
      { k: 'Motivo', v: motivo + (extra ? ' · ' + extra : ''), s: 1 },
      { k: 'Fechas', v: fechas, s: 2 },
      { k: 'Presupuesto', v: f.presupuesto ? f.moneda + ' ' + fmtThousands(f.presupuesto) + '/mes' : '', s: 2 },
      { k: 'Alojamiento', v: tipo ? tipo + ' · ' + personas : '', s: 2 },
      { k: 'Momento', v: mom, s: 2 },
    ];
  }
  function renderReview() {
    if (S.step !== 3) return;
    reviewEl.innerHTML = '';
    reviewRows().forEach(function (r) {
      var d = h('div');
      var dt = h('dt');
      dt.appendChild(h('span', { text: r.k }));
      var b = h('button', { type: 'button', class: 'nf-review-edit', 'aria-label': 'Editar ' + r.k.toLowerCase() },
        '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="m13.5 6.5 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Editar');
      b.addEventListener('click', function () { S.editing = true; goTo(r.s); });
      dt.appendChild(b);
      d.appendChild(dt);
      d.appendChild(h('dd', { title: r.v, text: r.v || '—' }));
      reviewEl.appendChild(d);
    });
  }

  /* ══ ENVÍO (simulado) ════════════════════════════════════════════════ */
  var LOADING_MSGS = ['Buscando tu alojamiento ideal…', 'Cruzando fechas, zona y presupuesto…', 'Eligiendo pocas opciones, pero buenas…', '¡Tu próximo lugar te espera!'];
  function finish() {
    for (var n = 1; n <= 2; n++) {
      if (!stepOk(n)) { goTo(n); var bad = validateStep(n); focusField(bad); return; }
    }
    S.busy = true;
    nextBtn.disabled = true;
    S.done = true;
    updateProgress(100);
    cheer('¡Despegando! ✈️');
    setTimeout(function () { plane.classList.add('is-takeoff'); }, 450);
    setTimeout(function () { $('#topbar').classList.add('is-gone'); }, 1200);
    setTimeout(function () {
      formEl.classList.add('is-leaving');
      setTimeout(showLoader, 320);
    }, 1450);
  }
  function showLoader() {
    var h0 = formEl.offsetHeight;
    formEl.hidden = true;
    var ld = $('#loader');
    ld.style.minHeight = Math.min(Math.max(420, h0), 640) + 'px';
    ld.hidden = false;
    var msg = $('#loaderMsg'), i = 0;
    msg.textContent = LOADING_MSGS[0];
    var t = setInterval(function () {
      msg.classList.add('is-out');
      setTimeout(function () { i = (i + 1) % LOADING_MSGS.length; msg.textContent = LOADING_MSGS[i]; msg.classList.remove('is-out'); }, 300);
    }, 1900);
    setTimeout(function () { clearInterval(t); ld.hidden = true; showDone(); }, Math.max(LOADER_MIN_MS, 4200));
  }
  function showDone() {
    var name = firstName();
    $('#doneTitle').textContent = name ? '¡Listo, ' + name + '! Tu búsqueda ya está en marcha' : 'Tu búsqueda ya está en marcha';
    $('#done').hidden = false;
    $('#doneTitle').focus({ preventScroll: true });
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* nada */ }
    confetti($('#confetti'));
  }
  $('#again').addEventListener('click', function () { resetAll(); });
  function resetAll() {
    S.form = emptyForm(); S.touched = {}; S.editing = false; S.busy = false; S.done = false; S.lastPct = -1; S.lastCheer = 0;
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* nada */ }
    $('#done').hidden = true; $('#loader').hidden = true; $('#toast').hidden = true;
    formEl.hidden = false; formEl.classList.remove('is-leaving');
    $('#topbar').classList.remove('is-gone'); plane.classList.remove('is-takeoff');
    nextBtn.disabled = false;
    $$('.nf-field').forEach(function (f) { f.classList.remove('is-invalid', 'is-valid'); });
    syncInputs();
    goTo(1, { silent: true });
    updateProgress();
    window.scrollTo(0, 0);
  }
  $('#restart').addEventListener('click', function () { resetAll(); inputs.nombre.focus(); });

  function confetti(canvas) {
    if (REDUCED || !canvas.getContext) return;
    var ctx = canvas.getContext('2d'), dpr = window.devicePixelRatio || 1;
    var W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W * dpr; canvas.height = H * dpr; ctx.scale(dpr, dpr);
    var colors = ['#ff7a00', '#ff9a3d', '#6d3ce0', '#b8399f', '#1f9d6c', '#ffd6ad'];
    var parts = [];
    for (var i = 0; i < 120; i++) {
      parts.push({ x: W / 2 + (Math.random() - .5) * 80, y: H * .28, vx: (Math.random() - .5) * 9, vy: -Math.random() * 9 - 3, s: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: colors[i % colors.length] });
    }
    var t0 = performance.now();
    (function frame(now) {
      var el = now - t0;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) {
        p.vy += .22; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - el / 2600); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore();
      });
      if (el < 2600) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(t0);
  }

  /* ══ ONDA AL TOCAR ═══════════════════════════════════════════════════ */
  document.addEventListener('pointerdown', function (e) {
    var t = e.target.closest('.nf-chip, .nf-card, .nf-option, .nf-btn-primary');
    if (!t || REDUCED) return;
    var r = t.getBoundingClientRect(), size = Math.max(r.width, r.height);
    var s = h('span', { class: 'nf-ripple' });
    s.style.width = s.style.height = size + 'px';
    s.style.left = (e.clientX - r.left - size / 2) + 'px';
    s.style.top = (e.clientY - r.top - size / 2) + 'px';
    t.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  });

  /* ══ CARRUSEL DE PARTNERS ════════════════════════════════════════════ */
  (function logos() {
    var track = $('#lgTrack');
    [false, true].forEach(function (copy) {
      LOGOS.forEach(function (l) {
        var li = h('li', { class: 'lg-item' + (l.wide ? ' is-wide' : ''), title: l.name });
        if (copy) li.setAttribute('aria-hidden', 'true');
        li.style.setProperty('--bg', l.bg || '#fff');
        if (l.z) li.style.setProperty('--z', l.z);
        if (l.pad) li.style.setProperty('--pad', l.pad);
        li.appendChild(h('img', { src: 'assets/logos/' + l.src, alt: copy ? '' : l.name, decoding: 'async' }));
        track.appendChild(li);
      });
    });
  })();

  /* ══ INICIO ══════════════════════════════════════════════════════════ */
  (function init() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { saved = null; }
    if (saved && saved.form) {
      S.form = Object.assign(emptyForm(), saved.form);
      ['prioridades'].forEach(function (k) { if (!Array.isArray(S.form[k])) S.form[k] = []; });
      delete S.form.zonas; delete S.form.zona_otra; // progreso guardado antes de quitar las zonas
      // progreso guardado con la versión anterior (partner en el paso 3, "¿Dónde estudiarás?" en el paso 1)
      if (saved.form.partner_otro) { S.form.partner = PARTNER_OTRO; S.form.partner_nombre = saved.form.partner || ''; }
      if (saved.form.institucion && !S.form.universidad_destino) S.form.universidad_destino = saved.form.institucion;
      if (S.form.partner && !partnerOptions.some(function (o) { return o.value === S.form.partner; })) S.form.partner = '';
      delete S.form.partner_otro; delete S.form.institucion; delete S.form.empresa; delete S.form.ocupacion_otra;
      if (!MONEDAS[S.form.moneda]) S.form.moneda = 'EUR';
      // antes había una sola ciudad (ciudad: 'madrid'); ahora son varias
      if (!Array.isArray(S.form.ciudades)) S.form.ciudades = [];
      if (saved.form.ciudad && !S.form.ciudades.length) S.form.ciudades = [saved.form.ciudad];
      delete S.form.ciudad;
      S.form.ciudades = S.form.ciudades.filter(function (c) { return CITY_COUNTRY[c]; });
      if (S.form.ciudades.length && !S.form.pais) S.form.pais = CITY_COUNTRY[S.form.ciudades[0]];
      S.form.ciudades = S.form.ciudades.filter(function (c) { return CITY_COUNTRY[c] === S.form.pais; });
      if (S.form.ocupacion && !OCUPACIONES.some(function (o) { return o.value === S.form.ocupacion; })) S.form.ocupacion = '';
      if (S.form.pais && !COUNTRY[S.form.pais]) { S.form.pais = ''; S.form.ciudades = []; }
      if (S.form.fecha_inicio && S.form.fecha_inicio < todayISO()) { S.form.fecha_inicio = ''; S.form.fecha_fin = ''; }
      var hasData = S.form.nombre || S.form.email || S.form.whatsapp || S.form.ciudades.length;
      if (hasData) $('#toast').hidden = false;
      var step = Math.min(3, Math.max(1, saved.step || 1));
      if (step >= 2 && !stepOk(1)) step = 1;
      if (step === 3 && !stepOk(2)) step = 2;
      S.step = step;
      S.lastCheer = step;
    }
    syncInputs();
    goTo(S.step, { silent: true });
    updateProgress();
    // El indicador del segmentado necesita la fuente ya cargada para medir bien
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { segPeople.position(); segCurrency.position(); });
  })();
})();
