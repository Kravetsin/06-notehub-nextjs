"use client";

import { useState, useEffect } from "react";
import css from "./NotesPage.module.css";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import { useFetchNotes } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import { useDebounce } from "use-debounce";
import NoteForm from "@/components/NoteForm/NoteForm";
import Pagination from "@/components/Pagination/Pagination";

export default function App() {
  //! 🔹 States
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rawSearch, setRawSearch] = useState("");

  //! 🔹 Debounced search
  const [debouncedSearch] = useDebounce(rawSearch, 300);

  //! 🔹 Modal
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  //! 🔹 Notes Response
  const { data, isSuccess, isLoading, isError } = useFetchNotes(
    currentPage,
    debouncedSearch
  );

  //! 🔹 Reset page when search changes (only after debounce)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  //! 🔹 Handle "no notes found"
  useEffect(() => {
    if (
      isSuccess &&
      data &&
      Array.isArray(data.notes) &&
      data.notes.length === 0
    ) {
      toast.error("No notes found.");
    }
  }, [isSuccess, data]);

  //! 🔹 Render
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
        <button onClick={openModal} className={css.button}>
          Create note +
        </button>
      </header>
      {data && Array.isArray(data.notes) && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}
