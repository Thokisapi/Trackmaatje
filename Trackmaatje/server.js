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

app.use("/", registerRoute);
app.use("/", loginRoute);
app.use("/", userInfoRoute);

app.get("/", (req, res) => {
  res.render("index",{ title: "home"});
});



mongoose
  .connect("mongodb://localhost:27017/trackmaatje",{})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
