// ============================================
// BetterLife — Body & Fitness Tab
// ============================================
window.BL = window.BL || {};

BL.TabBody = {
  render: function () {
    var profile = BL.Store.getProfile();
    var dayLog = BL.Store.getToday();
    var weightHistory = BL.Store.getWeightHistory(30);

    var html = '<h2>Body & Fitness</h2><p class="subtitle">Track your body, move more, sleep better.</p>';

    // === WEIGHT TRACKER ===
    html += '<div class="card">' +
      '<h3 style="margin-bottom:12px;color:var(--accent)">⚖️ Weight Tracker</h3>';

    // Current weight display
    var currentWeight = profile.weight;
    var goalWeight = profile.goalWeight;
    var diff = currentWeight - goalWeight;

    html += '<div style="display:flex;justify-content:space-around;text-align:center;margin-bottom:16px">' +
      '<div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Current</div>' +
      '<div style="font-size:24px;font-weight:700">' + currentWeight + '<span style="font-size:12px;color:var(--text-muted)"> lbs</span></div></div>' +
      '<div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Goal</div>' +
      '<div style="font-size:24px;font-weight:700;color:var(--accent)">' + goalWeight + '<span style="font-size:12px;color:var(--text-muted)"> lbs</span></div></div>' +
      '<div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">To Go</div>' +
      '<div style="font-size:24px;font-weight:700;color:' + (diff > 0 ? 'var(--yellow)' : 'var(--accent)') + '">' + (diff > 0 ? diff.toFixed(1) : '✅') + '<span style="font-size:12px;color:var(--text-muted)">' + (diff > 0 ? ' lbs' : '') + '</span></div></div></div>';

    // Weight progress bar
    if (weightHistory.length > 0) {
      var startWeight = weightHistory[0].weight;
      var totalToLose = startWeight - goalWeight;
      var lost = startWeight - currentWeight;
      var progressPct = totalToLose > 0 ? Math.max(0, Math.min(100, (lost / totalToLose) * 100)) : 100;
      html += '<div style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-bottom:4px"><span>Start: ' + startWeight + ' lbs</span><span>Goal: ' + goalWeight + ' lbs</span></div>' +
        '<div style="background:var(--border);border-radius:4px;height:8px;overflow:hidden">' +
        '<div style="background:var(--accent);height:100%;width:' + progressPct + '%;border-radius:4px"></div></div>' +
        '<div style="text-align:center;font-size:11px;color:var(--accent);margin-top:4px;font-weight:600">' + progressPct.toFixed(0) + '% of goal</div></div>';
    }

    // Weight chart canvas
    if (weightHistory.length >= 2) {
      html += '<canvas id="weightChart" width="540" height="200" style="width:100%;height:auto;margin-bottom:12px"></canvas>';
    }

    // Log weight input
    html += '<div style="display:flex;gap:8px">' +
      '<input id="weightInput" type="number" class="input-field" placeholder="Today\'s weight" step="0.1" style="flex:1;font-size:14px;padding:10px">' +
      '<button data-action="log-weight" style="background:var(--accent);color:#000;border:none;padding:10px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px">Log</button></div>';

    // Estimated time to goal
    if (weightHistory.length >= 7) {
      var recent = weightHistory.slice(-7);
      var weeklyLoss = (recent[0].weight - recent[recent.length - 1].weight);
      if (weeklyLoss > 0 && diff > 0) {
        var weeksToGoal = Math.ceil(diff / weeklyLoss);
        html += '<div style="margin-top:10px;font-size:12px;color:var(--text-dim);text-align:center">At your current pace: ~' + weeksToGoal + ' weeks to goal</div>';
      }
    }

    html += '</div>';

    // === EXERCISE ===
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="font-size:15px">🏋️ Exercise</h3>' +
      '<span style="font-size:12px;color:' + (dayLog.exercises.length > 0 ? 'var(--accent)' : 'var(--text-muted)') + ';font-weight:600">' + (dayLog.exercises.length > 0 ? '✅ ' + dayLog.exercises.length + ' logged' : 'None yet') + '</span></div>';

    // Today's exercises
    if (dayLog.exercises.length > 0) {
      dayLog.exercises.forEach(function (ex) {
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;background:var(--card-hover);border-radius:6px;margin-bottom:6px">' +
          '<div style="font-size:14px;font-weight:600">' + ex.name + '</div>' +
          '<div style="font-size:12px;color:var(--text-muted)">' + (ex.duration || 0) + ' min</div></div>';
      });
    }

    html += '<button data-action="show-exercise-log" class="btn-primary" style="font-size:13px;padding:10px">+ Log Exercise</button>';

    // Exercise tip
    html += '<div style="margin-top:12px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;font-size:12px;color:var(--text-dim);line-height:1.5">' +
      '💡 <strong>Barber tip:</strong> Standing all day is hard on your back and legs. Even 10 minutes of stretching can prevent long-term pain. Focus on hip flexors, shoulders, and lower back.</div>';
    html += '</div>';

    // === STEPS ===
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<h3 style="font-size:15px">🚶 Steps</h3>' +
      '<span style="font-size:13px;font-weight:700;color:' + (dayLog.steps >= 8000 ? 'var(--accent)' : 'var(--text-dim)') + '">' + (dayLog.steps || 0).toLocaleString() + ' / 8,000</span></div>';

    var stepPct = Math.min(((dayLog.steps || 0) / 8000) * 100, 100);
    html += '<div style="background:var(--border);border-radius:4px;height:8px;margin-bottom:10px;overflow:hidden">' +
      '<div style="background:var(--accent);height:100%;width:' + stepPct + '%;border-radius:4px"></div></div>';

    html += '<div style="display:flex;gap:8px">' +
      '<input id="stepsInput" type="number" class="input-field" placeholder="Enter steps" value="' + (dayLog.steps || '') + '" style="flex:1;font-size:14px;padding:10px">' +
      '<button data-action="log-steps" style="background:var(--accent);color:#000;border:none;padding:10px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px">Save</button></div></div>';

    // === SLEEP ===
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="font-size:15px">😴 Sleep</h3>' +
      '<span style="font-size:12px;color:' + (dayLog.sleep.duration > 0 ? 'var(--accent)' : 'var(--text-muted)') + ';font-weight:600">' +
      (dayLog.sleep.duration > 0 ? formatDuration(dayLog.sleep.duration) + ' logged' : 'Not logged') + '</span></div>';

    if (dayLog.sleep.duration > 0) {
      html += '<div style="display:flex;justify-content:space-around;text-align:center;margin-bottom:12px;padding:10px;background:var(--card-hover);border-radius:8px">' +
        '<div><div style="font-size:10px;color:var(--text-muted)">Bed</div><div style="font-size:14px;font-weight:600">' + dayLog.sleep.bedTime + '</div></div>' +
        '<div><div style="font-size:10px;color:var(--text-muted)">Wake</div><div style="font-size:14px;font-weight:600">' + dayLog.sleep.wakeTime + '</div></div>' +
        '<div><div style="font-size:10px;color:var(--text-muted)">Duration</div><div style="font-size:14px;font-weight:600;color:var(--accent)">' + formatDuration(dayLog.sleep.duration) + '</div></div>' +
        '<div><div style="font-size:10px;color:var(--text-muted)">Quality</div><div style="font-size:14px;font-weight:600">' + '⭐'.repeat(dayLog.sleep.quality || 0) + '</div></div></div>';
    } else {
      var defaultBed = profile.bedTime || '00:30';
      var defaultWake = profile.wakeTime || '09:00';

      html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">' +
        '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">Bed Time</label>' +
        '<input id="sleepBed" type="time" class="input-field" value="' + defaultBed + '" style="font-size:14px;padding:10px"></div>' +
        '<div><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:4px">Wake Time</label>' +
        '<input id="sleepWake" type="time" class="input-field" value="' + defaultWake + '" style="font-size:14px;padding:10px"></div></div>';

      // Quality rating
      html += '<div style="margin-bottom:10px"><label style="font-size:11px;color:var(--text-muted);display:block;margin-bottom:6px">Sleep Quality</label>' +
        '<div style="display:flex;gap:8px">';
      for (var q = 1; q <= 5; q++) {
        html += '<button data-action="sleep-quality" data-value="' + q + '" style="background:' + (q === 3 ? 'var(--accent-glow)' : 'var(--card-hover)') + ';border:1px solid ' + (q === 3 ? 'var(--accent-dim)' : 'var(--border)') + ';color:var(--text);padding:8px 12px;border-radius:6px;cursor:pointer;font-size:16px;flex:1' + (q === 3 ? ';' : '') + '">' + '⭐'.repeat(q) + '</button>';
      }
      html += '</div></div>';

      html += '<button data-action="log-sleep" class="btn-primary" style="font-size:13px;padding:10px">Log Sleep</button>';
    }

    html += '<div style="margin-top:12px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;font-size:12px;color:var(--text-dim);line-height:1.5">' +
      '💡 <strong>Why sleep matters:</strong> Poor sleep raises hunger hormones by 28% and makes you crave sugar. 7-8 hours is your target. Your body repairs and burns fat during deep sleep.</div>';
    html += '</div>';

    // === SUPPLEMENTS ===
    html += '<div class="card card-purple">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="font-size:15px">💊 Supplements</h3>' +
      '<span style="font-size:12px;color:var(--purple);font-weight:600">' + ((dayLog.supplements.probiotic && dayLog.supplements.vitamin) ? '✅ Done' : 'Pending') + '</span></div>';

    html += '<button class="supp-btn ' + (dayLog.supplements.probiotic ? 'taken' : '') + '" data-action="toggle-supp" data-type="probiotic">' +
      '<div style="text-align:left"><span style="font-size:14px;font-weight:600">Spring Valley Probiotic</span>' +
      '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">Take 1 capsule with food. Supports gut health and digestion.</div></div>' +
      '<div class="supp-check">' + (dayLog.supplements.probiotic ? '✓' : '') + '</div></button>';

    html += '<button class="supp-btn ' + (dayLog.supplements.vitamin ? 'taken' : '') + '" data-action="toggle-supp" data-type="vitamin">' +
      '<div style="text-align:left"><span style="font-size:14px;font-weight:600">Equate Multivitamin</span>' +
      '<div style="font-size:11px;color:var(--text-muted);margin-top:2px">Take 1 tablet with your largest meal. Covers micronutrient gaps.</div></div>' +
      '<div class="supp-check">' + (dayLog.supplements.vitamin ? '✓' : '') + '</div></button>';

    html += '<div style="margin-top:10px;padding:10px;background:rgba(0,0,0,0.2);border-radius:8px;font-size:12px;color:var(--text-dim);line-height:1.5">' +
      '💡 <strong>Why supplements?</strong> When eating at a caloric deficit, your body may not get all the micronutrients it needs from food alone. Probiotics support gut bacteria (which affect cravings and mood), while a multivitamin covers vitamin and mineral gaps.</div>';
    html += '</div>';

    return html;
  },

  afterRender: function () {
    var weightHistory = BL.Store.getWeightHistory(30);
    var profile = BL.Store.getProfile();
    if (weightHistory.length >= 2) {
      BL.Charts.weightTrend('weightChart', weightHistory, profile.goalWeight);
    }
  }
};

function formatDuration(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  return h + 'h ' + m + 'm';
}
