"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Toaster } from "react-hot-toast";
import { useFetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./NotesPage.module.css";

export default function Notes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rawSearch, setRawSearch] = useState("");
  const [debouncedSearch] = useDebounce(rawSearch, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useFetchNotes(
    currentPage,
    debouncedSearch
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={(e) => setRawSearch(e.target.value)} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data?.notes?.length ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}

      <Toaster />
    </div>
  );
}
