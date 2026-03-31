// ============================================
// BetterLife — Routine & Time Planner Tab
// ============================================
window.BL = window.BL || {};

BL.TabRoutine = {
  render: function () {
    var profile = BL.Store.getProfile();
    var dayLog = BL.Store.getToday();
    var habits = BL.Store.getHabits();
    var routines = BL.Store.getRoutines();
    var hour = new Date().getHours();

    var html = '<h2>Routine</h2><p class="subtitle">Build habits, follow routines, own your day.</p>';

    // === WHAT SHOULD I BE DOING NOW ===
    var schedule = getScheduleBlocks(profile);
    var currentBlock = null;
    var nextBlock = null;
    for (var i = 0; i < schedule.length; i++) {
      if (hour >= schedule[i].start && hour < schedule[i].end) {
        currentBlock = schedule[i];
        if (i + 1 < schedule.length) nextBlock = schedule[i + 1];
        break;
      }
    }

    if (currentBlock) {
      html += '<div class="card highlight-now" style="position:relative">' +
        '<div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Right Now</div>' +
        '<div style="font-size:20px;margin-bottom:4px">' + currentBlock.icon + '</div>' +
        '<div style="font-size:16px;font-weight:700">' + currentBlock.activity + '</div>' +
        '<div style="font-size:12px;color:var(--text-muted);margin-top:4px">' + formatHour(currentBlock.start) + ' – ' + formatHour(currentBlock.end) + '</div>';
      if (nextBlock) {
        html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border);font-size:12px;color:var(--text-dim)">Next: <strong>' + nextBlock.activity + '</strong> at ' + formatHour(nextBlock.start) + '</div>';
      }
      html += '</div>';
    }

    // === DAILY SCHEDULE ===
    html += '<div class="card">' +
      '<h3 style="font-size:14px;margin-bottom:12px">📅 Today\'s Schedule</h3>';
    schedule.forEach(function (block) {
      var isCurrent = (hour >= block.start && hour < block.end);
      var isPast = hour >= block.end;
      html += '<div style="display:flex;gap:12px;padding:8px 0;' + (isCurrent ? 'background:var(--accent-glow);margin:0 -10px;padding:8px 10px;border-radius:6px' : '') + '">' +
        '<div style="font-size:12px;color:' + (isCurrent ? 'var(--accent)' : 'var(--text-muted)') + ';font-weight:700;min-width:50px">' + formatHour(block.start) + '</div>' +
        '<div style="font-size:13px;font-weight:' + (isCurrent ? '700' : '500') + ';color:' + (isPast ? 'var(--text-muted)' : 'var(--text)') + '">' +
        block.icon + ' ' + block.activity + '</div></div>';
    });
    html += '</div>';

    // === HABIT TRACKER ===
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="font-size:14px">🔥 Habits</h3>' +
      '<span style="font-size:12px;color:var(--accent);font-weight:600">' + dayLog.habitsCompleted.length + ' / ' + habits.length + '</span></div>';

    habits.forEach(function (habit) {
      var isDone = dayLog.habitsCompleted.indexOf(habit.id) >= 0;
      var streak = BL.Store.getHabitStreak(habit.id);
      html += '<div data-action="toggle-habit" data-id="' + habit.id + '" style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid ' + (isDone ? 'rgba(34,197,94,0.3)' : 'var(--border)') + ';background:' + (isDone ? 'var(--accent-glow)' : 'var(--card)') + ';border-radius:10px;margin-bottom:8px;cursor:pointer">' +
        '<div style="width:32px;height:32px;border-radius:50%;border:2px solid ' + (isDone ? 'var(--accent)' : 'var(--border)') + ';display:flex;align-items:center;justify-content:center;font-size:14px;background:' + (isDone ? 'var(--accent)' : 'transparent') + ';color:' + (isDone ? '#000' : '') + ';flex-shrink:0">' + (isDone ? '✓' : '') + '</div>' +
        '<div style="flex:1">' +
        '<div style="font-size:14px;font-weight:600;' + (isDone ? 'text-decoration:line-through;color:var(--text-dim)' : '') + '">' + habit.icon + ' ' + habit.name + '</div></div>' +
        (streak > 0 ? '<div style="font-size:11px;color:var(--accent);font-weight:700">🔥 ' + streak + 'd</div>' : '') + '</div>';
    });

    html += '<button data-action="show-add-habit" style="width:100%;background:var(--card-hover);border:1px dashed var(--border);color:var(--text-muted);padding:12px;border-radius:10px;font-size:13px;cursor:pointer;font-family:inherit;margin-top:4px">+ Add New Habit</button></div>';

    // === MORNING ROUTINE ===
    var morningDone = dayLog.routinesDone.morning || [];
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="font-size:14px">🌅 Morning Routine</h3>' +
      '<span style="font-size:12px;color:var(--text-muted);font-weight:600">' + morningDone.length + ' / ' + routines.morning.length + '</span></div>';

    routines.morning.forEach(function (step) {
      var isDone = morningDone.indexOf(step.id) >= 0;
      html += '<div data-action="toggle-routine" data-type="morning" data-id="' + step.id + '" style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid var(--border);cursor:pointer">' +
        '<div style="width:24px;height:24px;border-radius:50%;border:2px solid ' + (isDone ? 'var(--accent)' : 'var(--border)') + ';display:flex;align-items:center;justify-content:center;font-size:11px;background:' + (isDone ? 'var(--accent)' : 'transparent') + ';color:' + (isDone ? '#000' : '') + ';flex-shrink:0">' + (isDone ? '✓' : '') + '</div>' +
        '<span style="font-size:14px;' + (isDone ? 'text-decoration:line-through;color:var(--text-muted)' : '') + '">' + step.text + '</span></div>';
    });
    html += '</div>';

    // === NIGHT ROUTINE ===
    var nightDone = dayLog.routinesDone.night || [];
    html += '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
      '<h3 style="font-size:14px">🌙 Night Routine</h3>' +
      '<span style="font-size:12px;color:var(--text-muted);font-weight:600">' + nightDone.length + ' / ' + routines.night.length + '</span></div>';

    routines.night.forEach(function (step) {
      var isDone = nightDone.indexOf(step.id) >= 0;
      html += '<div data-action="toggle-routine" data-type="night" data-id="' + step.id + '" style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid var(--border);cursor:pointer">' +
        '<div style="width:24px;height:24px;border-radius:50%;border:2px solid ' + (isDone ? 'var(--accent)' : 'var(--border)') + ';display:flex;align-items:center;justify-content:center;font-size:11px;background:' + (isDone ? 'var(--accent)' : 'transparent') + ';color:' + (isDone ? '#000' : '') + ';flex-shrink:0">' + (isDone ? '✓' : '') + '</div>' +
        '<span style="font-size:14px;' + (isDone ? 'text-decoration:line-through;color:var(--text-muted)' : '') + '">' + step.text + '</span></div>';
    });
    html += '</div>';

    // === TASK LIST ===
    html += '<div class="card">' +
      '<h3 style="font-size:14px;margin-bottom:12px">✅ Tasks</h3>';

    // Add task input
    html += '<div style="display:flex;gap:8px;margin-bottom:12px">' +
      '<input id="taskInput" class="input-field" placeholder="Add a task..." style="flex:1;font-size:14px;padding:10px">' +
      '<button data-action="add-task" style="background:var(--accent);color:#000;border:none;padding:10px 16px;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;font-size:13px">Add</button></div>';

    // Task list
    var tasks = dayLog.tasks || [];
    var pendingTasks = tasks.filter(function (t) { return !t.done; });
    var doneTasks = tasks.filter(function (t) { return t.done; });

    pendingTasks.forEach(function (task) {
      html += '<div style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid var(--border)">' +
        '<div data-action="toggle-task" data-id="' + task.id + '" style="width:24px;height:24px;border-radius:50%;border:2px solid var(--border);cursor:pointer;flex-shrink:0"></div>' +
        '<span style="flex:1;font-size:14px">' + task.text + '</span>' +
        '<button data-action="remove-task" data-id="' + task.id + '" style="background:none;border:none;color:var(--text-muted);font-size:16px;cursor:pointer;padding:4px">×</button></div>';
    });

    if (doneTasks.length > 0) {
      html += '<div style="margin-top:8px;font-size:11px;color:var(--text-muted);font-weight:700;text-transform:uppercase;margin-bottom:4px">Completed</div>';
      doneTasks.forEach(function (task) {
        html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 10px">' +
          '<div data-action="toggle-task" data-id="' + task.id + '" style="width:24px;height:24px;border-radius:50%;border:2px solid var(--accent);background:var(--accent);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;font-size:11px;color:#000">✓</div>' +
          '<span style="flex:1;font-size:14px;text-decoration:line-through;color:var(--text-muted)">' + task.text + '</span>' +
          '<button data-action="remove-task" data-id="' + task.id + '" style="background:none;border:none;color:var(--text-muted);font-size:16px;cursor:pointer;padding:4px">×</button></div>';
      });
    }

    if (tasks.length === 0) {
      html += '<div style="text-align:center;padding:16px;color:var(--text-muted);font-size:13px">No tasks yet. Add one above!</div>';
    }
    html += '</div>';

    // === EDUCATIONAL TIP ===
    html += '<div class="card" style="border-color:rgba(34,197,94,0.15);background:var(--accent-glow)">' +
      '<div style="font-size:10px;color:var(--text-muted);font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">Did You Know?</div>' +
      '<p style="font-size:13px;color:var(--text-dim);line-height:1.6">' + BL.Coach.getDailyFact() + '</p></div>';

    return html;
  }
};

