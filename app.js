require("dotenv").config();
const express = require("express");
const session = require('express-session');
const List = require("./models/list.js");
const User = require("./models/user.js");

const app = express();
const port = process.env.PORT;

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const bcrypt = require('bcrypt');

let M_url = process.env.MONGO_URL;

main()
    .then(() => {
        console.log("M is connected");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(M_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


// Apply the session middleware
app.use(session({
    secret: process.env.SECRET_KEY, // Change this to your own secret key
    resave: false,
    saveUninitialized: true
}));

// Middleware function to check if the user is logged in
const checkLoggedIn = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn || false;
    req.isLoggedIn = isLoggedIn;
    next();
};

// Apply the checkLoggedIn middleware globally to all routes
app.use(checkLoggedIn);


// root
app.get('/', (req, res) => {
    res.send("Welcome to the homepage");
});

// Middleware function to check if the user is logged in

// login route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                req.isLoggedIn = true;
                req.session.isLoggedIn = true;
                res.redirect("/admin");
            } else {
                res.render("login.ejs", { error: { msg: "Incorrect email or password" } });
            }
        } else {
            res.render("login.ejs", { error: { msg: "Incorrect email or password" } });
        }
    } catch (err) {
        console.error(err);
        res.render("login.ejs", { error: { msg: "An error occurred. Please try again later." } });
    }
});

app.get("/login", (req, res) => {
    let error = req.query.error;
    res.render("login.ejs", { error });
});

// register route
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("register.ejs", { error: { msg: "Email already in use." } });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: username,
            email: email,
            password: hashedPassword,
        });
        await newUser.save(); // Use save() method to insert the document

        if (newUser) {
            req.isLoggedIn = true;
            req.session.isLoggedIn = true;
            res.redirect("/admin");
        } else {
            res.render("register.ejs", { error: { msg: "Registration failed. Please try again." } });
        }
    } catch (err) {
        console.error(err);
        res.render("register.ejs", { error: { msg: "An error occurred. Please try again later." } });
    }
});

app.get("/register", (req, res) => {
    let error = req.query.error;
    res.render("register.ejs", { error });
});

//home route
app.get('/home', async (req, res) => {
    const allListings = await List.find({});
    res.render("home.ejs", { allListings, isLoggedIn: req.isLoggedIn })
})

// new route
app.get('/new', (req, res) => {
    res.render("new.ejs", { isLoggedIn: req.isLoggedIn });
})

// admin route
app.get('/admin', async (req, res) => {
    const allListings = await List.find({});
    res.render("admin.ejs", { allListings, isLoggedIn: req.isLoggedIn });
});


// create route
app.post('/home', async (req, res) => {
    const newBlog = new List(req.body.list);
    await newBlog.save();
    res.redirect("/home");
})

app.post('/admin', async (req, res) => {
    const newBlog = new List(req.body.list);
    await newBlog.save();
    res.redirect("/admin");
})

// read more route
app.get('/show/:id', async (req, res) => {
    const { id } = req.params;
    const list = await List.findById(id);
    res.render("show.ejs", { list, isLoggedIn: req.isLoggedIn })
})

//delete route
app.delete('/show/:id', async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndDelete(id);
    res.redirect("/home");
})

// edit post
app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const list = await List.findById(id);
    res.render('edit.ejs', { list, isLoggedIn: req.isLoggedIn });
});

//update
app.put('/show/:id', async (req, res) => {
    const { id } = req.params;
    await List.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/show/${id}`);
})

app.listen(port, () => {
    console.log(`app is listening to port ${port}`);
})