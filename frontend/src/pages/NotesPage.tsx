import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "@/lib/useApi";
import type { Note } from "@/types/note";
import NoteCard from "@/components/NoteCard";
import NoteDialog from "@/components/NoteDialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong";

export default function NotesPage() {
  const api = useApi();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  useEffect(() => {
    api<{ notes: Note[] }>("/notes")
      .then((data) => setNotes(data.notes))
      .catch((err) => toast.error(errorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingNote(null);
    setDialogOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleSave = async (data: { title: string; content: string }) => {
    try {
      if (editingNote) {
        const res = await api<{ note: Note }>(`/notes/${editingNote._id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
        setNotes((prev) => prev.map((n) => (n._id === res.note._id ? res.note : n)));
        toast.success("Note updated");
      } else {
        const res = await api<{ note: Note }>("/notes", {
          method: "POST",
          body: JSON.stringify(data),
        });
        setNotes((prev) => [res.note, ...prev]);
        toast.success("Note created");
      }
    } catch (err) {
      toast.error(errorMessage(err));
      throw err; // tells the dialog to stay open
    }
  };

  const handleDelete = async () => {
    if (!noteToDelete) return;
    try {
      await api(`/notes/${noteToDelete._id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n._id !== noteToDelete._id));
      toast.success("Note deleted");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setNoteToDelete(null);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your notes</h2>
        <Button onClick={openCreate}>New note</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-muted-foreground">No notes yet. Create your first one!</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={openEdit}
              onDelete={setNoteToDelete}
            />
          ))}
        </div>
      )}

      <NoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        note={editingNote}
        onSave={handleSave}
      />

      <AlertDialog
        open={noteToDelete !== null}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this note?</AlertDialogTitle>
            <AlertDialogDescription>
              "{noteToDelete?.title}" will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}