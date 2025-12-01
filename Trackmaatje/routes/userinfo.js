const express = require("express");
const router = express.Router();
const UserInfo = require("../models/userinfo");
const User = require("../models/users");


router.get("/foodplan", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const user = await User.findById(req.session.userId).lean();

    console.log(user);
    

    const info = await UserInfo.findOne({ user: req.session.userId })
      .sort({ date: -1 })
      .lean();

    if (!info) {
      return res.redirect("/userinfo"); 
    }

 
    const plan = createFoodPlan(info);


    res.render("foodplan", {
      title: "Food Plan",
      user,
      info,
      plan,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


router.post("/userinfo", async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) return res.status(401).send("Not logged in");

    const { age, weight, height, activitylevel, goal } = req.body;

    await UserInfo.create({
      user: userId,
      age,
      weight,
      length: height,
      activitylevel,
      date: new Date(),
      goal,
      streak: 0,
    });

    console.log("User info saved");
    res.redirect("/foodplan");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving user info");
  }
});


router.post("/userinfo/update", async (req, res) => {
  try {
    const userId = req.session.userId;

    const updated = await UserInfo.findOneAndUpdate(
      { user: userId },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ---------- DELETE INFO ----------
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.session.userId;

    const deleted = await UserInfo.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deleted)
      return res.status(404).json({ error: "Entry not found" });

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// ---------- FOOD PLAN CALCULATION ----------
function createFoodPlan(info, gender = "male") {
  const { weight, length, age, activitylevel, goal } = info;

  // 1. BMR
  let BMR;
  if (gender === "male") {
    BMR = 10 * weight + 6.25 * length - 5 * age + 5;
  } else {
    BMR = 10 * weight + 6.25 * length - 5 * age - 161;
  }

  // 2. Activity multiplier
  const multiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryactive: 1.9,
  }[activitylevel.toLowerCase()] || 1.55;

  const TDEE = BMR * multiplier;

  // 3. Goal adjustments
  let calories = TDEE;
  if (goal === "lose") calories -= 350;
  if (goal === "gain") calories += 350;

  calories = Math.round(calories);

  // 4. Macros
  const protein = Math.round(weight * 2);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return {
    TDEE: Math.round(TDEE),
    calories,
    protein,
    carbs,
    fats: fat,
  };
}

module.exports = router;