// === SCHEDULE HELPERS ===
function getScheduleBlocks(profile) {
  var wake = parseInt((profile.wakeTime || '09:00').split(':')[0]);
  return [
    { start: wake, end: wake + 1, activity: 'Wake up, water, supplements', icon: '☀️' },
    { start: wake + 1, end: wake + 2, activity: 'Morning routine + breakfast', icon: '🌅' },
    { start: wake + 2, end: 12, activity: 'Work / Productive time', icon: '✂️' },
    { start: 12, end: 13, activity: 'Lunch break', icon: '🥗' },
    { start: 13, end: 17, activity: 'Work / Afternoon shift', icon: '✂️' },
    { start: 17, end: 18, activity: 'Dinner', icon: '🍽️' },
    { start: 18, end: 19, activity: 'Exercise / Walk', icon: '🚶' },
    { start: 19, end: 22, activity: 'Free time / Relax', icon: '📱' },
    { start: 22, end: 23, activity: 'Wind down', icon: '😌' },
    { start: 23, end: 25, activity: 'Night routine + sleep', icon: '🌙' }
  ];
}

function formatHour(h) {
  if (h >= 24) h -= 24;
  var suffix = h >= 12 ? 'PM' : 'AM';
  var display = h > 12 ? h - 12 : (h === 0 ? 12 : h);
  return display + ' ' + suffix;
}
