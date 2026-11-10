import { Router } from "express";
import { addNote, deleteNote, editNote, getNotes } from "../controllers/note.controller.js";
import { requireUser } from "../middlewares/requireUser.middleware.js";

const router = Router()

router.use("/notes", requireUser);

router.route("/notes").post(addNote)
router.route("/notes").get(getNotes)
router.route("/notes/:id").patch(editNote)
router.route("/notes/:id").delete(deleteNote)

export default router;
