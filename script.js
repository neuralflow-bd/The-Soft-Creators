/**
 * Softcreators Interactive Engine
 * 100% Theme Harmony | Exact Mathematics | Seamless UX
 */

// 1. Plan Rates and Specifications
var SC_PLANS = {
  startup: {
    name: "WP Startup NVMe Cloud",
    specs: "20 GB Pure NVMe Storage · 1 vCore CPU · 2 GB RAM · Python, Node.js & Rust Supported",
    rates: {
      6: 499,
      11: 499,
      12: 449,
      24: 399,
      26: 389,
      48: 299
    }
  },
  standard: {
    name: "WP Growth NVMe Cloud",
    specs: "40 GB Pure NVMe Storage · 2 vCore CPU · 4 GB RAM · Python, Node.js & Rust Supported",
    rates: {
      6: 799,
      11: 799,
      12: 699,
      24: 599,
      26: 579,
      48: 449
    }
  },
  pro: {
    name: "WP Enterprise NVMe Cloud",
    specs: "100 GB Pure NVMe Storage · 4 vCore CPU · 8 GB RAM · Python, Node.js & Rust Supported",
    rates: {
      6: 1299,
      11: 1299,
      12: 1199,
      24: 999,
      26: 969,
      48: 799
    }
  }
};

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

// 2. Open Checkout Modal
window.openSoftcreatorsCheckout = function (planKey, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (planKey && SC_PLANS[planKey]) {
    currentSelectedPlanKey = planKey;
  } else {
    currentSelectedPlanKey = 'startup';
  }

  var plan = SC_PLANS[currentSelectedPlanKey];
  var modal = document.getElementById('orderModal');
  var formStep = document.getElementById('checkoutStepForm');
  var invStep = document.getElementById('checkoutStepInvoice');

  if (!modal) return;

  // Reset steps
  if (formStep) formStep.style.display = 'grid';
  if (invStep) invStep.style.display = 'none';

  // Set titles
  var nameEl = document.getElementById('modalPlanName');
  if (nameEl) nameEl.textContent = plan.name;

  var summaryPlanLabel = document.getElementById('summaryPlanLabel');
  if (summaryPlanLabel) summaryPlanLabel.textContent = plan.name;

  // Set duration dropdown to 11 months by default
  var durationSelect = document.getElementById('modalDurationSelect');
  if (durationSelect) {
    durationSelect.value = String(currentSelectedMonths);
  }

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
  var rate = plan.rates[currentSelectedMonths] || 499;
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

  // Bonus domain badge for 12+ months
  var bonusBadge = document.getElementById('domainBonusBadge');
  if (bonusBadge) {
    bonusBadge.style.display = currentSelectedMonths >= 12 ? 'block' : 'none';
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
  var rate = plan.rates[currentSelectedMonths] || 499;
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
  if (invDomainRow) invDomainRow.textContent = 'Domain: ' + domain;

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
  // Bind all CTA buttons to open modal
  var buyButtons = document.querySelectorAll('.hp-buy, .sf-buy, a[href="#plans"], a[href="#order"], a[href="#hosting-pricing-R16d"]');
  buyButtons.forEach(function (btn) {
    // Only bind if it's meant to trigger checkout
    if (btn.classList.contains('hp-buy') || btn.classList.contains('sf-buy') || btn.getAttribute('href') === '#order') {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openSoftcreatorsCheckout('startup', e);
      });
    }
  });

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
