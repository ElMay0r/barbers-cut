// ============================================
// BetterLife — Core Application Engine
// ============================================
window.BL = window.BL || {};

BL.App = (function () {
  var state = {
    activeTab: 'today',
    overlayOpen: false
  };

  // === LIVE CLOCK ===
  function startClock() {
    function update() {
      var now = new Date();
      var timeEl = document.getElementById('liveTime');
      var dateEl = document.getElementById('liveDate');
      if (timeEl) timeEl.innerText = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      if (dateEl) dateEl.innerText = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
    update();
    setInterval(update, 10000);
  }

  // === TAB RENDERING ===
  function renderTabs() {
    var container = document.getElementById('navContainer');
    if (!container) return;
    container.innerHTML = BL.Data.TABS.map(function (t) {
      return '<button class="nav-item ' + (state.activeTab === t.id ? 'active' : '') + '" data-action="tab" data-tab="' + t.id + '">' +
        '<div class="nav-icon">' + t.icon + '</div>' +
        '<div class="nav-label">' + t.label + '</div>' +
        '</button>';
    }).join('');
  }

  function renderContent() {
    var el = document.getElementById('content');
    if (!el) return;
    el.className = 'content animate-in';

    switch (state.activeTab) {
      case 'today': el.innerHTML = BL.TabToday.render(); break;
      case 'nutrition': el.innerHTML = BL.TabNutrition.render(); break;
      case 'body': el.innerHTML = BL.TabBody.render(); break;
      case 'routine': el.innerHTML = BL.TabRoutine.render(); break;
      case 'me': el.innerHTML = BL.TabMe.render(); break;
    }

    // Render any canvases after DOM insertion
    if (state.activeTab === 'today' && BL.TabToday.afterRender) {
      BL.TabToday.afterRender();
    }
    if (state.activeTab === 'body' && BL.TabBody.afterRender) {
      BL.TabBody.afterRender();
    }
    if (state.activeTab === 'me' && BL.TabMe.afterRender) {
      BL.TabMe.afterRender();
    }
    if (state.activeTab === 'nutrition' && BL.TabNutrition.afterRender) {
      BL.TabNutrition.afterRender();
    }
  }

  // === OVERLAY / MODAL SYSTEM ===
  function showOverlay(html) {
    var overlay = document.getElementById('overlay');
    var overlayContent = document.getElementById('overlayContent');
    if (!overlay || !overlayContent) return;
    overlayContent.innerHTML = html;
    overlay.classList.remove('hidden');
    overlay.classList.add('overlay-visible');
    state.overlayOpen = true;
    document.body.style.overflow = 'hidden';
  }

  function hideOverlay() {
    var overlay = document.getElementById('overlay');
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.classList.remove('overlay-visible');
    state.overlayOpen = false;
    document.body.style.overflow = '';
  }

  // === GLOBAL EVENT DELEGATION ===
  function setupEvents() {
    // Nav clicks
    document.getElementById('navContainer').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action="tab"]');
      if (btn) {
        state.activeTab = btn.dataset.tab;
        renderTabs();
        renderContent();
        window.scrollTo(0, 0);
      }
    });

    // Content area clicks (delegated)
    document.getElementById('content').addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;

      var action = target.dataset.action;
      handleAction(action, target, e);
    });

    // Content area inputs
    document.getElementById('content').addEventListener('input', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      handleAction(target.dataset.action, target, e);
    });

    // Overlay backdrop click
    document.getElementById('overlay').addEventListener('click', function (e) {
      if (e.target.id === 'overlay') {
        hideOverlay();
      }
    });

    // Overlay content clicks
    document.getElementById('overlayContent').addEventListener('click', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      handleAction(target.dataset.action, target, e);
    });

    // Overlay content inputs
    document.getElementById('overlayContent').addEventListener('input', function (e) {
      var target = e.target.closest('[data-action]');
      if (!target) return;
      handleAction(target.dataset.action, target, e);
    });
  }

  // === ACTION HANDLER ===
  function handleAction(action, target, e) {
    switch (action) {
      // Water
      case 'water-tap': {
        var i = parseInt(target.dataset.index);
        var current = BL.Store.getToday().water;
        BL.Store.setWater((i + 1 === current) ? i : i + 1);
        renderContent();
        break;
      }
      case 'water-quick': {
        var day = BL.Store.getToday();
        BL.Store.setWater(Math.min(10, day.water + 1));
        renderContent();
        break;
      }

      // Supplements
      case 'toggle-supp': {
        BL.Store.toggleSupplement(target.dataset.type);
        renderContent();
        break;
      }

      // Meals
      case 'show-meal-log': {
        showMealLogOverlay();
        break;
      }
      case 'log-meal-quick': {
        var mealData = {
          name: target.dataset.name,
          cals: parseInt(target.dataset.cals) || 0,
          p: parseInt(target.dataset.p) || 0,
          c: parseInt(target.dataset.c) || 0,
          f: parseInt(target.dataset.f) || 0,
          slot: target.dataset.slot || getTimeSlot()
        };
        BL.Store.logMeal(mealData);
        hideOverlay();
        renderContent();
        break;
      }
      case 'log-meal-custom': {
        var nameEl = document.getElementById('customMealName');
        var calsEl = document.getElementById('customMealCals');
        var pEl = document.getElementById('customMealP');
        var cEl = document.getElementById('customMealC');
        var fEl = document.getElementById('customMealF');
        if (!nameEl || !nameEl.value.trim()) return;
        BL.Store.logMeal({
          name: nameEl.value.trim(),
          cals: parseInt(calsEl.value) || 0,
          p: parseInt(pEl.value) || 0,
          c: parseInt(cEl.value) || 0,
          f: parseInt(fEl.value) || 0,
          slot: getTimeSlot()
        });
        hideOverlay();
        renderContent();
        break;
      }
      case 'remove-meal': {
        BL.Store.removeMeal(target.dataset.id);
        renderContent();
        break;
      }

      // Swap logging
      case 'log-swap': {
        e.stopPropagation();
        BL.Store.logMeal({
          name: target.dataset.name,
          cals: parseInt(target.dataset.cals) || 0,
          p: parseInt(target.dataset.p) || 0,
          c: parseInt(target.dataset.c) || 0,
          f: parseInt(target.dataset.f) || 0,
          slot: target.dataset.slot || getTimeSlot()
        });
        renderContent();
        break;
      }

      // Swap expand/collapse
      case 'toggle-swap': {
        var key = target.dataset.key;
        target.classList.toggle('expanded');
        var detail = target.querySelector('.swap-detail');
        if (detail) detail.classList.toggle('hidden');
        break;
      }

      // Exercise
      case 'show-exercise-log': {
        showExerciseLogOverlay();
        break;
      }
      case 'log-exercise-quick': {
        BL.Store.logExercise({
          name: target.dataset.name,
          duration: parseInt(target.dataset.duration) || 0,
          category: target.dataset.category || 'general'
        });
        hideOverlay();
        renderContent();
        break;
      }

      // Weight
      case 'log-weight': {
        var weightInput = document.getElementById('weightInput');
        if (!weightInput || !weightInput.value) return;
        BL.Store.logWeight(parseFloat(weightInput.value));
        renderContent();
        break;
      }

      // Sleep
      case 'log-sleep': {
        var bedEl = document.getElementById('sleepBed');
        var wakeEl = document.getElementById('sleepWake');
        var qualEl = document.querySelector('[data-action="sleep-quality"].active');
        if (!bedEl || !wakeEl) return;
        BL.Store.logSleep(bedEl.value, wakeEl.value, qualEl ? parseInt(qualEl.dataset.value) : 3);
        renderContent();
        break;
      }
      case 'sleep-quality': {
        document.querySelectorAll('[data-action="sleep-quality"]').forEach(function (el) {
          el.classList.remove('active');
        });
        target.classList.add('active');
        break;
      }

      // Steps
      case 'log-steps': {
        var stepsInput = document.getElementById('stepsInput');
        if (!stepsInput) return;
        BL.Store.setSteps(parseInt(stepsInput.value) || 0);
        renderContent();
        break;
      }

      // Habits
      case 'toggle-habit': {
        BL.Store.toggleHabit(target.dataset.id);
        renderContent();
        break;
      }
      case 'show-add-habit': {
        showAddHabitOverlay();
        break;
      }
      case 'add-habit': {
        var nameInput = document.getElementById('habitName');
        var iconInput = document.getElementById('habitIcon');
        if (!nameInput || !nameInput.value.trim()) return;
        BL.Store.addHabit(nameInput.value.trim(), (iconInput && iconInput.value) || '✅');
        hideOverlay();
        renderContent();
        break;
      }

      // Routines
      case 'toggle-routine': {
        BL.Store.toggleRoutineStep(target.dataset.type, target.dataset.id);
        renderContent();
        break;
      }

      // Tasks
      case 'add-task': {
        var taskInput = document.getElementById('taskInput');
        if (!taskInput || !taskInput.value.trim()) return;
        BL.Store.addTask(taskInput.value.trim(), 'medium');
        taskInput.value = '';
        renderContent();
        break;
      }
      case 'toggle-task': {
        BL.Store.toggleTask(target.dataset.id);
        renderContent();
        break;
      }
      case 'remove-task': {
        e.stopPropagation();
        BL.Store.removeTask(target.dataset.id);
        renderContent();
        break;
      }

      // Profile
      case 'save-profile': {
        var inputs = document.querySelectorAll('.profile-input');
        var updates = {};
        inputs.forEach(function (input) {
          var key = input.dataset.key;
          if (key === 'notes' || key === 'name') {
            updates[key] = input.value;
          } else if (key === 'activityLevel' || key === 'wakeTime' || key === 'bedTime') {
            updates[key] = input.value;
          } else {
            updates[key] = parseFloat(input.value) || 0;
          }
        });
        // Handle macros
        var macroInputs = document.querySelectorAll('.macro-input');
        if (macroInputs.length) {
          updates.macros = {};
          macroInputs.forEach(function (input) {
            updates.macros[input.dataset.macro] = parseInt(input.value) || 0;
          });
        }
        BL.Store.saveProfile(updates);
        target.innerText = 'Saved!';
        target.style.background = 'var(--bg)';
        target.style.border = '1px solid var(--accent)';
        target.style.color = 'var(--accent)';
        setTimeout(function () { renderContent(); }, 800);
        break;
      }

      // Overlay
      case 'close-overlay': {
        hideOverlay();
        break;
      }

      // Do-this-now done
      case 'do-this-done': {
        var actionType = target.dataset.type;
        if (actionType === 'water') {
          var d = BL.Store.getToday();
          BL.Store.setWater(Math.min(10, d.water + 1));
        } else if (actionType === 'supps') {
          if (!BL.Store.getToday().supplements.probiotic) BL.Store.toggleSupplement('probiotic');
          if (!BL.Store.getToday().supplements.vitamin) BL.Store.toggleSupplement('vitamin');
        }
        renderContent();
        break;
      }

      // Monday expand
      case 'toggle-monday': {
        var card = target.closest('.card');
        var detail2 = card.querySelector('.monday-detail');
        if (detail2) detail2.classList.toggle('hidden');
        break;
      }

      // Meal filter in overlay
      case 'filter-meals': {
        var filter = target.dataset.filter;
        document.querySelectorAll('.meal-filter-btn').forEach(function (b) { b.classList.remove('active'); });
        target.classList.add('active');
        document.querySelectorAll('.meal-item').forEach(function (item) {
          if (filter === 'all' || item.dataset.slot === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
        break;
      }

      // Export/Import
      case 'export-data': {
        var json = BL.Store.exportData();
        navigator.clipboard.writeText(json).then(function () {
          target.innerText = 'Copied to clipboard!';
          setTimeout(function () { target.innerText = 'Export Data'; }, 2000);
        });
        break;
      }
      case 'import-data': {
        var importArea = document.getElementById('importArea');
        if (importArea && importArea.value.trim()) {
          if (BL.Store.importData(importArea.value.trim())) {
            target.innerText = 'Imported!';
            setTimeout(function () { renderContent(); }, 800);
          } else {
            target.innerText = 'Invalid data!';
            setTimeout(function () { target.innerText = 'Import Data'; }, 2000);
          }
        }
        break;
      }
      case 'reset-data': {
        if (target.dataset.confirmed === 'true') {
          BL.Store.resetAll();
          renderContent();
        } else {
          target.dataset.confirmed = 'true';
          target.innerText = 'Tap again to confirm reset';
          target.style.background = 'var(--red)';
          setTimeout(function () {
            target.dataset.confirmed = '';
            target.innerText = 'Reset All Data';
            target.style.background = '';
          }, 3000);
        }
        break;
      }
    }
  }

  // === OVERLAY BUILDERS ===
  function showMealLogOverlay() {
    var slot = getTimeSlot();
    var meals = BL.Data.FREQUENT_MEALS;
    var todayMeals = BL.Store.getToday().meals;

    var html = '<div style="padding:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<h2 style="font-size:18px">Log a Meal</h2>' +
      '<button data-action="close-overlay" style="background:none;border:none;color:var(--text-muted);font-size:24px;cursor:pointer">&times;</button></div>';

    // Filter buttons
    html += '<div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap">' +
      '<button class="meal-filter-btn badge badge-green active" data-action="filter-meals" data-filter="all">All</button>' +
      '<button class="meal-filter-btn badge badge-muted" data-action="filter-meals" data-filter="morning">Morning</button>' +
      '<button class="meal-filter-btn badge badge-muted" data-action="filter-meals" data-filter="lunch">Lunch</button>' +
      '<button class="meal-filter-btn badge badge-muted" data-action="filter-meals" data-filter="dinner">Dinner</button>' +
      '<button class="meal-filter-btn badge badge-muted" data-action="filter-meals" data-filter="snack">Snack</button></div>';

    // Quick-add meals
    html += '<div style="max-height:280px;overflow-y:auto;margin-bottom:16px">';
    meals.forEach(function (m) {
      html += '<div class="meal-item" data-slot="' + m.slot + '" data-action="log-meal-quick" data-name="' + escapeAttr(m.name) + '" data-cals="' + m.cals + '" data-p="' + m.p + '" data-c="' + m.c + '" data-f="' + m.f + '" data-slot="' + m.slot + '" style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;cursor:pointer;background:var(--card)">' +
        '<div><div style="font-size:14px;font-weight:600">' + m.name + '</div>' +
        '<div class="macro-row" style="margin-top:4px;font-size:11px"><span class="macro-p">P:' + m.p + 'g</span> <span class="macro-c">C:' + m.c + 'g</span> <span class="macro-f">F:' + m.f + 'g</span></div></div>' +
        '<div style="font-weight:700;color:var(--accent);font-size:14px">' + m.cals + '</div></div>';
    });
    html += '</div>';

    // Custom meal form
    html += '<div style="border-top:1px solid var(--border);padding-top:16px">' +
      '<h3 style="font-size:14px;margin-bottom:10px;color:var(--text-dim)">Or add custom meal</h3>' +
      '<input id="customMealName" class="input-field" placeholder="Meal name" style="margin-bottom:8px;font-size:14px;padding:10px">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;margin-bottom:10px">' +
      '<input id="customMealCals" class="input-field" type="number" placeholder="Cals" style="font-size:13px;padding:8px">' +
      '<input id="customMealP" class="input-field" type="number" placeholder="Protein" style="font-size:13px;padding:8px">' +
      '<input id="customMealC" class="input-field" type="number" placeholder="Carbs" style="font-size:13px;padding:8px">' +
      '<input id="customMealF" class="input-field" type="number" placeholder="Fat" style="font-size:13px;padding:8px">' +
      '</div>' +
      '<button data-action="log-meal-custom" class="btn-primary" style="font-size:14px;padding:12px">Add Custom Meal</button></div></div>';

    showOverlay(html);
  }

  function showExerciseLogOverlay() {
    var html = '<div style="padding:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<h2 style="font-size:18px">Log Exercise</h2>' +
      '<button data-action="close-overlay" style="background:none;border:none;color:var(--text-muted);font-size:24px;cursor:pointer">&times;</button></div>';

    var exercises = [
      { name: 'Walked 30 min', duration: 30, category: 'cardio', icon: '🚶' },
      { name: 'Stretched 15 min', duration: 15, category: 'flexibility', icon: '🧘' },
      { name: 'Bodyweight Workout', duration: 20, category: 'strength', icon: '💪' },
      { name: 'Jogged 20 min', duration: 20, category: 'cardio', icon: '🏃' },
      { name: 'Core Workout', duration: 15, category: 'strength', icon: '🔥' },
      { name: 'Yoga 30 min', duration: 30, category: 'flexibility', icon: '🧘' },
      { name: 'Walked 60 min', duration: 60, category: 'cardio', icon: '🚶' },
      { name: 'Quick Stretch 5 min', duration: 5, category: 'flexibility', icon: '🤸' }
    ];

    exercises.forEach(function (ex) {
      html += '<div data-action="log-exercise-quick" data-name="' + ex.name + '" data-duration="' + ex.duration + '" data-category="' + ex.category + '" style="display:flex;align-items:center;gap:12px;padding:14px;border:1px solid var(--border);border-radius:8px;margin-bottom:6px;cursor:pointer;background:var(--card)">' +
        '<span style="font-size:24px">' + ex.icon + '</span>' +
        '<div><div style="font-size:14px;font-weight:600">' + ex.name + '</div><div style="font-size:12px;color:var(--text-muted)">' + ex.duration + ' min</div></div></div>';
    });

    html += '</div>';
    showOverlay(html);
  }

  function showAddHabitOverlay() {
    var html = '<div style="padding:20px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<h2 style="font-size:18px">Add New Habit</h2>' +
      '<button data-action="close-overlay" style="background:none;border:none;color:var(--text-muted);font-size:24px;cursor:pointer">&times;</button></div>' +
      '<input id="habitName" class="input-field" placeholder="Habit name (e.g. Read 10 minutes)" style="margin-bottom:10px">' +
      '<input id="habitIcon" class="input-field" placeholder="Emoji icon (default: ✅)" style="margin-bottom:10px">' +
      '<button data-action="add-habit" class="btn-primary">Add Habit</button></div>';
    showOverlay(html);
  }

  // === HELPERS ===
  function getTimeSlot() {
    var h = new Date().getHours();
    if (h < 11) return 'morning';
    if (h < 16) return 'lunch';
    if (h < 21) return 'dinner';
    return 'snack';
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // === INIT ===
  function init() {
    BL.Store.load();
    startClock();
    renderTabs();
    renderContent();
    setupEvents();

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function () { });
    }
  }

  // Public API
  return {
    init: init,
    render: renderContent,
    renderTabs: renderTabs,
    showOverlay: showOverlay,
    hideOverlay: hideOverlay,
    getState: function () { return state; },
    escapeAttr: escapeAttr
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', BL.App.init);
