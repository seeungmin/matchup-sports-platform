export function FilterBar({ items }: { items: string[] }) {
  return (
    <div className="v1-toolbar" aria-label="필터">
      {items.map((item, index) => (
        <button key={item} className={index === 0 ? 'v1-chip v1-chip-active' : 'v1-chip'} type="button">
          {item}
        </button>
      ))}
    </div>
  );
}
