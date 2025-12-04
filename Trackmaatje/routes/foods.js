const express = require("express");
const router = express.Router();
const foods = require("../models/foods");

router.post("/addFood", async (req, res) => {
  try {
    const userId = req.session.userId;
    
    const { foodItem, amount, type, protein, carbs, fats, calories } = req.body;
    await foods.create({
      user: userId,
      name: foodItem,
      amount: amount,
      type: type,
      proteins: protein,
      carbs: carbs,
      fats: fats,
      calories: calories,
    });
    console.log(req.body);
    console.log(userId, "added a food item" , foodItem);
    res.status(200).send("Food item added successfully");
    
  } catch (err) {
    console.error(err);
    console.log(req.body);
    res.status(500).send("Error adding food item");
  }
});

router.get("/foodsToday", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).send("Not logged in");

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const foodsToday = await foods.find({
      user: userId,
      createdAt: { $gte: start, $lte: end }
    });

    res.json(foodsToday);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching foods");
  }
});
module.exports = router;
