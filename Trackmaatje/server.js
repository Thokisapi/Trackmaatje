const express = require("express");
const session = require("express-session");
const path = require("path");

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
  })
);

app.get("/", (req, res) => {
  res.render("index",{ title: "home"});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
