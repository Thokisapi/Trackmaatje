async function loadFoods() {
  const res = await fetch("/foodsToday");
  const foods = await res.json();

  const meals = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snack: [],
    unknown: [],
  };

  foods.forEach(f => {
    const type = f.type || "unknown";
    meals[type].push(f);
  });

  updateMealTables(meals);
  updateDailyTotals(foods);
}

function updateDailyTotals(foods) {
  let protein = 0, carbs = 0, fats = 0, calories = 0;

  foods.forEach(f => {
    protein += f.proteins;
    carbs += f.carbs;
    fats += f.fats;
    calories += f.calories;
  });

  document.getElementById("dailyProtein").textContent = protein;
  document.getElementById("dailyCarbs").textContent = carbs;
  document.getElementById("dailyFats").textContent = fats;
  document.getElementById("dailyCalories").textContent = calories;
}