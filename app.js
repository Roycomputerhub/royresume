/* ═══════════════════════════════════════════════════════
   Roy Computer Hub – Smart Resume Builder
   Complete Application Logic with Live Preview
   ═══════════════════════════════════════════════════════ */

// ─── STATE ───
let photoDataURL = null;
let educationCount = 0;
let otherCount = 0;
let zoomLevel = 100;

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  addEducation();
  addOther();
  setupPhotoUpload();
  setupLivePreview();
  updatePreview();
  zoomFit();
});

// ═══════════════════════════════════════════
// LIVE PREVIEW ENGINE
// ═══════════════════════════════════════════
function setupLivePreview() {
  const form = document.getElementById('resume-form');
  form.addEventListener('input', () => {
    updatePreview();
    updateModeIndicator();
    updateProgressBar();
  });
  form.addEventListener('change', () => {
    updatePreview();
    updateModeIndicator();
    updateProgressBar();
  });
}

function updatePreview() {
  const content = document.getElementById('resume-content');
  if (content) {
    content.innerHTML = buildResumeHTML();
    applyLayoutEngine();
  }
}

// ═══════════════════════════════════════════
// DYNAMIC EDUCATION ROWS
// ═══════════════════════════════════════════
function addEducation() {
  educationCount++;
  const id = educationCount;
  const html = `
    <div class="edu-row" id="edu-${id}">
      <div class="edu-field--name">
        <input type="text" data-field="edu-name-${id}" placeholder="e.g., HSLC, HS, BA" oninput="updatePreview()" />
      </div>
      <div class="edu-field--board">
        <input type="text" data-field="edu-board-${id}" placeholder="e.g., SEBA, AHSEC, GU" oninput="updatePreview()" />
      </div>
      <div class="edu-field--year">
        <input type="text" data-field="edu-year-${id}" placeholder="e.g., 2024" oninput="updatePreview()" />
      </div>
      <div class="edu-field--pct">
        <input type="text" data-field="edu-pct-${id}" placeholder="e.g., 85%" oninput="updatePreview()" />
      </div>
      <div class="edu-field--div">
        <select data-field="edu-div-${id}" onchange="updatePreview()">
          <option value="">-- Division --</option>
          <option value="First">First</option>
          <option value="Second">Second</option>
          <option value="Third">Third</option>
          <option value="Distinction">Distinction</option>
        </select>
      </div>
      <button type="button" class="remove-btn" onclick="removeRow('edu-${id}')" title="Remove">×</button>
    </div>`;
  document.getElementById('education-list').insertAdjacentHTML('beforeend', html);
  updatePreview();
}

// ═══════════════════════════════════════════
// DYNAMIC OTHER QUALIFICATION ROWS
// ═══════════════════════════════════════════
function addOther() {
  otherCount++;
  const id = otherCount;
  const html = `
    <div class="other-row" id="other-${id}">
      <div class="other-field--name">
        <input type="text" data-field="other-name-${id}" placeholder="e.g., DCA, Tally" oninput="updatePreview()" />
      </div>
      <div class="other-field--inst">
        <input type="text" data-field="other-inst-${id}" placeholder="e.g., NIIT, APTECH" oninput="updatePreview()" />
      </div>
      <div class="other-field--year">
        <input type="text" data-field="other-year-${id}" placeholder="e.g., 2024" oninput="updatePreview()" />
      </div>
      <div class="other-field--score">
        <input type="text" data-field="other-score-${id}" placeholder="e.g., A Grade" oninput="updatePreview()" />
      </div>
      <div class="other-field--dur">
        <input type="text" data-field="other-dur-${id}" placeholder="e.g., 6 months" oninput="updatePreview()" />
      </div>
      <button type="button" class="remove-btn" onclick="removeRow('other-${id}')" title="Remove">×</button>
    </div>`;
  document.getElementById('other-list').insertAdjacentHTML('beforeend', html);
  updatePreview();
}

