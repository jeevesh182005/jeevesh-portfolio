/* =============================================
   S JEEVESH PORTFOLIO — script.js
   =============================================
   
   FORM SETUP — Google Form Integration
   =============================================
   To connect your Google Form, follow these steps:
   
   1. Create a Google Form at https://forms.google.com
      Fields to create: Name, Phone, Email, Service, Message
   
   2. Open the form → click the 3-dot menu → "Get pre-filled link"
      Fill in sample values, click "Get link", and look at the URL.
      Extract each field's "entry.XXXXXXXXX" param name.
   
   3. Replace the GOOGLE_FORM_ACTION_URL below with your Form's
      action URL (found in: form settings → get pre-filled link URL,
      but replace /viewform with /formResponse)
   
   4. Replace each entry.XXXXXXXXX with your actual field IDs.
   
   Example action URL:
   https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse
   ============================================= */

// =============================================
// CONFIGURATION — UPDATE THESE VALUES  
// =============================================
const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScYAy7La6ZnsOhM5QyLEeQhSzWgyjqsIc2o2x95bQ-hAAHdqw/viewform';

const FORM_FIELD_IDS = {
  name:    'entry.2011101782',
  phone:   'entry.1555154369',
  email:   'entry.514067591',
  company: 'entry.2142884921',
  service: 'entry.611607158',
  budget:  'entry.2060869084',
  deadline:'entry.1626583408',
  message: 'entry.1504974495',
};
const EMAILJS_PUBLIC_KEY  = '3BlKBJO4m1QjtqzSl';
const EMAILJS_SERVICE_ID  = 'service_m8rmz3t';
const EMAILJS_TEMPLATE_ID = 'template_3km6qrn';

(function(){
  emailjs.init("3BlKBJO4m1QjtqzSl");
})();


// =============================================
// CUSTOM CURSOR
// =============================================
const cur  = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
  setTimeout(() => {
    ring.style.left = e.clientX + 'px';
    ring.style.top  = e.clientY + 'px';
  }, 80);
});


// =============================================
// MOBILE MENU
// =============================================
const mobBtn     = document.getElementById('mob-menu-btn');
const mobOverlay = document.getElementById('mob-overlay');

function closeMobMenu() {
  mobBtn.classList.remove('open');
  mobOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

mobBtn.addEventListener('click', () => {
  const isOpen = mobOverlay.classList.contains('open');
  if (isOpen) {
    closeMobMenu();
  } else {
    mobBtn.classList.add('open');
    mobOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});


// =============================================
// SCROLL REVEAL
// =============================================
const revs   = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revs.forEach(r => revObs.observe(r));


// =============================================
// PERFORMANCE BARS — animate on scroll
// =============================================
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.perf-bar-fill').forEach(b => {
        b.style.width = b.dataset.width + '%';
      });
      e.target.querySelectorAll('.skill-fill').forEach(b => {
        b.style.width = b.dataset.width + '%';
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('#results, #skills-sec').forEach(s => barObs.observe(s));


// =============================================
// FAQ TOGGLE
// =============================================
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}


// =============================================
// COOKIES
// =============================================
function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  document.getElementById('cookie-banner').classList.remove('show');
}
function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  document.getElementById('cookie-banner').classList.remove('show');
}
window.addEventListener('load', () => {
  if (!localStorage.getItem('cookieConsent')) {
    setTimeout(() => document.getElementById('cookie-banner').classList.add('show'), 1800);
  }
});


// =============================================
// NAV ACTIVE HIGHLIGHT
// =============================================
const navAs    = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--white)' : '';
  });
}, { passive: true });


// =============================================
// FORM VALIDATION & SUBMISSION
// =============================================

/**
 * Validates a 10-digit Indian mobile number.
 * Accepts formats: 9876543210 / +919876543210 / 09876543210
 */
function validatePhone(phone) {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Must be exactly 10 digits, starting with 6-9
  const tenDigit  = /^[6-9]\d{9}$/.test(cleaned);
  // With country code: +91 or 0 prefix
  const withCode  = /^(\+91|91|0)[6-9]\d{9}$/.test(cleaned);
  return tenDigit || withCode;
}

/**
 * Validates email — must be a real-format email.
 * Also warns if it's not a Gmail address (soft check, not hard block).
 */
function validateEmail(email) {
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return basicEmailRegex.test(email.trim());
}

function isGmail(email) {
  return email.trim().toLowerCase().endsWith('@gmail.com');
}

function setError(fieldId, errId, message) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field)  field.classList.add('error');
  if (err)    err.textContent = message;
}

function clearError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err   = document.getElementById(errId);
  if (field)  field.classList.remove('error');
  if (err)    err.textContent = '';
}

function showToast(type, message) {
  const toast = document.getElementById('form-toast');
  toast.className = 'form-toast ' + type;
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 6000);
}

// Live validation on blur
document.getElementById('fphone').addEventListener('blur', function() {
  if (this.value && !validatePhone(this.value)) {
    setError('fphone', 'fphone-err', '⚠ Enter a valid 10-digit Indian mobile number');
  } else {
    clearError('fphone', 'fphone-err');
  }
});

