import "../assets/style/AddEntryButton.css";
interface Props {
  onClick: () => void;
}

export function AddEntryButton({ onClick }: Props) {
  return (
    <button
      className="add-entry-button"
      onClick={onClick}
      aria-label="Adicionar atividade"
    >
      <span className="plus-icon">+</span>
    </button>
  );
}
