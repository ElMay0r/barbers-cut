// ============================================
// BetterLife — Nutrition Tab (Swaps + Prep + Food Log)
// ============================================
window.BL = window.BL || {};

BL.TabNutrition = {
  _expandedSwaps: {},

  render: function () {
    var profile = BL.Store.getProfile();
    var dayLog = BL.Store.getToday();
    var nutrition = BL.Store.getTodayNutrition();
    var calTarget = profile.calorieTarget || (profile.tdee - 500) || 1850;
    if (calTarget <= 0) calTarget = 1850;
    var hour = new Date().getHours();
    var self = this;

    var html = '<h2>Nutrition</h2><p class="subtitle">Track your meals, hit your targets, and use smart swaps.</p>';

    // === CALORIE / MACRO DASHBOARD ===
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
      '<h3 style="font-size:15px">Calories</h3>' +
      '<span style="font-size:15px;font-weight:700;color:var(--accent)">' + nutrition.cals + ' / ' + calTarget + '</span></div>';

    var calPct = Math.min((nutrition.cals / calTarget) * 100, 100);
    var calColor = nutrition.cals > calTarget ? 'var(--red)' : 'var(--accent)';
    html += '<div style="background:var(--border);border-radius:4px;height:10px;margin-bottom:14px;overflow:hidden">' +
      '<div style="background:' + calColor + ';height:100%;width:' + calPct + '%;border-radius:4px;transition:width 0.3s"></div></div>';

    // Macro bars
    var macros = [
      { label: 'Protein', val: nutrition.p, target: profile.macros.p, color: 'var(--protein)', key: 'P' },
      { label: 'Carbs', val: nutrition.c, target: profile.macros.c, color: 'var(--carbs)', key: 'C' },
      { label: 'Fat', val: nutrition.f, target: profile.macros.f, color: 'var(--fat)', key: 'F' }
    ];
    macros.forEach(function (m) {
      var pct = m.target > 0 ? Math.min((m.val / m.target) * 100, 100) : 0;
      html += '<div style="margin-bottom:8px">' +
        '<div style="display:flex;justify-content:space-between;font-size:12px;font-weight:600;margin-bottom:3px">' +
        '<span style="color:' + m.color + '">' + m.label + '</span>' +
        '<span style="color:var(--text-dim)">' + m.val + 'g / ' + m.target + 'g</span></div>' +
        '<div style="background:var(--border);border-radius:3px;height:6px;overflow:hidden">' +
        '<div style="background:' + m.color + ';height:100%;width:' + pct + '%;border-radius:3px;transition:width 0.3s"></div></div></div>';
    });

    // Remaining calories
    var remaining = calTarget - nutrition.cals;
    html += '<div style="text-align:center;padding:8px;background:rgba(0,0,0,0.2);border-radius:8px;font-size:13px;color:' + (remaining >= 0 ? 'var(--accent)' : 'var(--red)') + ';font-weight:600">' +
      (remaining >= 0 ? remaining + ' calories remaining' : Math.abs(remaining) + ' calories over target') + '</div>';
    html += '</div>';

    // === ADD MEAL BUTTON ===
    html += '<button data-action="show-meal-log" class="btn-primary" style="margin-bottom:16px">+ Log a Meal</button>';

    // === TODAY'S LOGGED MEALS ===
    if (dayLog.meals.length > 0) {
      html += '<div class="card">' +
        '<h3 style="font-size:14px;margin-bottom:12px">Today\'s Meals</h3>';
      dayLog.meals.forEach(function (m) {
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;background:var(--card-hover);border-radius:8px;margin-bottom:6px">' +
          '<div style="flex:1">' +
          '<div style="font-size:14px;font-weight:600">' + m.name + '</div>' +
          '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + (m.time || '') + ' · ' +
          '<span class="macro-p">P:' + (m.p || 0) + 'g</span> <span class="macro-c">C:' + (m.c || 0) + 'g</span> <span class="macro-f">F:' + (m.f || 0) + 'g</span></div></div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
          '<span style="font-weight:700;color:var(--accent);font-size:14px">' + (m.cals || 0) + '</span>' +
          '<button data-action="remove-meal" data-id="' + m.id + '" style="background:none;border:none;color:var(--red);font-size:16px;cursor:pointer;padding:4px">×</button></div></div>';
      });
      html += '</div>';
    }

    // === SMART SWAPS ===
    html += '<h3 style="margin:20px 0 8px;font-size:14px;color:var(--text-dim)">Smart Swaps Guide</h3>';
    html += '<p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Tap a swap to see details. Use "Log This" to add it to today\'s meals.</p>';

    BL.Data.WORK_MEALS.forEach(function (cat) {
      var isActive = (hour >= cat.timeStart && hour < cat.timeEnd);
      html += '<div style="margin-bottom:16px">';
      html += '<div style="font-size:11px;font-weight:700;color:' + (isActive ? 'var(--accent)' : 'var(--text-muted)') + ';text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">' +
        (isActive ? '● ' : '') + cat.label + '</div>';

      cat.swaps.forEach(function (sw, i) {
        var key = cat.id + '-' + i;
        var isOpen = self._expandedSwaps[key];
        html += '<div class="card" style="padding:14px;cursor:pointer" data-action="toggle-swap" data-key="' + key + '">' +
          '<div class="swap-header">' +
          '<div style="flex:1">' +
          '<div style="font-size:15px;font-weight:700">' + sw.name + '</div>' +
          '<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">' +
          '<span class="badge badge-green">' + sw.cals + ' cal</span>' +
          '<span class="badge badge-muted">' + sw.sugar + ' sugar</span>' +
          '<span class="badge badge-purple">' + sw.difficulty + '</span></div></div>' +
          '<div style="color:var(--text-muted);font-size:20px">' + (isOpen ? '−' : '+') + '</div></div>' +
          '<div class="swap-detail ' + (isOpen ? '' : 'hidden') + '">' +
          '<div class="macro-row" style="margin-bottom:10px">' +
          '<span class="macro-p">P: ' + sw.protein + 'g</span>' +
          '<span class="macro-c">C: ' + sw.carbs + 'g</span>' +
          '<span class="macro-f">F: ' + sw.fat + 'g</span></div>' +
          '<div class="swap-tip">💡 ' + sw.tip + '</div>' +
          '<button data-action="log-swap" data-name="' + BL.App.escapeAttr(sw.name) + '" data-cals="' + sw.cals + '" data-p="' + sw.protein + '" data-c="' + sw.carbs + '" data-f="' + sw.fat + '" data-slot="' + cat.id + '" style="margin-top:10px;background:var(--accent);color:#000;border:none;padding:10px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;width:100%;font-family:inherit">Log This Meal</button></div></div>';
      });
      html += '</div>';
    });

    // === WEEKLY PREP ===
    html += '<h3 style="margin:20px 0 8px;font-size:14px;color:var(--text-dim)">Weekly Prep</h3>';
    html += '<p style="font-size:12px;color:var(--text-muted);margin-bottom:12px">Do these every Monday to set up the entire work week.</p>';
    html += '<div class="card">';
    BL.Data.PREP_TASKS.forEach(function (task, i) {
      html += '<div style="margin-bottom:' + (i < BL.Data.PREP_TASKS.length - 1 ? '14px;padding-bottom:14px;border-bottom:1px solid var(--border)' : '0') + '">' +
        '<div style="font-weight:600;font-size:15px;margin-bottom:4px">' + task.icon + ' ' + task.name + '</div>' +
        '<div style="font-size:13px;color:var(--text-dim)">' + task.detail + '</div></div>';
    });
    html += '</div>';

    // === GROCERY LIST ===
    html += '<h3 style="margin:20px 0 8px;font-size:14px;color:var(--text-dim)">Grocery List</h3>';
    html += '<div class="card">';
    var categories = {};
    BL.Data.GROCERY_ITEMS.forEach(function (item) {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });
    Object.keys(categories).forEach(function (cat) {
      html += '<div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin:10px 0 6px">' + cat + '</div>';
      categories[cat].forEach(function (item) {
        html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:14px">' +
          '<span style="color:var(--text-muted)">☐</span> ' + item.name + '</div>';
      });
    });
    html += '</div>';

    return html;
  },

  afterRender: function () {
    // Re-bind swap toggles to track open state
    var self = this;
    document.querySelectorAll('[data-action="toggle-swap"]').forEach(function (el) {
      el.addEventListener('click', function () {
        var key = el.dataset.key;
        self._expandedSwaps[key] = !self._expandedSwaps[key];
      });
    });
  }
};