document.getElementById('femail').addEventListener('blur', function() {
  const val = this.value.trim();
  if (!val) return;
  if (!validateEmail(val)) {
    setError('femail', 'femail-err', '⚠ Enter a valid email address');
  } else if (!isGmail(val)) {
    clearError('femail', 'femail-err');
    // Soft warning — not blocking, just informative
    document.getElementById('femail-err').textContent = 'ℹ Tip: Gmail addresses work best for notifications';
    document.getElementById('femail-err').style.color = '#C8FF00';
  } else {
    clearError('femail', 'femail-err');
    document.getElementById('femail-err').style.color = '';
  }
});

document.getElementById('fname').addEventListener('blur', function() {
  if (!this.value.trim()) {
    setError('fname', 'fname-err', '⚠ Please enter your name');
  } else {
    clearError('fname', 'fname-err');
  }
});


/**
 * Main form submission handler.
 * Validates all fields, then submits to Google Forms via a hidden iframe
 * (no page reload, no CORS issues).
 */
function handleFormSubmit() {
  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const service = document.getElementById('fservice').value;
  const message = document.getElementById('fmessage').value.trim();
  const btn     = document.getElementById('f-submit-btn');

  // Reset errors
  ['fname','fphone','femail'].forEach(id => {
    clearError(id, id + '-err');
    document.getElementById(id + '-err').style.color = '';
  });

  let hasError = false;

  // Name validation
  if (!name) {
    setError('fname', 'fname-err', '⚠ Please enter your name');
    hasError = true;
  }

  // Phone validation
  if (!phone) {
    setError('fphone', 'fphone-err', '⚠ Please enter your phone number');
    hasError = true;
  } else if (!validatePhone(phone)) {
    setError('fphone', 'fphone-err', '⚠ Enter a valid 10-digit Indian mobile number (e.g. 9876543210)');
    hasError = true;
  }

  // Email validation
  if (!email) {
    setError('femail', 'femail-err', '⚠ Please enter your email address');
    hasError = true;
  } else if (!validateEmail(email)) {
    setError('femail', 'femail-err', '⚠ Enter a valid email address (e.g. yourname@gmail.com)');
    hasError = true;
  }

  if (hasError) {
    showToast('error-toast', '⚠ Please fix the errors above before submitting.');
    return;
  }

  // Disable button while submitting
  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Submit to Google Forms via hidden iframe (avoids CORS issues)
  // Initialize EmailJS (add once at top ideally)
// emailjs.init(EMAILJS_PUBLIC_KEY);

// Send email
btn.disabled = true;
btn.textContent = 'Sending…';

emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
  name,
  phone,
  email,
  service,
  message
})
.then(() => {
  // SUCCESS
  btn.disabled = false;
  btn.textContent = 'Send Message →';

  showToast('success', '✅ Message sent successfully!');

  // clear form
  document.getElementById('fname').value = '';
  document.getElementById('fphone').value = '';
  document.getElementById('femail').value = '';
  document.getElementById('fservice').value = '';
  document.getElementById('fmessage').value = '';
})
.catch((error) => {
  console.error(error);

  btn.disabled = false;
  btn.textContent = 'Send Message →';

  showToast('error-toast', '❌ Email failed. Check console.');
});

// Optional: still send to Google Form
submitToGoogleForm({ name, phone, email, service, message });
}


function submitToGoogleForm(data) {
  const btn = document.getElementById('f-submit-btn');

  // Build the form data
const params = new URLSearchParams({
  [FORM_FIELD_IDS.name]:    data.name,
  [FORM_FIELD_IDS.phone]:   data.phone,
  [FORM_FIELD_IDS.email]:   data.email,
  [FORM_FIELD_IDS.company]: data.company || '',
  [FORM_FIELD_IDS.service]: data.service,
  [FORM_FIELD_IDS.budget]:  data.budget || '',
  [FORM_FIELD_IDS.deadline]:data.deadline || '',
  [FORM_FIELD_IDS.message]: data.message,
});

  // Use a hidden iframe to submit (prevents page reload & avoids CORS errors)
  let iframe = document.getElementById('gform-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id   = 'gform-iframe';
    iframe.name = 'gform-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  const form = document.createElement('form');
  form.method  = 'POST';
  form.action  = GOOGLE_FORM_ACTION_URL;
  form.target  = 'gform-iframe';

  for (const [key, value] of params.entries()) {
    const input = document.createElement('input');
    input.type  = 'hidden';
    input.name  = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  // Since Google Forms doesn't send a response we can read (CORS),
  // we assume success after a short delay.
  setTimeout(() => {
    btn.disabled    = false;
    btn.textContent = 'Send Message →';

    // Clear form
    document.getElementById('fname').value    = '';
    document.getElementById('fphone').value   = '';
    document.getElementById('femail').value   = '';
    document.getElementById('fservice').value = '';
    document.getElementById('fmessage').value = '';

    showToast('success', '✅ Message sent! I\'ll reach out within 24 hours. 🚀');
  }, 1500);
}
