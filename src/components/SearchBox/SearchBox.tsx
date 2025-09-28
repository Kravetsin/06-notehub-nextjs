import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function SearchBox({ onChange }: SearchBoxProps) {
  return (
    <input
      onChange={onChange}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}
