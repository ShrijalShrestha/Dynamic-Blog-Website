require("dotenv").config();
const express = require("express");
const session = require("express-session");
const List = require("./models/list.js");
const User = require("./models/user.js");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bcrypt = require("bcrypt");

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Mongoose connected"))
    .catch(err => console.error(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//  Session Middleware
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

//  Middleware to Set Global Variables for EJS
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.userId;
    res.locals.userId = req.session.userId || null;
    next();
});

//  Root Route
app.get("/", (req, res) => res.send("Welcome to the homepage"));

//  Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            return res.redirect("/home");
        }
        res.render("login.ejs", { error: { msg: "Incorrect email or password" } });
    } catch (err) {
        console.error(err);
        res.render("login.ejs", { error: { msg: "An error occurred. Try again." } });
    }
});

app.get("/login", (req, res) => res.render("login.ejs", { error: req.query.error }));

//  Register Route
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.render("register.ejs", { error: { msg: "Email already in use." } });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name: username, email, password: hashedPassword });
        req.session.userId = newUser._id;
        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.render("register.ejs", { error: { msg: "An error occurred. Try again." } });
    }
});

app.get("/register", (req, res) => res.render("register.ejs", { error: req.query.error }));

//  Logout Route
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

//  Middleware to Require Login
const requireLogin = (req, res, next) => {
    if (!req.session.userId) return res.redirect("/login");
    next();
};

//  Home Route (Shows All Listings)
app.get("/home", async (req, res) => {
    try {
        const allListings = await List.find({}).populate("owner");
        res.render("home.ejs", { allListings });
    } catch (err) {
        console.error("Error fetching listings:", err);
        res.status(500).send("Error loading listings.");
    }
});

//  New Listing Page (Requires Login)
app.get("/new", requireLogin, (req, res) => {
    res.render("new.ejs");
});

//  Create New Listing (Only if Logged In)
app.post("/home", requireLogin, async (req, res) => {
    await new List({ ...req.body.list, owner: req.session.userId }).save();
    res.redirect("/home");
});

//  Profile Page (User's Listings Only)
app.get("/profile", requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).send("User not found");

        const userPosts = await List.find({ owner: req.session.userId }).populate("owner");
        res.render("profile.ejs", { user, userPosts });
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).send("Error loading profile");
    }
});

//  Show Specific Listing
app.get("/show/:id", async (req, res) => {
    const list = await List.findById(req.params.id).populate("owner");
    res.render("show.ejs", { list });
});

//  Delete Listing (Only if User Owns It)
app.delete("/show/:id", requireLogin, async (req, res) => {
    const list = await List.findById(req.params.id);
    if (!list || list.owner.toString() !== req.session.userId) return res.redirect("/home");

    await List.findByIdAndDelete(req.params.id);
    res.redirect("/home");
});

//  Edit Listing (Only if User Owns It)
app.get("/edit/:id", requireLogin, async (req, res) => {
    const list = await List.findById(req.params.id);
    if (!list || list.owner.toString() !== req.session.userId) return res.redirect("/home");

    res.render("edit.ejs", { list });
});

//  Update Listing (Only if User Owns It)
app.put("/show/:id", requireLogin, async (req, res) => {
    const list = await List.findById(req.params.id);
    if (!list || list.owner.toString() !== req.session.userId) return res.redirect("/home");

    await List.findByIdAndUpdate(req.params.id, { ...req.body.list });
    res.redirect(`/show/${req.params.id}`);
});

app.listen(port, () => console.log(`App listening on port ${port}`));
