// ============================================
// BetterLife — Today / Dashboard Tab
// ============================================
window.BL = window.BL || {};

BL.TabToday = {
  render: function () {
    var profile = BL.Store.getProfile();
    var dayLog = BL.Store.getToday();
    var now = new Date();
    var hour = now.getHours();
    var day = now.getDay();
    var score = BL.Store.getDailyScore();

    // Greeting
    var greeting = BL.Coach.getGreeting(profile);
    var doThis = BL.Coach.getDoThisNow(dayLog, profile, hour);
    var motivation = BL.Coach.getMotivation(dayLog);
    var tip = BL.Coach.getDailyTip();

    var html = '';

    // === GREETING ===
    html += '<div style="margin-bottom:16px">' +
      '<div style="font-size:28px;margin-bottom:4px">' + greeting.icon + '</div>' +
      '<h2 style="font-size:22px;margin-bottom:4px">' + greeting.text + '</h2>' +
      '<p style="font-size:13px;color:' + motivation.color + ';font-weight:600">' + motivation.text + '</p></div>';

    // === PROGRESS RING + DO THIS NOW (side by side) ===
    html += '<div style="display:flex;gap:16px;margin-bottom:16px">';

    // Progress ring
    html += '<div class="progress-ring-container">' +
      '<canvas id="dailyRing" width="120" height="120"></canvas></div>';

    // Do This Now card
    html += '<div class="do-this-now" style="flex:1">' +
      '<div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Do This Now</div>' +
      '<div style="font-size:24px;margin-bottom:6px">' + doThis.icon + '</div>' +
      '<div style="font-size:14px;font-weight:600;line-height:1.4">' + doThis.text + '</div>';
    if (doThis.action === 'water' || doThis.action === 'supps') {
      html += '<button data-action="do-this-done" data-type="' + doThis.action + '" style="margin-top:10px;background:var(--accent);color:#000;border:none;padding:8px 16px;border-radius:6px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Done</button>';
    }
    html += '</div></div>';

    // === QUICK ACTION BUTTONS ===
    html += '<div class="quick-actions">' +
      '<button class="quick-btn" data-action="show-meal-log"><span class="quick-btn-icon">🍽️</span><span class="quick-btn-label">Log Meal</span></button>' +
      '<button class="quick-btn" data-action="water-quick"><span class="quick-btn-icon">💧</span><span class="quick-btn-label">Water +1</span></button>' +
      '<button class="quick-btn" data-action="show-exercise-log"><span class="quick-btn-icon">🏋️</span><span class="quick-btn-label">Exercise</span></button>' +
      '</div>';

    // === WATER TRACKER (compact) ===
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<h3 style="font-size:14px">💧 Water</h3>' +
      '<span style="color:var(--water);font-weight:700;font-size:13px">' + dayLog.water + ' / 10</span></div>' +
      '<div class="water-grid">';
    for (var w = 0; w < 10; w++) {
      html += '<div class="water-drop ' + (w < dayLog.water ? 'filled' : 'empty') + '" data-action="water-tap" data-index="' + w + '">💧</div>';
    }
    html += '</div></div>';

    // === SUPPLEMENTS (compact inline) ===
    html += '<div class="card card-purple">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<h3 style="font-size:14px">💊 Supplements</h3>' +
      '<span style="font-size:12px;color:var(--purple);font-weight:600">' + ((dayLog.supplements.probiotic && dayLog.supplements.vitamin) ? '✅ Done' : 'Pending') + '</span></div>' +
      '<div style="display:flex;gap:10px">' +
      '<button class="supp-btn ' + (dayLog.supplements.probiotic ? 'taken' : '') + '" data-action="toggle-supp" data-type="probiotic" style="flex:1;margin:0;padding:12px"><span style="font-size:13px;font-weight:600">Probiotic</span></button>' +
      '<button class="supp-btn ' + (dayLog.supplements.vitamin ? 'taken' : '') + '" data-action="toggle-supp" data-type="vitamin" style="flex:1;margin:0;padding:12px"><span style="font-size:13px;font-weight:600">Vitamin</span></button>' +
      '</div></div>';

    // === TODAY'S MEALS LOGGED (summary) ===
    var nutrition = BL.Store.getTodayNutrition();
    var calTarget = profile.calorieTarget || (profile.tdee - 500) || 1850;
    if (calTarget <= 0) calTarget = 1850;

    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
      '<h3 style="font-size:14px">🍽️ Today\'s Nutrition</h3>' +
      '<span style="font-size:13px;font-weight:700;color:var(--accent)">' + nutrition.cals + ' / ' + calTarget + ' cal</span></div>';

    // Calorie bar
    var calPct = Math.min((nutrition.cals / calTarget) * 100, 100);
    html += '<div style="background:var(--border);border-radius:4px;height:8px;margin-bottom:10px;overflow:hidden">' +
      '<div style="background:' + (calPct > 100 ? 'var(--red)' : 'var(--accent)') + ';height:100%;width:' + calPct + '%;border-radius:4px;transition:width 0.3s"></div></div>';

    // Macro mini row
    html += '<div class="macro-row" style="justify-content:space-around;font-size:12px">' +
      '<span class="macro-p">P: ' + nutrition.p + 'g / ' + profile.macros.p + 'g</span>' +
      '<span class="macro-c">C: ' + nutrition.c + 'g / ' + profile.macros.c + 'g</span>' +
      '<span class="macro-f">F: ' + nutrition.f + 'g / ' + profile.macros.f + 'g</span></div>';

    if (dayLog.meals.length > 0) {
      html += '<div style="margin-top:10px;border-top:1px solid var(--border);padding-top:10px">';
      dayLog.meals.forEach(function (m) {
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;font-size:13px">' +
          '<div style="color:var(--text-dim)">' + m.name + '</div>' +
          '<div style="font-weight:600;color:var(--accent)">' + m.cals + '</div></div>';
      });
      html += '</div>';
    }
    html += '</div>';

    // === CURRENT MEAL WINDOW (smart swaps) ===
    if (day !== 1) {
      var currentMeal = null;
      BL.Data.WORK_MEALS.forEach(function (meal) {
        if (hour >= meal.timeStart && hour < meal.timeEnd) currentMeal = meal;
      });
      if (currentMeal) {
        html += '<div class="card highlight-now" style="position:relative">' +
          '<div style="font-size:11px;color:var(--text-muted);font-weight:700;margin-bottom:8px">' + currentMeal.label + '</div>' +
          '<div style="font-size:12px;color:var(--text-dim);margin-bottom:10px">Smart swaps for right now:</div>';
        currentMeal.swaps.forEach(function (sw) {
          html += '<div style="display:flex;justify-content:space-between;align-items:center;background:var(--card-hover);padding:10px;border-radius:8px;margin-bottom:6px">' +
            '<div style="flex:1"><div style="font-size:14px;font-weight:600">' + sw.name + '</div>' +
            '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">' + sw.tip + '</div></div>' +
            '<div style="text-align:right;margin-left:10px"><div style="font-size:14px;font-weight:700;color:var(--accent)">' + sw.cals + ' cal</div>' +
            '<button data-action="log-swap" data-name="' + BL.App.escapeAttr(sw.name) + '" data-cals="' + sw.cals + '" data-p="' + sw.protein + '" data-c="' + sw.carbs + '" data-f="' + sw.fat + '" data-slot="' + currentMeal.id + '" style="background:var(--accent-glow);color:var(--accent);border:1px solid var(--accent-dim);padding:4px 8px;border-radius:4px;font-size:10px;font-weight:700;cursor:pointer;margin-top:4px;font-family:inherit">Log This</button></div></div>';
        });
        html += '</div>';
      }
    } else {
      // Monday prep day card
      html += '<div class="card card-accent">' +
        '<h3 style="color:var(--accent)">🏠 MONDAY PREP DAY</h3>' +
        '<p style="font-size:12px;color:var(--text-dim);margin-top:4px">Cook everything today to survive the week.</p></div>';
      BL.Data.MONDAY_MEALS.forEach(function (meal, i) {
        var isNow = (hour >= meal.time && hour < meal.time + 2);
        html += '<div class="card ' + (isNow ? 'highlight-now' : '') + ' ' + (meal.name.includes('💊') ? 'card-purple' : '') + '" data-action="toggle-monday">' +
          '<div style="display:flex;justify-content:space-between;align-items:flex-start">' +
          '<div><div style="font-size:11px;color:var(--text-muted);font-weight:700">' + meal.label + '</div>' +
          '<div style="font-size:15px;font-weight:600;margin-top:4px">' + meal.name + '</div></div>' +
          (meal.cals ? '<div style="font-size:16px;font-weight:700;color:var(--accent)">' + meal.cals + ' <span style="font-size:10px;color:var(--text-muted)">cal</span></div>' : '') + '</div>' +
          (meal.cals ? '<div class="macro-row"><span class="macro-p">P: ' + meal.p + 'g</span><span class="macro-c">C: ' + meal.c + 'g</span><span class="macro-f">F: ' + meal.f + 'g</span></div>' : '') +
          '<div class="monday-detail ' + (isNow ? '' : 'hidden') + '" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);font-size:13px;color:var(--text-dim);line-height:1.5">' + meal.info + '</div></div>';
      });
    }

    // === DAILY TIP ===
    html += '<div class="card" style="border-color:rgba(34,197,94,0.15);background:var(--accent-glow)">' +
      '<div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Daily Tip</div>' +
      '<div style="font-size:20px;margin-bottom:6px">' + tip.icon + '</div>' +
      '<p style="font-size:13px;color:var(--text-dim);line-height:1.6">' + tip.text + '</p></div>';

    return html;
  },

  afterRender: function () {
    var score = BL.Store.getDailyScore();
    BL.Charts.progressRing('dailyRing', score, '#22c55e');
  }
};
