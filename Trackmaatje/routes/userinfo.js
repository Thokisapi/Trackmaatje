const express = require("express");
const router = express.Router();
const UserInfo = require("../models/userinfo");


router.get("/foodplan", async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log(userId);
    
    if (!userId) return res.redirect("/login");
    const latestInfo = await UserInfo.findOne({ user: userId })
      .sort({ date: -1 })
      .lean();

    res.render("foodplan", {
      title: "Food Plan",
      plan: latestInfo || null,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading food plan");
  }
});


router.post("/userinfo", async (req, res) => {
  try {
    const userId = req.session.userId;
    const info = req.body

     const plan = createFoodPlan(info);
     console.log(plan);
     
    

    if (!userId) return res.status(401).send("Not logged in");

    const { age, weight, height, activitylevel, goal, } = req.body;

    await UserInfo.create({
      user: userId,
      age,
      weight,
      length: height,
      activitylevel,
      calories: plan.calories,
      fats: plan.fats,
      carbs: plan.carbs,
      proteins: plan.proteins,
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



function createFoodPlan(info, gender = "male") {
  const weight = Number(info.weight);
  const height = Number(info.height);
  const age = Number(info.age);
  const activitylevel = info.activitylevel;
  const goal = info.goal;

  let BMR;
  if (gender === "male") BMR = 10 * weight + 6.25 * height - 5 * age + 5;
  else BMR = 10 * weight + 6.25 * height - 5 * age - 161;

  const multiplier = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryactive: 1.9,
  }[activitylevel.toLowerCase()] || 1.55;

  const TDEE = BMR * multiplier;

  let calories = Math.round(goal === "lose" ? TDEE - 350 : goal === "gain" ? TDEE + 350 : TDEE);
  const proteins = Math.round(weight * 2);
  const fats = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - (proteins * 4 + fats * 9)) / 4);

  return { TDEE: Math.round(TDEE), calories, proteins, carbs, fats };
}


module.exports = router;
