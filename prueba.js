// Prueba de la demo: node prueba.js  (NODE_PATH = hyf-front/node_modules)
const puppeteer = require('puppeteer');
const path = require('path');
const URL = 'file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/');
const OUT = path.join(__dirname, '_capturas');
require('fs').mkdirSync(OUT, { recursive: true });

const results = [];
const ok = (name, cond, extra) => { results.push([cond ? 'OK ' : 'FAIL', name, extra || '']); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const iso = (d) => d.toISOString().slice(0, 10);

(async () => {
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--hide-scrollbars=false'] });
  const errors = [];
  for (const [w, hgt] of [[1440, 900], [1024, 768], [390, 844]]) {
    const page = await browser.newPage();
    // En celular la barra de botones es fija abajo: centrar antes de hacer clic (como haría una persona)
    const rawClick = page.click.bind(page);
    page.click = async (sel) => { await page.evaluate((s) => { const e = document.querySelector(s); if (e) e.scrollIntoView({ block: 'center' }); }, sel); return rawClick(sel); };
    page.on('pageerror', (e) => errors.push(w + ' pageerror ' + e.message));
    page.on('console', (m) => { if (m.type() === 'error' && !/flagcdn|fonts\.g/.test(m.text())) errors.push(w + ' console ' + m.text()); });
    await page.setViewport({ width: w, height: hgt });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    // Cabecera de Sophi sana: subtítulo entero, dentro de la tarjeta y sin pisarse con el estado
    await page.evaluateOnNewDocument(() => {
      window.whoOk = () => {
        const sim = document.querySelector('.sim').getBoundingClientRect();
        const small = document.querySelector('.sim-who small'), sr = small.getBoundingClientRect();
        const st = document.querySelector('#simStatus').getBoundingClientRect(), nm = document.querySelector('.sim-who strong').getBoundingClientRect();
        return small.textContent === 'Asistente de House & Flats' && small.scrollWidth <= small.clientWidth + 1 && sr.right <= sim.right - 8 &&
          st.right <= sim.right - 8 && nm.right <= st.left && !(sr.top < st.bottom && sr.bottom > st.top && sr.right > st.left);
      };
    });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(600);

    const hscroll = () => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    ok(w + ' sin scroll horizontal (inicio)', !(await hscroll()));
    const sideVisible = await page.evaluate(() => getComputedStyle(document.querySelector('.nf-side')).display !== 'none');
    ok(w + ' lateral ' + (w > 900 ? 'visible' : 'oculto'), w > 900 ? sideVisible : !sideVisible);
    ok(w + ' sin logo arriba a la izquierda', await page.evaluate(() => !document.querySelector('.nf-side img[src*="logo-horizontal"], .logo')));
    ok(w + ' barra dentro del formulario', await page.evaluate(() => !!document.querySelector('#form > .nf-topbar #plane')));
    ok(w + ' barras de scroll ocultas', await page.evaluate(() => {
      const s = document.querySelector('.nf-side');
      return getComputedStyle(document.documentElement).scrollbarWidth === 'none' && getComputedStyle(s).scrollbarWidth === 'none' && window.innerWidth === document.documentElement.clientWidth;
    }));
    if (w > 900) ok(w + ' lateral blanco con bordes derechos redondeados', await page.evaluate(() => {
      const c = getComputedStyle(document.querySelector('.nf-side'));
      return c.backgroundColor === 'rgb(255, 255, 255)' && c.backgroundImage === 'none' && parseFloat(c.borderTopRightRadius) > 20 && parseFloat(c.borderBottomRightRadius) > 20 && parseFloat(c.borderTopLeftRadius) === 0;
    }));
    if (w > 900) {
      ok(w + ' carrusel con 20 logos (10 + copia)', await page.evaluate(() => document.querySelectorAll('#lgTrack .lg-item').length === 20));
      const lh = await page.evaluate(() => document.querySelector('.lg-item').getBoundingClientRect().height);
      ok(w + ' logos chicos (alto ' + lh + ')', lh <= 44);
      const logosOk = await page.evaluate(() => [...document.querySelectorAll('#lgTrack img')].slice(0, 10).every((i) => i.complete && i.naturalWidth > 0));
      ok(w + ' logos cargan', logosOk);
      // Al empezar: solo "Buscando tu mejor match…" (sin "Revisando N alojamientos")
      await page.waitForFunction(() => !document.querySelector('#simMsgText').hidden, { timeout: 5000 });
      const first = await page.$eval('#simMsgText', (e) => e.textContent);
      ok(w + ' Sophi empieza con "Buscando tu mejor match…"', first === 'Buscando tu mejor match…', first);
      await sleep(3200);
      const simCards = await page.evaluate(() => document.querySelectorAll('#simStage .sim-card').length);
      ok(w + ' simulación muestra tarjetas (' + simCards + ')', simCards >= 1);
      ok(w + ' cabecera de Sophi bien con "' + (await page.$eval('#simStatus', (e) => e.textContent)) + '"', await page.evaluate(() => whoOk()));
      const stamps = await page.evaluate(() => [...document.querySelectorAll('#simStage .sim-stamp')].map((s) => s.textContent));
      ok(w + ' sellos solo "Match ✓" o "No match ✕"', stamps.length >= 3 && stamps.every((s) => s === 'Match ✓' || s === 'No match ✕'), stamps.join('|'));
      const sideOverflow = await page.evaluate(() => { const s = document.querySelector('.nf-side'); return s.scrollHeight - s.clientHeight; });
      ok(w + ' lateral entra en pantalla (sobra ' + sideOverflow + 'px)', sideOverflow <= 2);
      await page.screenshot({ path: path.join(OUT, w + '-paso1.png') });
      if (w === 1440) {
        // Junta todo lo que dice Sophi durante la vuelta
        await page.evaluate(() => {
          window.__said = []; window.__status = [];
          new MutationObserver(() => window.__status.push(document.querySelector('#simStatus').textContent)).observe(document.querySelector('#simStatus'), { childList: true, characterData: true, subtree: true });
          new MutationObserver(() => window.__said.push(document.querySelector('#simMsgText').textContent)).observe(document.querySelector('#simMsgText'), { childList: true, characterData: true, subtree: true });
        });
        await page.waitForFunction(() => { const t = document.querySelector('.sim-wa-ticks'); return t && t.classList.contains('is-read'); }, { timeout: 40000 });
        await sleep(400);
        const wa = await page.evaluate(() => {
          const st = document.querySelector('#simStage').getBoundingClientRect(), box = document.querySelector('.sim-wa').getBoundingClientRect();
          const bubble = document.querySelector('.sim-wa-bubble').getBoundingClientRect();
          return {
            rows: document.querySelectorAll('.sim-wa-list li.is-in').length,
            fits: box.bottom <= st.bottom + 1 && bubble.bottom <= box.bottom && bubble.top >= box.top,
            dots: document.querySelectorAll('.sim-dots i.is-on').length,
            status: document.querySelector('#simStatus').textContent,
            said: window.__said.join(' / '),
            statuses: [...new Set(window.__status)].join(' / '),
            shadowViolet: /109, 60, 224/.test(getComputedStyle(document.querySelector('.sim')).boxShadow + getComputedStyle(document.querySelector('.sim-avatar')).boxShadow),
            clipped: getComputedStyle(document.querySelector('#simStage')).overflow === 'hidden',
            text: document.querySelector('.sim').textContent,
            who: whoOk(),
          };
        });
        ok(w + ' WhatsApp: se envían los 3 matches', wa.rows === 3);
        ok(w + ' WhatsApp entra en la tarjeta', wa.fits);
        ok(w + ' 3 puntitos de match', wa.dots === 3);
        ok(w + ' estado "Enviado ✓✓"', wa.status === 'Enviado ✓✓', wa.status);
        ok(w + ' hubo "¡Match!" y "No match"', /¡Match!/.test(wa.said) && /No match/.test(wa.said), wa.said);
        ok(w + ' sin "alojamientos en…" ni bajo/medio/alto', !/Revisando \d|alojamientos en|Quedan \d|Precio (bajo|medio|alto)|\bBajo\b|\bMedio\b|\bAlto\b/.test(wa.said + ' ' + wa.text));
        ok(w + ' cabecera de Sophi bien en WhatsApp', wa.who);
        ok(w + ' estado nunca dice "Revisando"', !/Revisando/.test(wa.statuses), wa.statuses);
        ok(w + ' sin sombra violeta alrededor de Sophi', !wa.shadowViolet);
        ok(w + ' lo que entra y sale queda dentro de la tarjeta', wa.clipped);
        await page.screenshot({ path: path.join(OUT, w + '-sim-wa.png'), clip: { x: 0, y: 220, width: 490, height: 360 } });
      }
    }
    ok(w + ' sin "Así funcionará tu match"', await page.evaluate(() => !document.body.textContent.includes('Así funcionará') && !document.body.textContent.includes('Mejora el match')));


    // Tocar una opción no marca en rojo los campos que todavía no se tocaron
    await page.click('#motivoChips [data-v="otro"]');
    await page.click('#motivoChips [data-v="trabajo"]');
    await sleep(200);
    ok(w + ' sin errores falsos al elegir opciones', await page.evaluate(() => document.querySelectorAll('.nf-field.is-invalid').length === 0));
    await page.evaluate(() => localStorage.clear());
    await sleep(900);
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(300);

    // Paso 1 vacío → errores
    await page.click('#next');
    await sleep(300);
    const inv = await page.evaluate(() => document.querySelectorAll('.nf-step[data-step="1"] .nf-field.is-invalid').length);
    ok(w + ' paso 1 vacío marca 6 errores', inv === 6, String(inv));
    ok(w + ' ciudad bloqueada sin país', await page.evaluate(() => document.querySelector('#comboCity .nf-combo-trigger').disabled));

    await page.type('#f-nombre', 'Camila Rojas');
    await page.type('#f-email', 'camila@example.com');
    // Código de país por teclado (buscar "chile")
    await page.click('#comboPhone .nf-combo-trigger');
    await page.keyboard.type('chile');
    await page.keyboard.press('Enter');
    await sleep(150);
    ok(w + ' código +56', (await page.evaluate(() => document.querySelector('#comboPhone .nf-combo-value').textContent)).includes('+56'));
    ok(w + ' foco pasa al número', await page.evaluate(() => document.activeElement.id === 'f-whatsapp'));
    await page.type('#f-whatsapp', '9 1234-5678');
    ok(w + ' número solo dígitos', (await page.$eval('#f-whatsapp', (e) => e.value)) === '912345678');
    await page.click('#comboCountry .nf-combo-trigger');
    await page.keyboard.type('espa');
    await page.keyboard.press('Enter');
    await sleep(250);
    ok(w + ' país España', (await page.evaluate(() => document.querySelector('#comboCountry .nf-combo-value').textContent)).includes('España'));
    ok(w + ' se abre la lista de ciudades de España', await page.evaluate(() => {
      const o = [...document.querySelectorAll('#comboCity .nf-combo-option')].map((x) => x.textContent);
      return o.length === 9 && o.includes('Madrid') && !o.includes('Santiago');
    }));
    await page.keyboard.type('madr');
    await sleep(100);
    await page.click('#comboCity .nf-combo-option');
    await sleep(150);
    ok(w + ' ciudad Madrid', (await page.evaluate(() => document.querySelector('#comboCity .nf-combo-value').textContent)).includes('Madrid'));
    // Cambiar de país borra la ciudad; volver a España
    await page.click('#comboCountry .nf-combo-trigger');
    await page.keyboard.type('chile');
    await page.keyboard.press('Enter');
    await sleep(250);
    ok(w + ' cambiar país borra la ciudad y muestra las de Chile', await page.evaluate(() => !document.querySelector('#comboCity').classList.contains('has-value') && [...document.querySelectorAll('#comboCity .nf-combo-option')].some((x) => x.textContent === 'Santiago')));
    await page.keyboard.press('Escape');
    await page.click('#comboCountry .nf-combo-trigger');
    await page.keyboard.type('espa');
    await page.keyboard.press('Enter');
    await sleep(250);
    await page.keyboard.type('madrid');
    await page.keyboard.press('Enter');
    await sleep(150);
    await page.click('#motivoChips [data-v="estudios"]');
    await sleep(100);
    ok(w + ' aparece "¿Dónde estudiarás?"', await page.evaluate(() => !document.querySelector('#revealEstudios').hidden));
    await page.type('#f-institucion', 'Universidad Complutense');
    ok(w + ' sin errores en paso 1 completo', await page.evaluate(() => document.querySelectorAll('.nf-step[data-step="1"] .nf-field.is-invalid').length === 0));
    const pct1 = await page.$eval('#pct', (e) => e.textContent);
    ok(w + ' progreso subió (' + pct1 + ')', parseInt(pct1) >= 40);
    ok(w + ' sin scroll horizontal (paso 1)', !(await hscroll()));
    if (w === 390) await page.screenshot({ path: path.join(OUT, w + '-paso1.png'), fullPage: true });

    await page.click('#next');
    await sleep(500);
    ok(w + ' paso 2 visible', await page.evaluate(() => !document.querySelector('.nf-step[data-step="2"]').hidden));
    ok(w + ' cartel de ánimo', await page.evaluate(() => { const b = document.querySelector('#bubble'); return !b.hidden && b.textContent.includes('Camila'); }));
    ok(w + ' moneda sugerida EUR', (await page.$eval('#budgetCur', (e) => e.textContent)) === 'EUR');

    // Paso 2
    const a = new Date(); a.setDate(a.getDate() + 20);
    const b = new Date(a); b.setMonth(b.getMonth() + 5);
    await page.evaluate((x, y) => {
      const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); };
      set('f-inicio', x); set('f-fin', y);
    }, iso(a), iso(b));
    await sleep(150);
    const dur = await page.$eval('#durationText', (e) => e.textContent);
    ok(w + ' duración "5 meses"', dur.startsWith('5 meses'), dur);
    await page.type('#f-presupuesto', '850');
    ok(w + ' presupuesto 850', (await page.$eval('#f-range', (e) => e.value)) === '850');
    await page.type('#f-presupuesto', '0');
    ok(w + ' miles con punto (8.500)', (await page.$eval('#f-presupuesto', (e) => e.value)) === '8.500');
    await page.keyboard.press('Backspace');
    ok(w + ' borrar vuelve a 850', (await page.$eval('#f-presupuesto', (e) => e.value)) === '850');
    await page.click('#tipoCards [data-v="monoambiente"]');
    await page.click('#segPeople .nf-seg-btn:nth-of-type(2)');
    await page.click('#momentoChips [data-v="confirmado"]');
    ok(w + ' momento con las 3 opciones de hf_front_3_pasos', await page.evaluate(() => [...document.querySelectorAll('#momentoChips .nf-chip')].map((b) => b.textContent).join('|') === '✈️ Ya tengo viaje confirmado|📍 Ya estoy en la ciudad|🔎 Estoy comparando opciones'));
    await sleep(500);
    const ind = await page.evaluate(() => { const i = document.querySelector('#segPeople .nf-seg-indicator').getBoundingClientRect(); const s = document.querySelector('#segPeople [aria-checked="true"]').getBoundingClientRect(); return Math.abs(i.left - s.left) + Math.abs(i.width - s.width); });
    ok(w + ' indicador de personas sobre la opción', ind < 2, String(ind));
    ok(w + ' sin scroll horizontal (paso 2)', !(await hscroll()));
    await page.screenshot({ path: path.join(OUT, w + '-paso2.png'), fullPage: true });

    // Recargar: recupera el progreso
    await sleep(900);
    await page.reload({ waitUntil: 'networkidle2' });
    await sleep(400);
    ok(w + ' recupera paso 2 al recargar', await page.evaluate(() => !document.querySelector('.nf-step[data-step="2"]').hidden && !document.querySelector('#toast').hidden));
    ok(w + ' recupera presupuesto', (await page.$eval('#f-presupuesto', (e) => e.value)) === '850');

    await page.click('#next');
    await sleep(500);
    ok(w + ' paso 3 visible', await page.evaluate(() => !document.querySelector('.nf-step[data-step="3"]').hidden));
    ok(w + ' sin "Zonas que prefieres"', await page.evaluate(() => !document.querySelector('[data-field="zonas"]') && !document.body.textContent.includes('Zonas que prefieres')));
    await page.click('#prioChips [data-v="Ubicación"]');
    // Partner: elegir de la lista, quitar, "Otro" con texto
    ok(w + ' partners: 10 + Otro', await page.evaluate(() => document.querySelectorAll('#partnerChips .nf-chip').length === 11));
    await page.click('#partnerChips [data-v="Civitatis"]');
    ok(w + ' partner elegido', await page.evaluate(() => document.querySelector('#partnerChips [data-v="Civitatis"]').getAttribute('aria-pressed') === 'true' && document.querySelector('#revealPartner').hidden));
    await page.click('#partnerChips [data-v="__otro"]');
    await sleep(100);
    ok(w + ' "Otro" abre el campo y quita Civitatis', await page.evaluate(() => !document.querySelector('#revealPartner').hidden && document.querySelector('#partnerChips [data-v="Civitatis"]').getAttribute('aria-pressed') === 'false'));
    const fid = await page.evaluate(() => document.activeElement.id);
    ok(w + ' foco en el campo del partner', fid === 'f-partner', fid);
    await page.type('#f-partner', 'Universidad de Chile');
    await page.click('#partnerChips [data-v="Tuki"]');
    await page.click('#partnerChips [data-v="Tuki"]');
    ok(w + ' tocar de nuevo lo quita (ninguno)', await page.evaluate(() => !document.querySelector('#partnerChips [aria-pressed="true"]')));
    await page.click('#partnerChips [data-v="__otro"]');
    await page.type('#f-partner', 'Universidad de Chile');
    await page.type('#f-notas', 'Tengo un gato');
    ok(w + ' contador de notas', (await page.$eval('#c-notas', (e) => e.textContent)) === '13 / 1000');
    const rev = await page.evaluate(() => [...document.querySelectorAll('#review dd')].map((d) => d.textContent));
    ok(w + ' resumen completo', rev.length === 8 && !rev.includes('—'), rev.join(' | '));
    ok(w + ' progreso 90%', (await page.$eval('#pct', (e) => e.textContent)) === '90%');
    // Editar destino → vuelve al resumen
    await page.click('#review > div:nth-child(3) .nf-review-edit');
    await sleep(300);
    ok(w + ' editar va al paso 1', await page.evaluate(() => !document.querySelector('.nf-step[data-step="1"]').hidden && document.querySelector('#nextLabel').textContent === 'Volver al resumen'));
    await page.click('#next');
    await sleep(400);
    ok(w + ' vuelve directo al resumen', await page.evaluate(() => !document.querySelector('.nf-step[data-step="3"]').hidden));
    ok(w + ' sin scroll horizontal (paso 3)', !(await hscroll()));
    await page.screenshot({ path: path.join(OUT, w + '-paso3.png'), fullPage: true });

    await page.click('#next');
    await sleep(1900);
    ok(w + ' carga dentro del recuadro', await page.evaluate(() => !document.querySelector('#loader').hidden && document.querySelector('#form').hidden));
    await sleep(4600);
    ok(w + ' pantalla de éxito', await page.evaluate(() => !document.querySelector('#done').hidden && document.querySelector('#doneTitle').textContent.includes('Camila')));
    if (w > 900) {
      ok(w + ' Sophi confirma en el lateral', (await page.$eval('#simMsgText', (e) => e.textContent)).includes('Recibí'));
      ok(w + ' cabecera de Sophi bien al final (' + (await page.$eval('#simStatus', (e) => e.textContent)) + ')', await page.evaluate(() => whoOk()));
      ok(w + ' pie de Sophi sin cortar al final', await page.evaluate(() => { const t = document.querySelector('#simCount'); return t.scrollWidth <= t.clientWidth + 1; }));
      ok(w + ' "Búsqueda recibida" entra en la tarjeta', await page.evaluate(() => {
        const st = document.querySelector('#simStage').getBoundingClientRect(), l = document.querySelector('.sim-list');
        return !!l && l.getBoundingClientRect().bottom <= st.bottom + 1 && [...l.querySelectorAll('.sim-list-name')].every((n) => n.scrollWidth <= n.clientWidth + 1);
      }));
      await page.screenshot({ path: path.join(OUT, w + '-sim-recibida.png'), clip: { x: 0, y: 220, width: Math.round(w * 0.36), height: 360 } });
    }
    ok(w + ' borra el progreso guardado', await page.evaluate(() => !localStorage.getItem('hyf_demo_formulario_3p')));
    ok(w + ' sin scroll horizontal (éxito)', !(await hscroll()));
    await page.screenshot({ path: path.join(OUT, w + '-listo.png') });
    await page.click('#again');
    await sleep(300);
    ok(w + ' "Ver de nuevo" reinicia', await page.evaluate(() => !document.querySelector('.nf-step[data-step="1"]').hidden && document.querySelector('#f-nombre').value === ''));
    await page.close();
  }
  ok('sin errores de consola', errors.length === 0, errors.join(' || '));
  await browser.close();
  const fails = results.filter((r) => r[0] !== 'OK ');
  results.forEach((r) => console.log(r.join('  ')));
  console.log(`\n${results.length - fails.length}/${results.length} OK`);
})();
