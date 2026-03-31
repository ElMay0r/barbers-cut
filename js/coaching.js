// ============================================
// BetterLife — Coaching Engine
// ============================================
window.BL = window.BL || {};

BL.Coach = {
  // Time-aware greeting based on user's wake/bed schedule
  getGreeting: function (profile) {
    var now = new Date();
    var hour = now.getHours();
    var name = profile.name || 'friend';

    // Parse wake time
    var wakeParts = (profile.wakeTime || '09:00').split(':');
    var wakeHour = parseInt(wakeParts[0]);

    // Parse bed time
    var bedParts = (profile.bedTime || '00:30').split(':');
    var bedHour = parseInt(bedParts[0]);
    if (bedHour < 6) bedHour += 24; // normalize past-midnight bedtimes

    var normalizedHour = hour < 6 ? hour + 24 : hour;

    if (normalizedHour >= bedHour) {
      return { text: 'Still up? Get some rest, ' + name, icon: '🌙' };
    } else if (hour < wakeHour && hour >= 5) {
      return { text: 'Up early! Great start, ' + name, icon: '🌅' };
    } else if (hour >= wakeHour && hour < wakeHour + 2) {
      return { text: 'Good morning, ' + name, icon: '☀️' };
    } else if (hour >= wakeHour + 2 && hour < 17) {
      return { text: 'Keep it going, ' + name, icon: '💪' };
    } else if (hour >= 17 && hour < 21) {
      return { text: 'Evening check-in, ' + name, icon: '🌆' };
    } else {
      return { text: 'Winding down, ' + name, icon: '😌' };
    }
  },

  // Returns the single most important action right now
  getDoThisNow: function (dayLog, profile, hour) {
    var wakeParts = (profile.wakeTime || '09:00').split(':');
    var wakeHour = parseInt(wakeParts[0]);

    // Morning window (just woke up)
    if (hour >= wakeHour && hour < wakeHour + 1) {
      if (dayLog.water < 1) {
        return { text: 'Start your day with a glass of water', icon: '💧', action: 'water' };
      }
      if (!dayLog.supplements.probiotic || !dayLog.supplements.vitamin) {
        return { text: 'Take your morning supplements', icon: '💊', action: 'supps' };
      }
      if (dayLog.routinesDone.morning.length < (BL.Store.getRoutines().morning.length || 5)) {
        return { text: 'Complete your morning routine', icon: '🌅', action: 'routine' };
      }
    }

    // Breakfast time
    if (hour >= wakeHour + 1 && hour < 11) {
      if (dayLog.meals.length === 0) {
        return { text: 'Time for breakfast — fuel up for the day', icon: '🍳', action: 'meal' };
      }
    }

    // Midday — hydration check
    if (hour >= 11 && hour < 14) {
      var expectedWater = Math.floor((hour - wakeHour) / 1.5);
      if (dayLog.water < expectedWater) {
        return { text: 'You\'re behind on water — drink a glass now', icon: '💧', action: 'water' };
      }
      if (dayLog.meals.length < 1) {
        return { text: 'Don\'t skip lunch — pick a healthy swap', icon: '🥗', action: 'meal' };
      }
    }

    // Afternoon
    if (hour >= 14 && hour < 17) {
      if (dayLog.meals.length < 2) {
        return { text: 'You need at least 2 meals logged — eat something', icon: '🍽️', action: 'meal' };
      }
      if (dayLog.water < 5) {
        return { text: 'Drink up! You need at least 5 glasses by now', icon: '💧', action: 'water' };
      }
    }

    // Dinner window
    if (hour >= 17 && hour < 20) {
      if (dayLog.meals.length < 2) {
        return { text: 'Log your dinner — check the smart swaps', icon: '🌙', action: 'meal' };
      }
      if (dayLog.exercises.length === 0) {
        return { text: 'Get some movement in — even a 15 min walk counts', icon: '🚶', action: 'exercise' };
      }
    }

    // Evening wind-down
    if (hour >= 20 && hour < 23) {
      if (!dayLog.sleep.bedTime && !dayLog.sleep.wakeTime) {
        return { text: 'Log last night\'s sleep before you forget', icon: '😴', action: 'sleep' };
      }
      if (dayLog.water < 8) {
        return { text: 'Finish your water goal — ' + (10 - dayLog.water) + ' glasses to go', icon: '💧', action: 'water' };
      }
      if (dayLog.routinesDone.night.length === 0) {
        return { text: 'Start your night routine — wind down properly', icon: '🌙', action: 'routine' };
      }
    }

    // Late night
    if (hour >= 23 || hour < 5) {
      return { text: 'Head to bed soon — sleep is your best tool', icon: '💤', action: 'sleep' };
    }

    // Default fallback
    var score = BL.Store.getDailyScore();
    if (score < 50) {
      return { text: 'You\'re at ' + score + '% — keep checking things off!', icon: '📈', action: null };
    }
    return { text: 'Great progress today! Keep it up', icon: '🎯', action: null };
  },

  // Get today's rotating tip
  getDailyTip: function () {
    var tips = BL.Data.DAILY_TIPS;
    var dayOfYear = getDayOfYear();
    var index = dayOfYear % tips.length;
    return tips[index];
  },

  // Get today's health fact
  getDailyFact: function () {
    var facts = BL.Data.HEALTH_FACTS;
    var dayOfYear = getDayOfYear();
    // Offset so it's different from the tip
    var index = (dayOfYear + 7) % facts.length;
    return facts[index];
  },

  // Contextual motivation based on daily progress
  getMotivation: function (dayLog) {
    var score = BL.Store.getDailyScore();

    if (score >= 90) return { text: 'You\'re crushing it today! Almost perfect!', color: 'var(--accent)' };
    if (score >= 70) return { text: 'Strong day! You\'re ahead of the game.', color: 'var(--accent)' };
    if (score >= 50) return { text: 'Halfway there — keep the momentum going.', color: 'var(--yellow)' };
    if (score >= 25) return { text: 'Every action counts. What can you do next?', color: 'var(--yellow)' };
    return { text: 'Start small — one glass of water, one logged meal. You got this.', color: 'var(--text-dim)' };
  }
};

function getDayOfYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
