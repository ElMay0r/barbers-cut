// ============================================
// BetterLife — Data Persistence Layer
// ============================================
window.BL = window.BL || {};

BL.Store = (function () {
  const STORAGE_KEY = 'bl_data';

  // Default schema
  function getDefaults() {
    return {
      _version: 1,
      _lastUpdated: new Date().toISOString(),
      profile: {
        name: '',
        age: 25,
        weight: 180,
        height: 70,
        goalWeight: 165,
        activityLevel: 'moderate',
        wakeTime: '09:00',
        bedTime: '00:30',
        notes: '',
        macros: { p: 150, c: 120, f: 50 },
        calorieTarget: 0,
        tdee: 0,
        createdAt: new Date().toISOString()
      },
      days: {},
      weightLog: [],
      habits: [
        { id: 'h1', name: 'Drink 10 glasses water', icon: '💧', active: true, createdAt: new Date().toISOString() },
        { id: 'h2', name: 'Take supplements', icon: '💊', active: true, createdAt: new Date().toISOString() },
        { id: 'h3', name: 'Exercise or stretch', icon: '🏋️', active: true, createdAt: new Date().toISOString() },
        { id: 'h4', name: 'Eat a healthy meal', icon: '🥗', active: true, createdAt: new Date().toISOString() },
        { id: 'h5', name: 'Log all meals', icon: '📝', active: true, createdAt: new Date().toISOString() }
      ],
      mealLibrary: [],
      routines: {
        morning: [
          { id: 'mr1', text: 'Drink a glass of water', order: 0 },
          { id: 'mr2', text: 'Take supplements', order: 1 },
          { id: 'mr3', text: 'Stretch for 5 minutes', order: 2 },
          { id: 'mr4', text: 'Eat breakfast', order: 3 },
          { id: 'mr5', text: 'Review today\'s plan', order: 4 }
        ],
        night: [
          { id: 'nr1', text: 'Set out tomorrow\'s clothes', order: 0 },
          { id: 'nr2', text: 'Brush teeth', order: 1 },
          { id: 'nr3', text: 'No phone 30 min before bed', order: 2 },
          { id: 'nr4', text: 'Lights out by midnight', order: 3 }
        ]
      },
      milestones: [],
      settings: {
        unitSystem: 'imperial',
        coachingEnabled: true
      }
    };
  }

  // Default day log structure
  function createDayLog(dateStr) {
    return {
      date: dateStr,
      water: 0,
      supplements: { probiotic: false, vitamin: false },
      meals: [],
      exercises: [],
      steps: 0,
      sleep: { bedTime: '', wakeTime: '', quality: 0, duration: 0 },
      habitsCompleted: [],
      routinesDone: { morning: [], night: [] },
      tasks: []
    };
  }

  // === MIGRATION from old bc_* keys ===
  function migrateFromOldFormat() {
    const oldProfile = localStorage.getItem('bc_profile');
    if (!oldProfile && !localStorage.getItem('bc_water')) return null;

    var defaults = getDefaults();
    var data = JSON.parse(JSON.stringify(defaults));

    // Migrate profile
    if (oldProfile) {
      try {
        var p = JSON.parse(oldProfile);
        data.profile.age = p.age || 25;
        data.profile.weight = p.weight || 180;
        data.profile.height = p.height || 70;
        data.profile.goalWeight = p.target || 165;
        data.profile.notes = p.notes || '';
        if (p.macros) {
          data.profile.macros = { p: p.macros.p || 150, c: p.macros.c || 120, f: p.macros.f || 50 };
        }
      } catch (e) { /* ignore parse errors */ }
    }

    // Migrate today's daily data
    var todayStr = getTodayStr();
    var dayLog = createDayLog(todayStr);
    dayLog.water = parseInt(localStorage.getItem('bc_water') || '0');
    dayLog.supplements.probiotic = localStorage.getItem('bc_prob') === 'true';
    dayLog.supplements.vitamin = localStorage.getItem('bc_vit') === 'true';
    data.days[todayStr] = dayLog;

    // Calculate TDEE
    data.profile.tdee = calculateTDEE(data.profile.weight, data.profile.height, data.profile.age, data.profile.activityLevel);
    data.profile.calorieTarget = data.profile.tdee - 500;

    // Clean up old keys
    localStorage.removeItem('bc_profile');
    localStorage.removeItem('bc_water');
    localStorage.removeItem('bc_prob');
    localStorage.removeItem('bc_vit');
    localStorage.removeItem('bc_date');

    return data;
  }

  // === CORE FUNCTIONS ===
  function getTodayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  function calculateTDEE(weightLbs, heightInches, age, activityLevel) {
    var weightKg = weightLbs * 0.453592;
    var heightCm = heightInches * 2.54;
    var bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    var multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    return Math.round(bmr * (multipliers[activityLevel] || 1.55));
  }

  // === DATA ACCESS ===
  var _data = null;

  function load() {
    if (_data) return _data;

    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        _data = JSON.parse(raw);
      } catch (e) {
        _data = null;
      }
    }

    if (!_data) {
      // Try migrating from old format
      _data = migrateFromOldFormat();
      if (!_data) {
        _data = getDefaults();
      }
      save();
    }

    // Ensure today's day log exists
    var todayStr = getTodayStr();
    if (!_data.days[todayStr]) {
      _data.days[todayStr] = createDayLog(todayStr);
      save();
    }

    return _data;
  }

  function save() {
    if (!_data) return;
    _data._lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_data));
  }

  // === PUBLIC API ===
  return {
    load: load,
    save: save,
    getTodayStr: getTodayStr,
    generateId: generateId,
    calculateTDEE: calculateTDEE,

    getProfile: function () {
      return load().profile;
    },

    saveProfile: function (updates) {
      var data = load();
      Object.assign(data.profile, updates);
      data.profile.tdee = calculateTDEE(data.profile.weight, data.profile.height, data.profile.age, data.profile.activityLevel);
      data.profile.calorieTarget = data.profile.tdee - 500;
      save();
    },

    getToday: function () {
      var data = load();
      var todayStr = getTodayStr();
      if (!data.days[todayStr]) {
        data.days[todayStr] = createDayLog(todayStr);
        save();
      }
      return data.days[todayStr];
    },

    getDay: function (dateStr) {
      var data = load();
      return data.days[dateStr] || null;
    },

    // Water
    setWater: function (count) {
      var day = this.getToday();
      day.water = Math.max(0, Math.min(10, count));
      save();
    },

    // Supplements
    toggleSupplement: function (type) {
      var day = this.getToday();
      day.supplements[type] = !day.supplements[type];
      save();
      return day.supplements[type];
    },

    // Meals
    logMeal: function (meal) {
      var day = this.getToday();
      meal.id = meal.id || generateId();
      meal.time = meal.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      day.meals.push(meal);
      save();
      return meal;
    },

    removeMeal: function (mealId) {
      var day = this.getToday();
      day.meals = day.meals.filter(function (m) { return m.id !== mealId; });
      save();
    },

    getTodayNutrition: function () {
      var day = this.getToday();
      var totals = { cals: 0, p: 0, c: 0, f: 0 };
      day.meals.forEach(function (m) {
        totals.cals += (m.cals || 0);
        totals.p += (m.p || 0);
        totals.c += (m.c || 0);
        totals.f += (m.f || 0);
      });
      return totals;
    },

    // Weight
    logWeight: function (weight, note) {
      var data = load();
      var todayStr = getTodayStr();
      // Update or add today's entry
      var existing = data.weightLog.findIndex(function (w) { return w.date === todayStr; });
      if (existing >= 0) {
        data.weightLog[existing].weight = weight;
        data.weightLog[existing].note = note || '';
      } else {
        data.weightLog.push({ date: todayStr, weight: weight, note: note || '' });
      }
      // Also update profile current weight
      data.profile.weight = weight;
      save();
    },

    getWeightHistory: function (days) {
      var data = load();
      var log = data.weightLog.slice();
      log.sort(function (a, b) { return a.date.localeCompare(b.date); });
      if (days) return log.slice(-days);
      return log;
    },

    // Exercise
    logExercise: function (exercise) {
      var day = this.getToday();
      exercise.id = exercise.id || generateId();
      exercise.time = exercise.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      day.exercises.push(exercise);
      save();
    },

    // Steps
    setSteps: function (count) {
      var day = this.getToday();
      day.steps = Math.max(0, count);
      save();
    },

    // Sleep
    logSleep: function (bedTime, wakeTime, quality) {
      var day = this.getToday();
      day.sleep.bedTime = bedTime;
      day.sleep.wakeTime = wakeTime;
      day.sleep.quality = quality;
      // Calculate duration in minutes
      if (bedTime && wakeTime) {
        var bed = parseTime(bedTime);
        var wake = parseTime(wakeTime);
        var diff = wake - bed;
        if (diff < 0) diff += 24 * 60; // crossed midnight
        day.sleep.duration = diff;
      }
      save();
    },

    // Habits
    getHabits: function () {
      return load().habits.filter(function (h) { return h.active; });
    },

    toggleHabit: function (habitId) {
      var day = this.getToday();
      var idx = day.habitsCompleted.indexOf(habitId);
      if (idx >= 0) {
        day.habitsCompleted.splice(idx, 1);
      } else {
        day.habitsCompleted.push(habitId);
      }
      save();
    },

    addHabit: function (name, icon) {
      var data = load();
      var habit = { id: generateId(), name: name, icon: icon || '✅', active: true, createdAt: new Date().toISOString() };
      data.habits.push(habit);
      save();
      return habit;
    },

    getHabitStreak: function (habitId) {
      var data = load();
      var streak = 0;
      var d = new Date();
      while (true) {
        var dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        var dayLog = data.days[dateStr];
        if (dayLog && dayLog.habitsCompleted && dayLog.habitsCompleted.indexOf(habitId) >= 0) {
          streak++;
          d.setDate(d.getDate() - 1);
        } else {
          // Allow today to not be completed yet (don't break streak)
          if (streak === 0 && dateStr === getTodayStr()) {
            d.setDate(d.getDate() - 1);
            continue;
          }
          break;
        }
      }
      return streak;
    },

    // Routines
    getRoutines: function () {
      return load().routines;
    },

    toggleRoutineStep: function (routineType, stepId) {
      var day = this.getToday();
      var arr = day.routinesDone[routineType] || [];
      var idx = arr.indexOf(stepId);
      if (idx >= 0) {
        arr.splice(idx, 1);
      } else {
        arr.push(stepId);
      }
      day.routinesDone[routineType] = arr;
      save();
    },

    // Tasks
    addTask: function (text, priority) {
      var day = this.getToday();
      var task = { id: generateId(), text: text, priority: priority || 'medium', done: false };
      day.tasks.push(task);
      save();
      return task;
    },

    toggleTask: function (taskId) {
      var day = this.getToday();
      var task = day.tasks.find(function (t) { return t.id === taskId; });
      if (task) {
        task.done = !task.done;
        save();
      }
    },

    removeTask: function (taskId) {
      var day = this.getToday();
      day.tasks = day.tasks.filter(function (t) { return t.id !== taskId; });
      save();
    },

    // Daily score calculation (0-100)
    getDailyScore: function () {
      var day = this.getToday();
      var habits = this.getHabits();
      var routines = this.getRoutines();
      var score = 0;

      // Water: 10 pts (proportional to 10 glasses)
      score += (day.water / 10) * 10;

      // Supplements: 10 pts (5 each)
      if (day.supplements.probiotic) score += 5;
      if (day.supplements.vitamin) score += 5;

      // Meals logged: 20 pts (at least 2 meals = full points)
      var mealPts = Math.min(day.meals.length / 2, 1) * 20;
      score += mealPts;

      // Exercise: 15 pts (any exercise logged)
      if (day.exercises.length > 0) score += 15;

      // Sleep logged: 10 pts
      if (day.sleep.bedTime && day.sleep.wakeTime) score += 10;

      // Habits: 20 pts (proportional to habits completed)
      if (habits.length > 0) {
        var habitsDone = day.habitsCompleted.length;
        score += (habitsDone / habits.length) * 20;
      } else {
        score += 20; // no habits defined = full points
      }

      // Routines: 15 pts (7.5 each for morning and night)
      var morningSteps = routines.morning.length;
      var nightSteps = routines.night.length;
      if (morningSteps > 0) {
        score += (day.routinesDone.morning.length / morningSteps) * 7.5;
      } else {
        score += 7.5;
      }
      if (nightSteps > 0) {
        score += (day.routinesDone.night.length / nightSteps) * 7.5;
      } else {
        score += 7.5;
      }

      return Math.round(Math.min(100, score));
    },

    // Settings
    getSettings: function () {
      return load().settings;
    },

    // Data management
    exportData: function () {
      return JSON.stringify(load(), null, 2);
    },

    importData: function (json) {
      try {
        var imported = JSON.parse(json);
        if (!imported._version) throw new Error('Invalid data format');
        _data = imported;
        save();
        return true;
      } catch (e) {
        return false;
      }
    },

    resetAll: function () {
      _data = getDefaults();
      save();
    }
  };

  // Helper
  function parseTime(timeStr) {
    var parts = timeStr.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
})();
