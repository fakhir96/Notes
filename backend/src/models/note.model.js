import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    ownerId: { 
        type: String, 
        required: true, 
        index: true 
    }
}, {timestamps: true})

export const Note = mongoose.model("Note", noteSchema);