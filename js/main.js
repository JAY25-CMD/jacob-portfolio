const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

/* THEME */
function updateThemeButton() {
  const isDark = root.getAttribute('data-theme') === 'dark';
  themeBtn.textContent = isDark ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton();
});
updateThemeButton();

/* MOBILE MENU */
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? '✕' : '☰';
}

menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.addEventListener('click', (e) => { if (e.target.tagName === 'A') setMenu(false); });

/* SKILL BARS: fill them when they scroll into view */
const skills = document.getElementById('skills');

if (skills && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        skills.classList.add('visible');   // CSS then animates the bars
        obs.disconnect();                  // run once, then stop watching
      }
    });
  }, { threshold: 0.3 });                  // fire when 30% of the panel is visible
  observer.observe(skills);
} else if (skills) {
  skills.classList.add('visible');         // old browsers: just show the bars
}

/* CONTACT FORM: send the message to Forminit, which emails it to you */
const form = document.getElementById('contact-form');
const note = document.getElementById('form-note');
const sendBtn = document.getElementById('send-btn');
const forminit = new Forminit();            // created by the script we loaded in the HTML

function showNote(text, type) {
  note.textContent = text;
  note.className = 'form-note ' + (type || '');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();                       // stay on the page

  // Spam trap: only bots fill the hidden field
  if (document.getElementById('hp').value) return;

  sendBtn.disabled = true;                  // stops double-clicks
  showNote('Sending...');

  // The SDK returns { data, redirectUrl, error } instead of throwing
  const { error } = await forminit.submit(form.dataset.formId, new FormData(form));

  if (error) {
    showNote(error.message + ' You can also email me at jacobinnocent416@gmail.com.', 'error');
  } else {
    form.reset();
    showNote('Thank you! Your message was sent. I will reply soon.', 'success');
  }
  sendBtn.disabled = false;
});

/* FOOTER YEAR: updates itself every year */
document.getElementById('year').textContent = new Date().getFullYear();

/* NAVBAR: highlight the link for the section currently on screen */
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((link) => {
        const isCurrent = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });   // a section counts as "current" when it crosses the middle of the screen

  sections.forEach((section) => navObserver.observe(section));
}