// ─── REMOVE ROW ───
function removeRow(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.97)';
    el.style.transition = 'all .2s ease';
    setTimeout(() => {
      el.remove();
      updatePreview();
      updateModeIndicator();
      updateProgressBar();
    }, 200);
  }
}

// ═══════════════════════════════════════════
// PHOTO UPLOAD
// ═══════════════════════════════════════════
function setupPhotoUpload() {
  const input = document.getElementById('photoUpload');
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024) {
      showToast('⚠️ Photo must be less than 100KB');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      photoDataURL = ev.target.result;
      showToast('✅ Photo uploaded successfully');
      updatePreview();
    };
    reader.readAsDataURL(file);
  });
}

// ═══════════════════════════════════════════
// DATA HELPERS
// ═══════════════════════════════════════════
function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}
function getDataVal(field) {
  const el = document.querySelector(`[data-field="${field}"]`);
  return el ? el.value.trim() : '';
}

function getEducationData() {
  const entries = [];
  document.querySelectorAll('[id^="edu-"]').forEach(el => {
    const id = el.id.replace('edu-', '');
    const name = getDataVal(`edu-name-${id}`);
    const board = getDataVal(`edu-board-${id}`);
    const year = getDataVal(`edu-year-${id}`);
    const pct = getDataVal(`edu-pct-${id}`);
    const div = getDataVal(`edu-div-${id}`);
    if (name || board) {
      entries.push({ name: name || '—', board: board || '—', year: year || '—', pct: pct || '—', div: div || '—' });
    }
  });
  return entries;
}

