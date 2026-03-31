// ============================================
// BetterLife — Me / Profile / Progress Tab
// ============================================
window.BL = window.BL || {};

BL.TabMe = {
  render: function () {
    var profile = BL.Store.getProfile();
    var dayLog = BL.Store.getToday();
    var weightHistory = BL.Store.getWeightHistory();
    var habits = BL.Store.getHabits();
    var score = BL.Store.getDailyScore();

    var html = '<h2>Me</h2><p class="subtitle">Your profile, progress, and health knowledge.</p>';

    // === PROFILE FORM ===
    html += '<div class="card">' +
      '<h3 style="margin-bottom:12px;color:var(--accent)">👤 Profile</h3>' +
      '<div class="input-group">' +
      '<label>Your Name</label>' +
      '<input type="text" class="input-field profile-input" data-key="name" value="' + (profile.name || '') + '" placeholder="What should we call you?"></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="input-group"><label>Age</label>' +
      '<input type="number" class="input-field profile-input" data-key="age" value="' + profile.age + '"></div>' +
      '<div class="input-group"><label>Height (in)</label>' +
      '<input type="number" class="input-field profile-input" data-key="height" value="' + profile.height + '"></div>' +
      '<div class="input-group"><label>Current Weight (lbs)</label>' +
      '<input type="number" class="input-field profile-input" data-key="weight" value="' + profile.weight + '"></div>' +
      '<div class="input-group"><label>Goal Weight (lbs)</label>' +
      '<input type="number" class="input-field profile-input" data-key="goalWeight" value="' + profile.goalWeight + '"></div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
      '<div class="input-group"><label>Wake Time</label>' +
      '<input type="time" class="input-field profile-input" data-key="wakeTime" value="' + (profile.wakeTime || '09:00') + '"></div>' +
      '<div class="input-group"><label>Bed Time</label>' +
      '<input type="time" class="input-field profile-input" data-key="bedTime" value="' + (profile.bedTime || '00:30') + '"></div></div>' +
      '<div class="input-group"><label>Activity Level</label>' +
      '<select class="input-field profile-input" data-key="activityLevel" style="appearance:auto">' +
      '<option value="sedentary"' + (profile.activityLevel === 'sedentary' ? ' selected' : '') + '>Sedentary (desk job)</option>' +
      '<option value="light"' + (profile.activityLevel === 'light' ? ' selected' : '') + '>Light (some walking)</option>' +
      '<option value="moderate"' + (profile.activityLevel === 'moderate' ? ' selected' : '') + '>Moderate (barber / on feet)</option>' +
      '<option value="active"' + (profile.activityLevel === 'active' ? ' selected' : '') + '>Active (physical labor + exercise)</option>' +
      '</select></div></div>';

    // === ENERGY PROFILE ===
    var tdee = BL.Store.calculateTDEE(profile.weight, profile.height, profile.age, profile.activityLevel);
    var cutTarget = tdee - 500;

    html += '<div class="card card-accent">' +
      '<h3 style="margin-bottom:16px;color:var(--text)">📊 Energy Profile</h3>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:10px">' +
      '<span style="color:var(--text-muted);font-weight:600">Maintenance Calories (TDEE)</span>' +
      '<span style="font-weight:700;font-size:16px">' + tdee + ' kcal</span></div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:16px">' +
      '<span style="color:var(--text-dim);font-weight:600">Deficit Target (-500)</span>' +
      '<span style="color:var(--accent);font-weight:700;font-size:18px">' + cutTarget + ' kcal</span></div>' +
      '<div style="padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;font-size:12px;color:var(--text-dim);line-height:1.5">' +
      '💡 <strong>What is TDEE?</strong> Total Daily Energy Expenditure — the calories your body burns in a day. Eating 500 below this loses ~1 lb/week. This is calculated from your age, height, weight, and activity level.</div></div>';

    // === MACRO TARGETS ===
    html += '<div class="card">' +
      '<h3 style="margin-bottom:12px;font-size:12px;text-transform:uppercase;color:var(--text-muted);letter-spacing:0.5px">Daily Macro Targets</h3>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">' +
      '<div class="input-group" style="text-align:center">' +
      '<label style="color:var(--protein)">Protein (g)</label>' +
      '<input type="number" class="input-field macro-input" data-macro="p" value="' + profile.macros.p + '" style="text-align:center"></div>' +
      '<div class="input-group" style="text-align:center">' +
      '<label style="color:var(--carbs)">Carbs (g)</label>' +
      '<input type="number" class="input-field macro-input" data-macro="c" value="' + profile.macros.c + '" style="text-align:center"></div>' +
      '<div class="input-group" style="text-align:center">' +
      '<label style="color:var(--fat)">Fat (g)</label>' +
      '<input type="number" class="input-field macro-input" data-macro="f" value="' + profile.macros.f + '" style="text-align:center"></div></div>' +
      '<div style="padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;font-size:12px;color:var(--text-dim);line-height:1.5">' +
      '💡 <strong>What are macros?</strong> Protein builds/repairs muscle, carbs provide energy, fat supports hormones and brain function. Getting the right balance keeps you full and fueled.</div></div>';

    // === TRAINER NOTES ===
    html += '<div class="card" style="border-color:var(--yellow-dim);background:rgba(245,158,11,0.02)">' +
      '<h3 style="margin-bottom:12px;color:var(--yellow)">📋 Trainer / Dietitian Notes</h3>' +
      '<textarea class="trainer-notes profile-input" data-key="notes" placeholder="Add specific instructions, protocol adjustments, or medical notes here...">' + (profile.notes || '') + '</textarea></div>';

    // === SAVE BUTTON ===
    html += '<button data-action="save-profile" class="btn-primary">Save Profile Changes</button>';

    // === STREAK DASHBOARD ===
    if (habits.length > 0) {
      html += '<div class="card" style="margin-top:20px">' +
        '<h3 style="font-size:14px;margin-bottom:12px">🔥 Streak Dashboard</h3>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px">';
      habits.forEach(function (habit) {
        var streak = BL.Store.getHabitStreak(habit.id);
        html += '<div style="text-align:center;padding:12px;background:var(--card-hover);border-radius:8px">' +
          '<div style="font-size:20px;margin-bottom:4px">' + habit.icon + '</div>' +
          '<div style="font-size:20px;font-weight:700;color:var(--accent)">' + streak + '</div>' +
          '<div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">day streak</div>' +
          '<div style="font-size:11px;color:var(--text-dim);margin-top:2px">' + habit.name + '</div></div>';
      });
      html += '</div></div>';
    }

    // === WEIGHT CHART (full) ===
    if (weightHistory.length >= 2) {
      html += '<div class="card" style="margin-top:12px">' +
        '<h3 style="font-size:14px;margin-bottom:12px">⚖️ Weight History</h3>' +
        '<canvas id="weightChartFull" width="540" height="220" style="width:100%;height:auto"></canvas>';

      // Summary stats
      var startW = weightHistory[0].weight;
      var currentW = weightHistory[weightHistory.length - 1].weight;
      var totalLost = startW - currentW;
      html += '<div style="display:flex;justify-content:space-around;margin-top:12px;text-align:center">' +
        '<div><div style="font-size:10px;color:var(--text-muted)">Started</div><div style="font-size:14px;font-weight:700">' + startW + '</div></div>' +
        '<div><div style="font-size:10px;color:var(--text-muted)">Now</div><div style="font-size:14px;font-weight:700">' + currentW + '</div></div>' +
        '<div><div style="font-size:10px;color:var(--text-muted)">Lost</div><div style="font-size:14px;font-weight:700;color:' + (totalLost > 0 ? 'var(--accent)' : 'var(--red)') + '">' + totalLost.toFixed(1) + ' lbs</div></div></div>';
      html += '</div>';
    }

    // === HEALTH EDUCATION ===
    var fact = BL.Coach.getDailyFact();
    var tip = BL.Coach.getDailyTip();
    html += '<div class="card" style="margin-top:12px;border-color:rgba(34,197,94,0.15);background:var(--accent-glow)">' +
      '<h3 style="font-size:14px;margin-bottom:10px">🧠 Learn Something New</h3>' +
      '<div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:8px;margin-bottom:10px">' +
      '<div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:4px">Today\'s Health Fact</div>' +
      '<p style="font-size:13px;color:var(--text-dim);line-height:1.6">' + fact + '</p></div>' +
      '<div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:8px">' +
      '<div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:4px">Daily Tip</div>' +
      '<p style="font-size:13px;color:var(--text-dim);line-height:1.6">' + tip.icon + ' ' + tip.text + '</p></div></div>';

    // === DATA MANAGEMENT ===
    html += '<div class="card" style="margin-top:12px">' +
      '<h3 style="font-size:14px;margin-bottom:12px;color:var(--text-dim)">🔧 Data Management</h3>' +
      '<button data-action="export-data" style="width:100%;background:var(--card-hover);border:1px solid var(--border);color:var(--text);padding:12px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;margin-bottom:8px">Export Data (Copy to Clipboard)</button>' +
      '<textarea id="importArea" class="input-field" placeholder="Paste exported JSON here to import..." style="min-height:60px;font-size:12px;margin-bottom:8px"></textarea>' +
      '<button data-action="import-data" style="width:100%;background:var(--card-hover);border:1px solid var(--border);color:var(--text);padding:12px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;margin-bottom:8px">Import Data</button>' +
      '<button data-action="reset-data" style="width:100%;background:none;border:1px solid var(--red);color:var(--red);padding:12px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit">Reset All Data</button></div>';

    return html;
  },

  afterRender: function () {
    var weightHistory = BL.Store.getWeightHistory();
    var profile = BL.Store.getProfile();
    if (weightHistory.length >= 2) {
      BL.Charts.weightTrend('weightChartFull', weightHistory, profile.goalWeight);
    }
  }
};
