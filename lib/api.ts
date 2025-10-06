import axios from "axios";
import toast from "react-hot-toast";
import { Note } from "@/types/note";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

//! 🔹 Axios defaults
const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  },
});

//! 🔹 Error notifications
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Unknown error";
    toast.error(`API Error: ${message}`);
    return Promise.reject(error);
  }
);

type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

//! 🔹 API-функции
export const fetchNotes = async (
  page: number,
  search: string
): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: { page, perPage: 12, search },
  });
  return data;
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", noteData, {
    headers: { "Content-Type": "application/json" },
  });
  toast.success("Note added successfully!");
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  toast.success("Note deleted successfully!");
  return data;
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

//! 🔹 React Query hook
export const useFetchNotes = (currentPage: number, search: string) => {
  return useQuery({
    queryKey: ["notes", currentPage, search],
    queryFn: () => fetchNotes(currentPage, search),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};
