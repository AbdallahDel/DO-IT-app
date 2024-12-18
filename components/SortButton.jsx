function SortButton({ name, value, onSort, active }) {
  return (
    <button
      className={`w-full p-1 rounded-sm text-sm hover:bg-neutral-600
      text-left cursor-pointer transition-all 
      ${active ? 'bg-neutral-600 text-white' : 'text-neutral-300'}`}
      onClick={() => onSort(value)}
    >
      {name}
    </button>
  );
}

export default SortButton;