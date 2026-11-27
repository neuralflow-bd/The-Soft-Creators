/**
 * Softcreators Interactive Engine
 * 100% Theme Harmony | Exact Mathematics | Seamless UX across ALL Plans
 */

// Professional SVG Icons
var svg_lightning = '<svg class="sc-svg-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
var svg_check = '<svg class="sc-svg-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
var svg_server = '<svg class="sc-svg-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>';

// 1. Plan Rates and Specifications for all 3 plans
var SC_PLANS = {
  solo: {
    key: 'solo',
    name: "WP Solo NVMe Cloud",
    specsHtml: '<span class="sc-spec-item">' + svg_lightning + ' 5 GB NVMe</span><span class="sc-spec-dot">•</span><span class="sc-spec-item">' + svg_server + ' 1 vCore CPU</span><span class="sc-spec-dot">•</span><span class="sc-spec-item">1 GB RAM</span><span class="sc-spec-dot">•</span><span class="sc-badge-spec">' + svg_check + ' Python, Node.js &amp; Rust Supported</span>',
    rates: {
      6: 249,
      11: 229,
      12: 229,
      24: 199,
      26: 189,
      48: 149
    }
  },
  freelancer: {
    key: 'freelancer',
    name: "WP Freelancer NVMe Cloud",
    specsHtml: '<span class="sc-spec-item">' + svg_lightning + ' 10 GB NVMe</span><span class="sc-spec-dot">•</span><span class="sc-spec-item">' + svg_server + ' 1 vCore CPU</span><span class="sc-spec-dot">•</span><span class="sc-spec-item">2 GB RAM</span><span class="sc-spec-dot">•</span><span class="sc-badge-spec">' + svg_check + ' Python, Node.js &amp; Rust Supported</span>',
    rates: {
      6: 379,
      11: 349,
      12: 349,
      24: 299,
      26: 279,
      48: 229
    }
  },
  startup: {
    key: 'startup',
    name: "WP Startup NVMe Cloud",
    specsHtml: '<span class="sc-spec-item">' + svg_lightning + ' 20 GB NVMe</span><span class="sc-spec-dot">•</span><span class="sc-spec-item">' + svg_server + ' 1 vCore CPU</span><span class="sc-spec-dot">•</span><span class="sc-spec-item">2 GB RAM</span><span class="sc-spec-dot">•</span><span class="sc-badge-spec">' + svg_check + ' Python, Node.js &amp; Rust Supported</span>',
    rates: {
      6: 499,
      11: 459,
      12: 459,
      24: 399,
      26: 369,
      48: 319
    }
  }
};
// Aliases
SC_PLANS.standard = SC_PLANS.freelancer;
SC_PLANS.pro = SC_PLANS.startup;

var currentSelectedPlanKey = 'startup';
var currentSelectedMonths = 11;
var currentPaymentMethod = 'bKash';

