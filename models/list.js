const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image1: {
        type: String,
        default: "https://images.unsplash.com/photo-1712237617383-4da9e75fcbb9?q=80&w=2356&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>  v=== "" ? "https://images.unsplash.com/photo-1712237617383-4da9e75fcbb9?q=80&w=2356&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    },
    image2: {
        type: String,
        default: "https://images.unsplash.com/photo-1712237617383-4da9e75fcbb9?q=80&w=2356&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>  v=== "" ? "https://images.unsplash.com/photo-1712237617383-4da9e75fcbb9?q=80&w=2356&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    },
    image3: {
        type: String,
        default: "https://images.unsplash.com/photo-1712237617383-4da9e75fcbb9?q=80&w=2356&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) =>  v=== "" ? "https://images.unsplash.com/photo-1712237617383-4da9e75fcbb9?q=80&w=2356&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
    }
});

const List = mongoose.model("List", listSchema);
module.exports = List;