function getOtherData() {
  const entries = [];
  document.querySelectorAll('[id^="other-"]').forEach(el => {
    const id = el.id.replace('other-', '');
    const name = getDataVal(`other-name-${id}`);
    const inst = getDataVal(`other-inst-${id}`);
    const year = getDataVal(`other-year-${id}`);
    const score = getDataVal(`other-score-${id}`);
    const dur = getDataVal(`other-dur-${id}`);
    if (name || inst) {
      entries.push({ name: name || '—', inst: inst || '—', year: year || '—', score: score || '—', dur: dur || '—' });
    }
  });
  return entries;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ═══════════════════════════════════════════
// SMART MODE DETECTION
// ═══════════════════════════════════════════
function isExperiencedMode() {
  return getVal('experience').length > 0;
}

function updateModeIndicator() {
  const badge = document.getElementById('mode-badge');
  const label = document.getElementById('mode-label');
  if (isExperiencedMode()) {
    badge.classList.add('experienced');
    label.textContent = 'Experienced Mode';
  } else {
    badge.classList.remove('experienced');
    label.textContent = 'Fresher Mode';
  }
}

// ═══════════════════════════════════════════
// PROGRESS BAR
// ═══════════════════════════════════════════
function updateProgressBar() {
  const fields = [
    getVal('applicantName'), getVal('fatherName'), getVal('motherName'),
    getVal('email'), getVal('mobile'), getVal('dob'), getVal('gender'),
    getVal('address'), getVal('languages')
  ];
  const eduData = getEducationData();
  const total = fields.length + 1;
  let filled = fields.filter(f => f).length;
  if (eduData.length > 0) filled++;
  const pct = Math.round((filled / total) * 100);
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = pct + '%';
}

// ═══════════════════════════════════════════
// BUILD RESUME HTML
// ═══════════════════════════════════════════
function buildResumeHTML() {
  let html = '';
  const name = getVal('applicantName');
  const father = getVal('fatherName');
  const mother = getVal('motherName');
  const mobile = getVal('mobile');
  const email = getVal('email');
  const dob = getVal('dob');
  const gender = getVal('gender');
  const languages = getVal('languages');
  const address = getVal('address');
  const category = getVal('category');
  const marital = getVal('maritalStatus');
  const experience = getVal('experience');
  const objective = getVal('objective');

  // ─── RESUME TITLE ───
  html += '<div class="r-resume-title">RESUME</div>';

  // ─── HEADER ───
  html += '<div class="r-header">';
  html += '<div class="r-header__info">';
  html += `<div class="r-header__name">${name || 'Your Name'}</div>`;
  if (mobile) html += `<div class="r-header__line">Mobile: ${mobile}</div>`;
  if (email) html += `<div class="r-header__line">Email: ${email}</div>`;
  html += '</div>';
  if (photoDataURL) {
    html += `<div class="r-header__photo"><img src="${photoDataURL}" alt="Photo" /></div>`;
  }
  html += '</div>';

  // ─── OBJECTIVE ───
  if (objective) {
    html += '<div class="r-section">';
    html += '<div class="r-section__title">Objective</div>';
    html += `<div class="r-section__body"><p class="r-objective">${objective}</p></div>`;
    html += '</div>';
  }

  // ─── PERSONAL DETAILS ───
  html += '<div class="r-section">';
  html += '<div class="r-section__title">Personal Details</div>';
  html += '<div class="r-section__body"><table class="r-detail-table">';
  if (father) html += `<tr><td>Father's Name</td><td>${father}</td></tr>`;
  if (mother) html += `<tr><td>Mother's Name</td><td>${mother}</td></tr>`;
  if (dob) html += `<tr><td>Date of Birth</td><td>${formatDate(dob)}</td></tr>`;
  if (gender) html += `<tr><td>Gender</td><td>${gender}</td></tr>`;
  if (marital) html += `<tr><td>Marital Status</td><td>${marital}</td></tr>`;
  if (category) html += `<tr><td>Category</td><td>${category}</td></tr>`;
  if (languages) html += `<tr><td>Known Languages</td><td>${languages}</td></tr>`;
  if (address) html += `<tr><td>Address</td><td>${address}</td></tr>`;
  html += '</table></div></div>';

  // ─── EDUCATION ───
  const eduEntries = getEducationData();
  if (eduEntries.length > 0) {
    html += '<div class="r-section">';
    html += '<div class="r-section__title">Educational Qualifications</div>';
    html += '<div class="r-section__body">';
    html += '<table class="r-table"><thead><tr><th>Exam</th><th>Board / University</th><th>Year</th><th>Percentage</th><th>Division</th></tr></thead><tbody>';
    eduEntries.forEach(e => {
      html += `<tr><td>${e.name}</td><td>${e.board}</td><td>${e.year}</td><td>${e.pct}</td><td>${e.div}</td></tr>`;
    });
    html += '</tbody></table></div></div>';
  }

  // ─── OTHER QUALIFICATIONS ───
  const otherEntries = getOtherData();
  if (otherEntries.length > 0) {
    html += '<div class="r-section">';
    html += '<div class="r-section__title">Other Qualifications</div>';
    html += '<div class="r-section__body">';
    html += '<table class="r-table"><thead><tr><th>Qualification</th><th>Institute</th><th>Year</th><th>Score</th><th>Duration</th></tr></thead><tbody>';
    otherEntries.forEach(e => {
      html += `<tr><td>${e.name}</td><td>${e.inst}</td><td>${e.year}</td><td>${e.score}</td><td>${e.dur}</td></tr>`;
    });
    html += '</tbody></table></div></div>';
  }

  // ─── EXPERIENCE ───
  if (experience) {
    html += '<div class="r-section">';
    html += '<div class="r-section__title">Experience</div>';
    html += `<div class="r-section__body"><div class="r-exp-item__text">${experience}</div></div>`;
    html += '</div>';
  }

  // ─── DECLARATION ───
  const place = getVal('declarationPlace');
  html += '<div class="r-declaration">';
  html += '<p>I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.</p>';
  html += '<div class="r-declaration__meta">';
  html += `<div>Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}<br/>Place: ${place || '_______________'}</div>`;
  html += `<div>(${name || 'Signature'})</div>`;
  html += '</div></div>';

  return html;
}

// ═══════════════════════════════════════════
// INTELLIGENT LAYOUT ENGINE
// ═══════════════════════════════════════════
function applyLayoutEngine() {
  const page = document.getElementById('resume-page');
  const content = document.getElementById('resume-content');
  if (!page || !content) return;

  const experienced = isExperiencedMode();
  // A4 height ~1122px at 96dpi, usable ~1077 after borders
  const usableHeight = 1077;

  if (!experienced) {
    // ─── FRESHER: STRICT 1-PAGE ───
    page.style.minHeight = '297mm';
    page.style.height = '297mm';
    page.style.overflow = 'hidden';

    // Reset first to measure true height
    resetContentStyles(content);
    const contentHeight = content.scrollHeight;

    if (contentHeight > usableHeight) {
      const ratio = usableHeight / contentHeight;
      let fontSize, lineHeight, pad;

      if (ratio < 0.65) {
        fontSize = 8; lineHeight = 1.18; pad = '4mm 5mm';
      } else if (ratio < 0.75) {
        fontSize = 8.5; lineHeight = 1.22; pad = '4.5mm 5.5mm';
      } else if (ratio < 0.85) {
        fontSize = 9; lineHeight = 1.28; pad = '5mm 6mm';
      } else if (ratio < 0.95) {
        fontSize = 9.5; lineHeight = 1.35; pad = '5.5mm 6.5mm';
      } else {
        fontSize = 10; lineHeight = 1.4; pad = '5.5mm 6.5mm';
      }

      content.style.fontSize = fontSize + 'pt';
      content.style.lineHeight = lineHeight;
      content.style.padding = pad;

      content.querySelectorAll('.r-section').forEach(s => {
        s.style.marginBottom = Math.max(2, Math.round(6 * ratio)) + 'px';
      });
      content.querySelectorAll('.r-section__title').forEach(t => {
        t.style.fontSize = Math.max(fontSize + 0.5, 8.5) + 'pt';
        t.style.padding = '2px 8px';
      });
      content.querySelectorAll('.r-header__name').forEach(n => {
        n.style.fontSize = Math.max(fontSize + 4, 12) + 'pt';
      });
      content.querySelectorAll('.r-table, .r-detail-table').forEach(t => {
        t.style.fontSize = Math.max(fontSize - 1.5, 7) + 'pt';
      });
    }
  } else {
    // ─── EXPERIENCED: MULTI-PAGE ───
    page.style.minHeight = '297mm';
    page.style.height = 'auto';
    page.style.overflow = 'visible';
    resetContentStyles(content);
  }
}

function resetContentStyles(content) {
  content.style.fontSize = '';
  content.style.lineHeight = '';
  content.style.padding = '';
  content.querySelectorAll('.r-section').forEach(s => { s.style.marginBottom = ''; });
  content.querySelectorAll('.r-section__title').forEach(t => { t.style.fontSize = ''; t.style.padding = ''; });
  content.querySelectorAll('.r-header__name').forEach(n => { n.style.fontSize = ''; });
  content.querySelectorAll('.r-table, .r-detail-table').forEach(t => { t.style.fontSize = ''; });
}

// ═══════════════════════════════════════════
// ZOOM CONTROLS
// ═══════════════════════════════════════════
function zoomIn() {
  zoomLevel = Math.min(zoomLevel + 10, 150);
  applyZoom();
}
function zoomOut() {
  zoomLevel = Math.max(zoomLevel - 10, 30);
  applyZoom();
}
function zoomFit() {
  const wrapper = document.getElementById('preview-scroll');
  if (!wrapper) return;
  const ww = wrapper.clientWidth - 32;
  const pw = 793.7; // 210mm in px
  zoomLevel = Math.min(Math.round((ww / pw) * 100), 100);
  applyZoom();
}
function applyZoom() {
  const page = document.getElementById('resume-page');
  if (page) page.style.transform = `scale(${zoomLevel / 100})`;
  const label = document.getElementById('zoom-level');
  if (label) label.textContent = zoomLevel + '%';
}

// ═══════════════════════════════════════════
// MOBILE PREVIEW TOGGLE
// ═══════════════════════════════════════════
function toggleMobilePreview() {
  const panel = document.getElementById('preview-panel');
  panel.classList.toggle('mobile-visible');
  if (panel.classList.contains('mobile-visible')) {
    updatePreview();
    setTimeout(zoomFit, 100);
  }
}

// ═══════════════════════════════════════════
// PDF DOWNLOAD
// ═══════════════════════════════════════════
function downloadPDF() {
  const name = getVal('applicantName');
  const father = getVal('fatherName');
  const email = getVal('email');
  const mobile = getVal('mobile');

  if (!name) { showToast('⚠️ Please enter Applicant\'s Name'); return; }
  if (!father) { showToast('⚠️ Please enter Father\'s Name'); return; }
  if (!email) { showToast('⚠️ Please enter Email Address'); return; }
  if (!mobile) { showToast('⚠️ Please enter Mobile Number'); return; }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { showToast('⚠️ Please enter a valid email'); return; }
  if (!/^[0-9]{10}$/.test(mobile)) { showToast('⚠️ Enter a valid 10-digit mobile'); return; }

  const eduEntries = getEducationData();
  if (eduEntries.length === 0) { showToast('⚠️ Please add at least one education entry'); return; }

  const output = document.getElementById('resume-output');
  const resumeHTML = buildResumeHTML();
  const experienced = isExperiencedMode();

  if (!experienced) {
    output.innerHTML = `
      <div class="resume-print-page" style="height:297mm;overflow:hidden;">
        <div class="resume-print-border"></div>
        <div class="resume-print-content" id="print-content-inner"
             style="font-family:'Inter',Arial,sans-serif;font-size:10.5pt;color:#1f2937;line-height:1.45;padding:6mm 7mm;">
          ${resumeHTML}
        </div>
      </div>`;
  } else {
    output.innerHTML = `
      <div class="resume-print-page" style="min-height:297mm;height:auto;">
        <div class="resume-print-border" style="position:relative;top:0;left:0;right:0;bottom:0;border:2.5px solid #b91c1c;min-height:calc(297mm - 12mm);margin:6mm;padding:6mm 7mm;">
          ${resumeHTML}
        </div>
      </div>`;
  }

  output.style.display = 'block';

  if (!experienced) {
    const inner = document.getElementById('print-content-inner');
    if (inner) applyPrintCompression(inner);
  }

  showToast('📥 Opening Print dialog... Save as PDF');
  setTimeout(() => {
    window.print();
    setTimeout(() => { output.style.display = 'none'; }, 500);
  }, 400);
}

function applyPrintCompression(container) {
  const usableHeight = 1077;
  const contentHeight = container.scrollHeight;
  if (contentHeight <= usableHeight) return;

  const ratio = usableHeight / contentHeight;
  let fontSize = 10.5, lineHeight = 1.45;

  if (ratio < 0.65) { fontSize = 8; lineHeight = 1.18; }
  else if (ratio < 0.75) { fontSize = 8.5; lineHeight = 1.22; }
  else if (ratio < 0.85) { fontSize = 9; lineHeight = 1.28; }
  else if (ratio < 0.95) { fontSize = 9.5; lineHeight = 1.35; }
  else { fontSize = 10; lineHeight = 1.4; }

  container.style.fontSize = fontSize + 'pt';
  container.style.lineHeight = lineHeight;
  container.style.padding = (ratio < 0.8 ? '4mm 5mm' : '5mm 6mm');

  container.querySelectorAll('.r-section').forEach(s => {
    s.style.marginBottom = Math.max(2, Math.round(6 * ratio)) + 'px';
  });
  container.querySelectorAll('.r-section__title').forEach(t => {
    t.style.fontSize = Math.max(fontSize + 0.5, 8.5) + 'pt';
    t.style.padding = '2px 8px';
  });
  container.querySelectorAll('.r-header__name').forEach(n => {
    n.style.fontSize = Math.max(fontSize + 4, 12) + 'pt';
  });
  container.querySelectorAll('.r-table, .r-detail-table').forEach(t => {
    t.style.fontSize = Math.max(fontSize - 1.5, 7) + 'pt';
  });
}

// ═══════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}
