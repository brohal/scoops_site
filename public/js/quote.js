(function () {
  var PRICES = {
    weekly: { 1: 22, 2: 24, 3: 26, 4: 28 },
    biweekly: { 1: 35, 2: 40, 3: 45, 4: 50 },
    monthly: { 1: 60, 2: 65, 3: 70, 4: 75 },
    onetime: { 1: 100, 2: 100, 3: 100, 4: 100 }
  };
  var YARD_M = { small: 1, medium: 1.15, large: 1.35, xlarge: 1.55 };
  var INIT_FEE = 49;
  var NEEDS_INIT = { recent: false, "1-2weeks": false, "2-4weeks": true, "month+": true };
  var STEPS = [
    {
      key: "dogs",
      label: "Step 1 of 4",
      question: "How many dogs do you have?",
      options: [
        { value: 1, label: "1 Dog", desc: "" },
        { value: 2, label: "2 Dogs", desc: "" },
        { value: 3, label: "3 Dogs", desc: "" },
        { value: 4, label: "4+ Dogs", desc: "We'll customize" }
      ]
    },
    {
      key: "frequency",
      label: "Step 2 of 4",
      question: "How often would you like cleanup?",
      single: true,
      options: [
        { value: "weekly", label: "Once a Week", desc: "Most popular — keeps yard fresh" },
        { value: "biweekly", label: "Every Other Week", desc: "Good for smaller dogs" },
        { value: "monthly", label: "Once a Month", desc: "Light maintenance" },
        { value: "onetime", label: "One-Time Cleanup", desc: "$100/hr — spring clean or move-out" }
      ]
    },
    {
      key: "lastCleaned",
      label: "Step 3 of 4",
      question: "When was the yard last cleaned?",
      options: [
        { value: "recent", label: "This Week", desc: "Pretty clean" },
        { value: "1-2weeks", label: "1–2 Weeks", desc: "A bit behind" },
        { value: "2-4weeks", label: "2–4 Weeks", desc: "Needs attention" },
        { value: "month+", label: "1+ Month", desc: "Major catch-up" }
      ]
    },
    {
      key: "yardSize",
      label: "Step 4 of 4",
      question: "How large is the area to clean?",
      options: [
        { value: "small", label: "Small", desc: "Under 2,000 sq ft" },
        { value: "medium", label: "Medium", desc: "2,000–5,000 sq ft" },
        { value: "large", label: "Large", desc: "5,000–10,000 sq ft" },
        { value: "xlarge", label: "Extra Large", desc: "10,000+ sq ft" }
      ]
    }
  ];

  var LABELS = {
    frequency: { weekly: "Once a Week", biweekly: "Every Other Week", monthly: "Once a Month", onetime: "One-Time Cleanup" },
    yardSize: { small: "Small", medium: "Medium", large: "Large", xlarge: "Extra Large" },
    lastCleaned: { recent: "This week", "1-2weeks": "1–2 weeks ago", "2-4weeks": "2–4 weeks ago", "month+": "1+ month ago" }
  };

  var step = 0;
  var sel = {};
  var advanceTimer = 0;
  var body = document.querySelector("#quote-body");
  var bar = document.querySelector("#quote-bar");
  if (!body || !bar) return;

  function calc() {
    var dogs = Math.min(sel.dogs, 4);
    var oneTime = sel.frequency === "onetime";
    var base = PRICES[sel.frequency][dogs];
    var price = oneTime ? base : Math.round(base * YARD_M[sel.yardSize]);
    return { price: price, init: NEEDS_INIT[sel.lastCleaned] ? INIT_FEE : 0, oneTime: oneTime };
  }

  function render() {
    bar.style.width = (step < STEPS.length ? ((step + 1) / (STEPS.length + 1)) * 100 : 100) + "%";
    if (step < STEPS.length) {
      var current = STEPS[step];
      body.innerHTML =
        '<p class="step-label">' + current.label + "</p>" +
        '<p class="step-question">' + current.question + "</p>" +
        '<div class="option-grid' + (current.single ? " single" : "") + '">' +
        current.options.map(function (option) {
          var selected = sel[current.key] === option.value ? " is-selected" : "";
          return '<button type="button" class="option' + selected + '" data-key="' + current.key + '" data-value="' + option.value + '"><strong>' + option.label + "</strong>" +
            (option.desc ? "<span>" + option.desc + "</span>" : "") + "</button>";
        }).join("") +
        "</div>" +
        (step > 0 ? '<div class="quote-nav"><button type="button" class="linkish" data-back>← Back</button></div>' : "");
      return;
    }

    var result = calc();
    var dogs = sel.dogs >= 4 ? "4+ dogs" : sel.dogs + (sel.dogs === 1 ? " dog" : " dogs");
    body.innerHTML =
      '<p class="result-badge">Your estimated price</p>' +
      '<p class="result-price">$' + result.price + "</p>" +
      '<p class="result-period">' + (result.oneTime ? "per hour" : "per clean") + "</p>" +
      '<div class="summary">' +
        "<div><span>Dogs</span><strong>" + dogs + "</strong></div>" +
        "<div><span>Frequency</span><strong>" + LABELS.frequency[sel.frequency] + "</strong></div>" +
        "<div><span>Yard size</span><strong>" + LABELS.yardSize[sel.yardSize] + "</strong></div>" +
        "<div><span>Last cleaned</span><strong>" + LABELS.lastCleaned[sel.lastCleaned] + "</strong></div>" +
      "</div>" +
      (result.init ? '<p class="init-note"><strong>Initial cleanup fee: $' + result.init + "</strong><br>Since your yard needs a catch-up clean, a one-time $49 fee applies to the first visit only.</p>" : "") +
      (sel.dogs >= 4 ? '<p class="init-note">Yards with 4 or more dogs are customized. This estimate uses the 4-dog starting rate.</p>' : "") +
      '<form class="signup" id="signup">' +
        '<input name="name" placeholder="Your name" required autocomplete="name">' +
        '<input name="phone" type="tel" placeholder="Phone" required autocomplete="tel">' +
        '<input name="email" type="email" placeholder="Email" required autocomplete="email">' +
        '<input name="address" placeholder="Service address and city" required autocomplete="street-address">' +
        '<button class="btn" type="submit">Schedule my first cleanup</button>' +
      "</form>" +
      '<p class="form-status" id="signup-status" hidden></p>' +
      '<div class="quote-nav"><button type="button" class="linkish" data-restart>Start over</button></div>';
  }

  body.addEventListener("click", function (event) {
    var option = event.target.closest(".option");
    if (option) {
      var value = option.dataset.value;
      sel[option.dataset.key] = option.dataset.key === "dogs" ? Number(value) : value;
      render();
      window.clearTimeout(advanceTimer);
      advanceTimer = window.setTimeout(function () {
        step += 1;
        render();
      }, 180);
      return;
    }
    if (event.target.closest("[data-back]")) {
      step -= 1;
      render();
    }
    if (event.target.closest("[data-restart]")) {
      step = 0;
      sel = {};
      render();
    }
  });

  function leadPayload(data) {
    var result = calc();
    var dogs = sel.dogs >= 4 ? "4+ dogs" : String(sel.dogs);
    return {
      submittedAt: new Date().toISOString(),
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      address: data.get("address"),
      dogs: dogs,
      frequency: LABELS.frequency[sel.frequency],
      yardSize: LABELS.yardSize[sel.yardSize],
      lastCleaned: LABELS.lastCleaned[sel.lastCleaned],
      price: result.price,
      priceUnit: result.oneTime ? "per hour" : "per clean",
      initialFee: result.init
    };
  }

  function showStatus(message) {
    var form = document.querySelector("#signup");
    var status = document.querySelector("#signup-status");
    if (form) form.hidden = true;
    status.hidden = false;
    status.textContent = message;
  }

  body.addEventListener("submit", function (event) {
    var form = event.target.closest("#signup");
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    var button = form.querySelector("button");
    var payload = leadPayload(new FormData(form));
    var url = window.SCOOPS_LEAD_URL || "";
    button.disabled = true;
    button.textContent = "Sending…";

    if (!url) {
      showStatus("Thanks. We'll text you to schedule the first cleanup. If you don't hear from us today, call 612.702.0844.");
      return;
    }

    fetch(url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function () {
      showStatus("You're on the list. We'll text you to schedule the first cleanup.");
    }).catch(function () {
      button.disabled = false;
      button.textContent = "Schedule my first cleanup";
      var status = document.querySelector("#signup-status");
      status.hidden = false;
      status.textContent = "That didn't go through. Call 612.702.0844 and we'll write the quote down.";
    });
  });

  render();
})();