// Format BDT with commas
function scFormatBDT(amount) {
  return '৳' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Render dynamic duration options matching selected plan's exact rates
function renderModalDurationOptions(plan) {
  var select = document.getElementById('modalDurationSelect');
  if (!select) return;
  var r = plan.rates;
  var prevVal = String(currentSelectedMonths || 11);
  select.innerHTML = 
    '<option value="6">6 Months (Minimum Commitment) — ৳' + r[6] + ' /month</option>' +
    '<option value="11">11 Months (Special Promotion) — ৳' + r[11] + ' /month</option>' +
    '<option value="12">12 Months (1 Year) — ৳' + r[12] + ' /month</option>' +
    '<option value="24">24 Months (2 Years) — ৳' + r[24] + ' /month</option>' +
    '<option value="26">26 Months (Extended Plan) — ৳' + r[26] + ' /month</option>' +
    '<option value="48">48 Months (4 Years + Free .COM Domain) — ৳' + r[48] + ' /month</option>';
  select.value = prevVal;
}

// 2. Open Checkout Modal
window.openSoftcreatorsCheckout = function (planKey, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Handle if planKey is DOM element or string
  if (typeof planKey === 'object' && planKey !== null && planKey.getAttribute) {
    var aria = planKey.getAttribute('aria-label') || '';
    if (aria.indexOf('Solo') !== -1) planKey = 'solo';
    else if (aria.indexOf('Freelancer') !== -1) planKey = 'freelancer';
    else planKey = 'startup';
  } else if (!planKey || !SC_PLANS[planKey]) {
    planKey = 'startup';
  }

  currentSelectedPlanKey = planKey;
  var plan = SC_PLANS[currentSelectedPlanKey] || SC_PLANS.startup;
  var modal = document.getElementById('orderModal');
  var formStep = document.getElementById('checkoutStepForm');
  var invStep = document.getElementById('checkoutStepInvoice');

  if (!modal) return;

  // Reset view
  if (formStep) formStep.style.display = 'grid';
  if (invStep) invStep.style.display = 'none';

  // Set plan titles & specs
  var nameEl = document.getElementById('modalPlanName');
  if (nameEl) nameEl.textContent = plan.name;

  var summaryPlanLabel = document.getElementById('summaryPlanLabel');
  if (summaryPlanLabel) summaryPlanLabel.textContent = plan.name;

  var specsEl = document.getElementById('modalPlanSpecs');
  if (specsEl) specsEl.innerHTML = plan.specsHtml;

  // Render options for this plan
  renderModalDurationOptions(plan);

  // Update calculations
  updateModalCalculations();

  // Show modal
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

// 3. Close Checkout Modal
window.closeSoftcreatorsModal = function () {
  var modal = document.getElementById('orderModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

// 4. Duration change handler
window.onModalDurationChange = function () {
  var durationSelect = document.getElementById('modalDurationSelect');
  if (durationSelect) {
    currentSelectedMonths = parseInt(durationSelect.value, 10) || 11;
    updateModalCalculations();
  }
};

// 5. Update Pricing Calculations
function updateModalCalculations() {
  var plan = SC_PLANS[currentSelectedPlanKey] || SC_PLANS.startup;
  var rate = plan.rates[currentSelectedMonths] || 459;
  var subtotal = rate * currentSelectedMonths;
  var vat = Math.round((subtotal * 0.05) * 100) / 100;
  var total = Math.round((subtotal + vat) * 100) / 100;

  // Update DOM elements
  var rateEl = document.getElementById('modalRateDisplay');
  if (rateEl) rateEl.textContent = '৳' + rate + ' /mo';

  var monthsEl = document.getElementById('modalMonthsLabel');
  if (monthsEl) monthsEl.textContent = currentSelectedMonths + ' Months';

  var subtotalEl = document.getElementById('modalSubtotalVal');
  if (subtotalEl) subtotalEl.textContent = scFormatBDT(subtotal);

  var vatEl = document.getElementById('modalVatVal');
  if (vatEl) vatEl.textContent = scFormatBDT(vat);

  var totalEl = document.getElementById('modalTotalVal');
  if (totalEl) totalEl.textContent = scFormatBDT(total);

  // Bonus domain badge ONLY for 48 months subscription across all plans
  var bonusBadge = document.getElementById('domainBonusBadge');
  if (bonusBadge) {
    bonusBadge.style.display = (currentSelectedMonths === 48) ? 'block' : 'none';
  }
}

// 6. Payment Method Selector (bKash vs Nagad)
window.selectPaymentMethod = function (method) {
  currentPaymentMethod = method;
  var tabBkash = document.getElementById('tabBkash');
  var tabNagad = document.getElementById('tabNagad');
  var trxMethodName = document.getElementById('trxMethodName');
  var trxInput = document.getElementById('trxIdInput');

  if (method === 'bKash') {
    if (tabBkash) tabBkash.classList.add('active');
    if (tabNagad) tabNagad.classList.remove('active');
    if (trxMethodName) trxMethodName.textContent = 'bKash (Payment)';
    if (trxInput) trxInput.placeholder = 'Enter bKash TrxID (e.g. 9J47K2L8)';
  } else {
    if (tabBkash) tabBkash.classList.remove('active');
    if (tabNagad) tabNagad.classList.add('active');
    if (trxMethodName) trxMethodName.textContent = 'Nagad (Send Money)';
    if (trxInput) trxInput.placeholder = 'Enter Nagad TrxID (e.g. 7M890123)';
  }
};

// 7. One-Click Copy Number
window.copyPaymentNumber = function (text, btn, ev) {
  if (ev) ev.stopPropagation();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function () {
      showCopied(btn);
    }).catch(function () {
      fallbackCopy(text, btn);
    });
  } else {
    fallbackCopy(text, btn);
  }
};

function fallbackCopy(text, btn) {
  var temp = document.createElement('input');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  try {
    document.execCommand('copy');
    showCopied(btn);
  } catch (err) {
    console.error('Copy failed', err);
  }
  document.body.removeChild(temp);
}

function showCopied(btn) {
  if (!btn) return;
  var originalHtml = btn.innerHTML;
  btn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:3px;"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied';
  btn.style.background = '#fc0';
  btn.style.color = '#000';
  setTimeout(function () {
    btn.innerHTML = originalHtml;
    btn.style.background = '';
    btn.style.color = '';
  }, 2000);
}

// 8. Submit Order & Show Executive Invoice
window.submitSoftcreatorsOrder = function () {
  var name = (document.getElementById('customerName')?.value || '').trim();
  var phone = (document.getElementById('customerPhone')?.value || '').trim();
  var email = (document.getElementById('customerEmail')?.value || '').trim();
  var domain = (document.getElementById('modalDomainInput')?.value || '').trim() || 'mysite.com';
  var trxId = (document.getElementById('trxIdInput')?.value || '').trim();

  // Basic Validation
  if (!name) {
    alert('Please enter your Full Name.');
    document.getElementById('customerName')?.focus();
    return;
  }
  if (!phone) {
    alert('Please enter your Mobile Number for server provisioning.');
    document.getElementById('customerPhone')?.focus();
    return;
  }
  if (!email || email.indexOf('@') === -1) {
    alert('Please enter a valid Email Address for login credential delivery.');
    document.getElementById('customerEmail')?.focus();
    return;
  }
  if (!trxId) {
    var methodLabel = currentPaymentMethod === 'bKash' ? 'bKash Payment' : 'Nagad Send Money';
    alert('Please make the payment via ' + methodLabel + ' to 01795870131 and enter the Transaction ID (TrxID).');
    document.getElementById('trxIdInput')?.focus();
    return;
  }

  // Populate Invoice
  var plan = SC_PLANS[currentSelectedPlanKey] || SC_PLANS.startup;
  var rate = plan.rates[currentSelectedMonths] || 459;
  var subtotal = rate * currentSelectedMonths;
  var vat = Math.round((subtotal * 0.05) * 100) / 100;
  var total = Math.round((subtotal + vat) * 100) / 100;

  var invNum = 'SC-INV-' + new Date().getFullYear() + '-' + Math.floor(10000 + Math.random() * 90000);
  var invDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  var invNumberText = document.getElementById('invNumberText');
  if (invNumberText) invNumberText.textContent = invNum;

  var invDateText = document.getElementById('invDateText');
  if (invDateText) invDateText.textContent = invDate;

  var invPlanText = document.getElementById('invPlanText');
  if (invPlanText) invPlanText.textContent = plan.name;

  var invDomainRow = document.getElementById('invDomainRow');
  if (invDomainRow) {
    if (currentSelectedMonths === 48) {
      invDomainRow.innerHTML = 'Domain: ' + domain + ' <strong style="color:#059669;margin-left:6px;">(Free 1-Yr .COM Included)</strong>';
    } else {
      invDomainRow.textContent = 'Domain: ' + domain;
    }
  }

  var invDurationText = document.getElementById('invDurationText');
  if (invDurationText) invDurationText.textContent = currentSelectedMonths + ' Months';

  var invRateText = document.getElementById('invRateText');
  if (invRateText) invRateText.textContent = '৳' + rate + ' /mo';

  var invSubtotalText = document.getElementById('invSubtotalText');
  if (invSubtotalText) invSubtotalText.textContent = scFormatBDT(subtotal);

  var invVatText = document.getElementById('invVatText');
  if (invVatText) invVatText.textContent = scFormatBDT(vat);

  var invTotalText = document.getElementById('invTotalText');
  if (invTotalText) invTotalText.textContent = scFormatBDT(total);

  var invClientName = document.getElementById('invClientName');
  if (invClientName) invClientName.textContent = name;

  var invClientPhone = document.getElementById('invClientPhone');
  if (invClientPhone) invClientPhone.textContent = phone;

  var invClientEmail = document.getElementById('invClientEmail');
  if (invClientEmail) invClientEmail.textContent = email;

  var invMethodText = document.getElementById('invMethodText');
  if (invMethodText) invMethodText.textContent = (currentPaymentMethod === 'bKash' ? 'bKash Payment' : 'Nagad Send Money') + ' (01795870131)';

  var invTrxIdText = document.getElementById('invTrxIdText');
  if (invTrxIdText) invTrxIdText.textContent = trxId;

  // Switch view to invoice
  var formStep = document.getElementById('checkoutStepForm');
  var invStep = document.getElementById('checkoutStepInvoice');
  if (formStep) formStep.style.display = 'none';
  if (invStep) invStep.style.display = 'block';

  // Scroll modal to top
  var container = document.querySelector('.sc-modal-container');
  if (container) container.scrollTop = 0;
};

// 9. Attach global listeners on DOM load
document.addEventListener('DOMContentLoaded', function () {
  // Sync page billing dropdown with pricing cards and modal
  var pageBilling = document.getElementById('hosting-pricing-R16d-billing');
  if (pageBilling) {
    pageBilling.addEventListener('change', function () {
      var val = parseInt(this.value, 10);
      if (val) {
        currentSelectedMonths = val;
        // Update all 3 cards on page
        ['solo', 'freelancer', 'startup'].forEach(function (pk) {
          var p = SC_PLANS[pk];
          var card = null;
          if (pk === 'solo') card = document.querySelector('.hp-card:nth-of-type(1)');
          else if (pk === 'freelancer') card = document.querySelector('.hp-card:nth-of-type(2)');
          else card = document.querySelector('.hp-featured');

          if (card && p) {
            var r = p.rates[val] || p.rates[11];
            var priceEl = card.querySelector('.c-price');
            if (priceEl) priceEl.textContent = '৳' + r;
            var totalEl = card.querySelector('.hp-total-val');
            var sub = r * val;
            if (totalEl) totalEl.textContent = '৳' + sub.toLocaleString('en-US');
            var vatEl = card.querySelector('.hp-vat');
            var vat = Math.round((sub * 0.05) * 100) / 100;
            if (vatEl) vatEl.textContent = '5% VAT (' + vat.toFixed(2) + ') included';
          }
        });
      }
    });
  }

  // Bind all CTA buttons to open modal with exact plan
  var soloBtn = document.querySelector('a[aria-label="Choose plan: WP Solo"]');
  if (soloBtn) {
    soloBtn.onclick = function (e) { openSoftcreatorsCheckout('solo', e); };
  }
  var freeBtn = document.querySelector('a[aria-label="Choose plan: WP Freelancer"]');
  if (freeBtn) {
    freeBtn.onclick = function (e) { openSoftcreatorsCheckout('freelancer', e); };
  }
  var startBtn = document.querySelector('a[aria-label="Choose plan: WP Startup"]');
  if (startBtn) {
    startBtn.onclick = function (e) { openSoftcreatorsCheckout('startup', e); };
  }

  // Header & hero buttons default to startup
  var heroBuy = document.querySelector('.sf-buy');
  if (heroBuy) {
    heroBuy.onclick = function (e) { openSoftcreatorsCheckout('startup', e); };
  }

  // Cookie banner auto-dismiss logic
  var ccBanner = document.querySelector('.cc-banner');
  if (ccBanner) {
    if (localStorage.getItem('sc_cookie_accepted') === 'true') {
      ccBanner.style.display = 'none';
    } else {
      ccBanner.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          localStorage.setItem('sc_cookie_accepted', 'true');
          ccBanner.style.display = 'none';
        });
      });
    }
  }

  // Keyboard shortcut Esc to close modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSoftcreatorsModal();
    }
  });
});
