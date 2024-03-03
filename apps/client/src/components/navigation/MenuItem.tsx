interface MenuItemProps {
  className?: string;
  label: string;
  onClick: () => void;
}

export default function MenuItem({ className, label, onClick }: MenuItemProps) {
  return (
    <div
      className={`${className} px-4 py-3 hover:bg-neutral-100 transition font-semibold`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}
