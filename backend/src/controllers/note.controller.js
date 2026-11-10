import { Note } from "../models/note.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const addNote = asyncHandler( async (req, res) => {
    const {title, content} = req.body

    if(!title){
        throw new ApiError(400, "All fileds are required");
    }

    const note = await Note.create({
        title,
        content,
        ownerId: req.userId
    })
    
    return res
        .status(201)
        .json(
            {
                message: "Note created",
                note
            }
        )
})

const getNotes = asyncHandler( async (req, res) => {
    const notes = await Note.find({ ownerId: req.userId }).sort({ updatedAt: -1 })

    return res.status(200).json({ message: "Notes fetched", notes })
})

const editNote = asyncHandler( async (req, res) => {
    const {id} = req.params
    const {title, content} = req.body

    if (title === undefined && content === undefined) {
        throw new ApiError(400, "Nothing to update");
    }

    const note = await Note.findOneAndUpdate(
        { _id: id, ownerId: req.userId },
        { ...(title !== undefined && { title }), ...(content !== undefined && { content }) },
        { new: true, runValidators: true }
    )

    
    if(!note){
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json({message: "Updated", note})
})

const deleteNote = asyncHandler( async (req, res) => {
    const {id} = req.params
    
    const note = await Note.findOneAndDelete({ _id: id, ownerId: req.userId })

    if(!note){
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json({message: "Deleted", note})

})

export {
    addNote,
    getNotes,
    editNote,
    deleteNote
}