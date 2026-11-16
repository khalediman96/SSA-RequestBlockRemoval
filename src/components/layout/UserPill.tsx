export function UserPill({ label }: { label: string }) {
  return (
    <div className="user-pill">
      <span className="user-pill__avatar" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}