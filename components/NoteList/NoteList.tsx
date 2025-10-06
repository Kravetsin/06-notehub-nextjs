import { useState } from "react";
import css from "./NoteList.module.css";
import { type Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import Link from "next/link";

type NoteListProps = {
  notes: Note[];
};

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDeletingId(null);
    },
    onError: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: string) => {
    setDeletingId(id);
    mutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((item) => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <Link className={css.routerLink} href={`/notes/${item.id}`}>
              View details
            </Link>
            <button
              onClick={() => handleDelete(item.id)}
              className={css.button}
              disabled={mutation.isPending && deletingId === item.id}
            >
              {mutation.isPending && deletingId === item.id
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
