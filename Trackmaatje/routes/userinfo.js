const express = require('express');
const router = express.Router();
const UserInfo = require('../models/userinfo');

router.get('/foodplan', (req, res) => {
    res.render('foodplan', { title: 'Food Plan' });
        const session = req.session;
        console.log(session);
        
});

router.post('/userinfo',  async (req, res) => {
     try {
    const userId = req.session.userId;
    console.log(userId);
    
    if (!userId) {
      return res.status(401).send("User not logged in");
    }
        const {age, weight, height, activitylevel, goal } = req.body;
        
        await UserInfo.create({
            user: userId,
            age: age,
            weight: weight,
            length: height,
            activitylevel: activitylevel,
            date: new Date(),
            goal: goal,
            streak: 0,
        });
        console.log('User info saved!');
        res.status(201).send('User info saved');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving user info');
        console.log(req.body);
        
        
    }
});

router.post('/userinfo/update',  async (req, res) => {
  const { weight, length, activitylevel, targetweight, date, calories } = req.body;

  try {
    const updatedInfo = await UserInfo.findOneAndUpdate(
      { user: req.user.id },
      { $set: { weight, length, activitylevel, targetweight, date, calories } },
      { new: true }
    );

    if (!updatedInfo) return res.status(404).json({ error: 'No user info found to update' });

    res.status(200).json(updatedInfo);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await UserInfo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;