"use client";
import css from "./Footer.module.css";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {year !== null ? year : "..."} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>Developer: Kravets</p>
          <p>
            Contact us:
            <a href="mailto:student@notehub.app">student@notehub.app</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
