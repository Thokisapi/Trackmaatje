const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");


router.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User not found");
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(400).send("Incorrect password");
        }
        
        req.session.userId = user._id;
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).send("Login error");
    }
});

module.exports = router;