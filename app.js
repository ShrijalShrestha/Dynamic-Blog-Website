const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const List = require("./models/list.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

let M_url = "mongodb://127.0.0.1:27017/blog";

main()
.then(()=>{
    console.log("M is connected");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(M_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//home route
app.get('/home', async (req,res)=>{
    const allListings = await List.find({});
    res.render("home.ejs", {allListings})
})

// new route
app.get('/new', (req,res)=>{
    res.render("new.ejs")
})

// create route
app.post('/home', async (req,res)=>{
    const newBlog = new List(req.body.list);
    await newBlog.save();
    res.redirect("/home"); 
})

// read more route
app.get('/show/:id', async (req,res)=>{
    const {id} = req.params;
    const list = await List.findById(id);
    res.render("show.ejs", {list})
})

//delete route
app.delete('/show/:id', async (req,res)=>{
    let {id} = req.params;
    await List.findByIdAndDelete(id);
    res.redirect("/home"); 
})

// edit post
app.get('/edit/:id', async (req, res) => {
    const {id} = req.params;
    const list = await List.findById(id);
    res.render('edit.ejs', {list});
});

//update
app.put('/show/:id', async (req,res)=>{
    const { id } = req.params;
    await List.findByIdAndUpdate(id, { ...req.body.list });
    res.redirect(`/show/${id}`);
})

app.listen(port, ()=>{
    console.log(`app is listening to port ${port}`);
})