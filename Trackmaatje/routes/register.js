const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

router.get("/register", (req, res) => {
    res.render("register", { title: "Register" });
});

router.post("/createUser", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        console.log("User registered!");
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error registering user");
    }
});
module.exports = router;