import type { Note } from "@/types/note";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: Props) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="break-words">{note.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Updated {new Date(note.updatedAt).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="whitespace-pre-wrap break-words text-sm">
          {note.content || <span className="text-muted-foreground">No content</span>}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(note)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}