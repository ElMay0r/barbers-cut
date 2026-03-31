// ============================================
// BetterLife — Static Data Module
// ============================================
window.BL = window.BL || {};

BL.Data = {
  // === NAVIGATION TABS ===
  TABS: [
    { id: 'today', label: 'Today', icon: '📍' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'body', label: 'Body', icon: '💪' },
    { id: 'routine', label: 'Routine', icon: '📋' },
    { id: 'me', label: 'Me', icon: '📊' }
  ],

  // === WORK DAY MEALS (Tue-Sun) ===
  WORK_MEALS: [
    {
      id: 'morning', timeStart: 0, timeEnd: 11, label: '☕ Morning (Before 11 AM)',
      current: { name: "Dunkin' Latte", cals: 350, protein: 8, carbs: 56, fat: 10, sugar: '48g' },
      swaps: [
        { name: "Dunkin' Iced Coffee w/ Cream", cals: 50, protein: 1, carbs: 2, fat: 4, sugar: '0g', tip: 'No swirl, no liquid sugar. Save 300 cals.', difficulty: '🟢 Easy' },
        { name: "Dunkin' Wake-Up Wrap", cals: 180, protein: 10, carbs: 14, fat: 9, sugar: '1g', tip: 'Eat with unsweetened coffee. Fast & solid.', difficulty: '🟢 Easy' }
      ]
    },
    {
      id: 'lunch', timeStart: 11, timeEnd: 16, label: '🥙 Mid-Day (11 AM - 4 PM)',
      current: { name: 'Fried Wrap / Hero', cals: 780, protein: 35, carbs: 62, fat: 42, sugar: '8g' },
      swaps: [
        { name: 'Deli Grilled Chicken Salad', cals: 380, protein: 38, carbs: 12, fat: 18, sugar: '2g', tip: 'Oil & vinegar. Same speed as a wrap.', difficulty: '🟢 Easy' },
        { name: 'Chick-fil-A Grilled Nuggets (12)', cals: 310, protein: 38, carbs: 16, fat: 10, sugar: '3g', tip: 'Plus side salad = top tier fast food cut.', difficulty: '🟢 Easy' }
      ]
    },
    {
      id: 'dinner', timeStart: 16, timeEnd: 24, label: '🌙 Dinner (After 4 PM)',
      current: { name: 'McD/Pizza/UberEats', cals: 1100, protein: 35, carbs: 110, fat: 55, sugar: '30g' },
      swaps: [
        { name: '2 McChickens (No Mayo)', cals: 530, protein: 28, carbs: 62, fat: 18, sugar: '6g', tip: 'Skip fries/soda. Save ~600 cals vs Big Mac meal.', difficulty: '🟢 Easy' },
        { name: 'Pizza: 2 Slices + Side Salad', cals: 580, protein: 24, carbs: 64, fat: 24, sugar: '8g', tip: 'Eat salad BEFORE pizza. Stop at 2 slices.', difficulty: '🟡 Medium' }
      ]
    }
  ],

  // === MONDAY PREP DAY MEALS ===
  MONDAY_MEALS: [
    { time: 8, label: '8:00 AM', name: 'Oatmeal + Almonds + Coffee', cals: 340, p: 14, c: 44, f: 13, info: 'Oats, almonds, cinnamon.' },
    { time: 10, label: '10:00 AM', name: '💊 Probiotic + Multivitamin', cals: 0, p: 0, c: 0, f: 0, info: 'Take with full glass of water.' },
    { time: 11, label: '11:00 AM', name: 'Scrambled Eggs + Spinach', cals: 280, p: 22, c: 4, f: 18, info: '3 eggs in olive oil.' },
    { time: 14, label: '2:00 PM', name: 'Grilled Chicken + Spinach Salad', cals: 400, p: 46, c: 6, f: 20, info: '6oz chicken. Bulk cook now!' },
    { time: 17, label: '5:00 PM', name: 'Greek Yogurt + Almonds', cals: 180, p: 20, c: 8, f: 7, info: 'Quick and clean.' },
    { time: 19, label: '7:30 PM', name: 'Chicken + Eggs', cals: 380, p: 40, c: 18, f: 14, info: 'Leftovers.' }
  ],

  // === DAILY TIPS (rotating) ===
  DAILY_TIPS: [
    { icon: '💧', text: 'Drinking water before a meal can reduce how much you eat by up to 22%. Fill up before you eat.' },
    { icon: '🏋️', text: 'Standing all day burns ~100 more calories than sitting. Your job already gives you an advantage.' },
    { icon: '🥩', text: 'Protein keeps you full longest. Aim for protein at every meal to reduce cravings.' },
    { icon: '😴', text: 'Poor sleep raises ghrelin (hunger hormone) by 28%. Sleep is a weight loss tool.' },
    { icon: '🧠', text: 'It takes 20 minutes for your brain to register fullness. Eat slower to eat less.' },
    { icon: '🍬', text: 'Liquid calories (soda, lattes, juice) are invisible calories. Your body doesn\'t register them as food.' },
    { icon: '🚶', text: 'A 30-minute walk burns ~150 calories and reduces stress hormones. Walk after dinner.' },
    { icon: '💪', text: 'Muscle burns more calories at rest than fat. Even light strength training helps long-term.' },
    { icon: '🥗', text: 'Eating a salad before your main meal fills you with fiber first. You\'ll eat less of the heavy stuff.' },
    { icon: '⏰', text: 'Consistency beats perfection. Eating at regular times trains your hunger signals.' },
    { icon: '🥚', text: 'Eggs are one of the most filling foods per calorie. Keep boiled eggs ready to grab.' },
    { icon: '📱', text: 'People who track their food lose twice as much weight as those who don\'t. Logging works.' },
    { icon: '🧘', text: 'Stress triggers cortisol, which promotes fat storage around your belly. Take 5 deep breaths.' },
    { icon: '🍎', text: 'Fiber slows digestion and keeps blood sugar stable. Aim for vegetables at every meal.' },
    { icon: '🌙', text: 'Late-night eating isn\'t bad because of the time — it\'s bad because you make worse food choices tired.' },
    { icon: '☕', text: 'Black coffee has nearly zero calories and boosts metabolism. Skip the sugar and flavored syrups.' },
    { icon: '🥜', text: 'Almonds are high in protein and healthy fat. A small handful keeps you going between clients.' },
    { icon: '🔄', text: 'Meal prep isn\'t about cooking fancy. It\'s about having the right food ready when you\'re too tired to choose well.' },
    { icon: '📊', text: 'A 500-calorie daily deficit equals ~1 lb lost per week. Small daily wins add up to big results.' },
    { icon: '🍗', text: 'Grilled chicken is your best friend. High protein, low fat, easy to prep in bulk.' },
    { icon: '💊', text: 'Probiotics support gut health, which affects mood, cravings, and digestion. Take them consistently.' },
    { icon: '🫁', text: '5 minutes of deep breathing lowers cortisol by 25%. Do this between clients.' },
    { icon: '🦴', text: 'Your body needs vitamin D for bone health, mood, and immunity. Get some sunlight or take your multi.' },
    { icon: '🍕', text: 'You don\'t have to avoid pizza forever. 2 slices with a salad is a reasonable meal. No guilt needed.' },
    { icon: '💤', text: 'Your body repairs muscle and burns fat during deep sleep. Prioritize 7+ hours.' },
    { icon: '🧊', text: 'Drinking cold water may slightly boost metabolism as your body warms it up. Every bit counts.' },
    { icon: '🎯', text: 'Focus on the process (logging, prepping, moving), not the scale. The weight follows the habits.' },
    { icon: '🤸', text: 'Stretching for just 10 minutes improves circulation and reduces the back pain from standing all day.' },
    { icon: '🥤', text: 'Replace one sugary drink per day with water. That alone can cut 10-15 lbs per year.' },
    { icon: '✅', text: 'You don\'t need to be perfect. An 80% day is still way better than a 0% day. Keep showing up.' }
  ],

  // === HEALTH FACTS ("Did you know?") ===
  HEALTH_FACTS: [
    'Your body is about 60% water. Even 2% dehydration affects your focus and energy.',
    'Muscle weighs more than fat by volume. The scale going up could mean you\'re getting healthier.',
    'Your gut bacteria influence cravings. Probiotics can help reduce sugar cravings over time.',
    'Walking 10,000 steps wasn\'t based on science — it was a Japanese marketing campaign. 7,000-8,000 is plenty.',
    'Sleeping less than 6 hours increases hunger hormones by up to 28% the next day.',
    'It takes about 66 days to form a new habit, not 21. Be patient with yourself.',
    'Your metabolism doesn\'t "break" from dieting. It adapts. Diet breaks every 8-12 weeks help.',
    'Protein requires 20-30% of its calories just to digest. Eating protein literally burns calories.',
    'Stress and poor sleep cause more weight gain than eating an extra snack. Address the root cause.',
    'Your body can only absorb about 25-40g of protein per meal. Spread it throughout the day.',
    'Fiber feeds your good gut bacteria. Think of vegetables as fuel for your internal ecosystem.',
    'A pound of fat is about 3,500 calories. A 500/day deficit = 1 lb/week. Math works.',
    'Dehydration is often mistaken for hunger. Drink water first when you feel a craving.',
    'Barbers stand 8-10 hours daily. That\'s already significant calorie burn — protect your joints with stretching.',
    'Your liver processes toxins better when you\'re hydrated. Water helps your body clean itself.',
    'Sugar doesn\'t directly cause diabetes, but excess sugar leads to insulin resistance over time.',
    'Omega-3 fatty acids reduce inflammation. Consider fatty fish or a fish oil supplement.',
    'Your brain uses 20% of your daily calories. Mental work is real work.',
    'Eating slowly gives leptin (fullness hormone) time to reach your brain. Chew more, eat less.',
    'The "best" diet is the one you can stick to. Consistency always beats intensity.'
  ],

  // === FREQUENT MEALS LIBRARY (for quick-add food logging) ===
  FREQUENT_MEALS: [
    { name: "Dunkin' Iced Coffee w/ Cream", cals: 50, p: 1, c: 2, f: 4, slot: 'morning' },
    { name: "Dunkin' Wake-Up Wrap", cals: 180, p: 10, c: 14, f: 9, slot: 'morning' },
    { name: "Dunkin' Latte", cals: 350, p: 8, c: 56, f: 10, slot: 'morning' },
    { name: 'Black Coffee', cals: 5, p: 0, c: 0, f: 0, slot: 'morning' },
    { name: 'Oatmeal + Almonds', cals: 340, p: 14, c: 44, f: 13, slot: 'morning' },
    { name: '2 Boiled Eggs', cals: 140, p: 12, c: 1, f: 10, slot: 'morning' },
    { name: 'Scrambled Eggs + Spinach', cals: 280, p: 22, c: 4, f: 18, slot: 'lunch' },
    { name: 'Deli Grilled Chicken Salad', cals: 380, p: 38, c: 12, f: 18, slot: 'lunch' },
    { name: 'Chick-fil-A Grilled Nuggets (12)', cals: 310, p: 38, c: 16, f: 10, slot: 'lunch' },
    { name: 'Fried Wrap / Hero', cals: 780, p: 35, c: 62, f: 42, slot: 'lunch' },
    { name: 'Turkey & Cheese Sandwich', cals: 420, p: 28, c: 38, f: 16, slot: 'lunch' },
    { name: 'Greek Yogurt + Almonds', cals: 180, p: 20, c: 8, f: 7, slot: 'snack' },
    { name: 'Handful of Almonds', cals: 160, p: 6, c: 6, f: 14, slot: 'snack' },
    { name: 'Protein Bar', cals: 220, p: 20, c: 24, f: 8, slot: 'snack' },
    { name: 'Banana', cals: 105, p: 1, c: 27, f: 0, slot: 'snack' },
    { name: 'Apple', cals: 95, p: 0, c: 25, f: 0, slot: 'snack' },
    { name: 'Grilled Chicken + Rice', cals: 450, p: 40, c: 42, f: 8, slot: 'dinner' },
    { name: 'Grilled Chicken + Spinach Salad', cals: 400, p: 46, c: 6, f: 20, slot: 'dinner' },
    { name: '2 McChickens (No Mayo)', cals: 530, p: 28, c: 62, f: 18, slot: 'dinner' },
    { name: 'Pizza: 2 Slices + Side Salad', cals: 580, p: 24, c: 64, f: 24, slot: 'dinner' },
    { name: "McD's Big Mac Meal", cals: 1100, p: 35, c: 110, f: 55, slot: 'dinner' },
    { name: 'Chicken + Eggs', cals: 380, p: 40, c: 18, f: 14, slot: 'dinner' },
    { name: 'Chipotle Bowl (Chicken)', cals: 660, p: 45, c: 55, f: 22, slot: 'dinner' },
    { name: 'Subway 6" Turkey', cals: 280, p: 18, c: 42, f: 4, slot: 'lunch' },
    { name: 'Rice + Beans', cals: 350, p: 12, c: 60, f: 4, slot: 'dinner' },
    { name: 'Pasta with Sauce', cals: 550, p: 16, c: 78, f: 14, slot: 'dinner' },
    { name: 'Steak (6oz) + Veggies', cals: 420, p: 42, c: 8, f: 22, slot: 'dinner' },
    { name: 'Glass of Water', cals: 0, p: 0, c: 0, f: 0, slot: 'any' }
  ],

  // === GROCERY LIST (for weekly prep) ===
  GROCERY_ITEMS: [
    { name: 'Chicken Breast (3 lbs)', category: 'Protein', checked: false },
    { name: 'Eggs (1 dozen)', category: 'Protein', checked: false },
    { name: 'Greek Yogurt (tub)', category: 'Dairy', checked: false },
    { name: 'Almonds (bag)', category: 'Snacks', checked: false },
    { name: 'Spinach (bag)', category: 'Produce', checked: false },
    { name: 'Oats (canister)', category: 'Pantry', checked: false },
    { name: 'Olive Oil', category: 'Pantry', checked: false },
    { name: 'Cinnamon', category: 'Pantry', checked: false },
    { name: 'Probiotic (Spring Valley)', category: 'Supplements', checked: false },
    { name: 'Multivitamin (Equate)', category: 'Supplements', checked: false }
  ],

  // === PREP TASKS ===
  PREP_TASKS: [
    { icon: '🍗', name: 'Bake 3 lbs Chicken', detail: 'Slice and pack into 5 containers. Takes ~25 min.' },
    { icon: '🥚', name: 'Boil 10 Eggs', detail: 'Peel and pack. Eat 2 immediately when you arrive home to prevent over-ordering delivery. Takes ~15 min.' },
    { icon: '🥜', name: 'Portion Almonds', detail: 'Make 7 small grab bags. Snack between clients.' }
  ]
};
