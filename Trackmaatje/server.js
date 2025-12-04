const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "poep",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    }
  })
);


const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const userInfoRoute = require("./routes/userinfo");
const UserInfo = require("./models/userinfo");
const foodRoute = require("./routes/foods");

app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", userInfoRoute);
app.use("/", foodRoute);

app.get("/", async (req, res) => {  
  const userId = req.session.userId;  

  console.log("User ID:", userId);
  let plan = null;

  if (userId) {
    plan = await UserInfo.findOne({ user: userId })
      .sort({ date: -1 })
      .lean();
  }


  res.render("index", {
    title: "home",
    plan,
    userId,
    firstname: req.session.firstname || null,
  });
});


mongoose
  .connect("mongodb://localhost:27017/trackmaatje",{})
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
