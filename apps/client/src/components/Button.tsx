import { IconType } from 'react-icons';

interface ButtonProps {
  label?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  icon?: IconType;
}

export default function Button({ label, onClick, disabled, outline, small, icon: Icon }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        relative disabled:opacity-70 disabled:cursor-not-allowed rounded-lg hover:opacity-80 transition w-full
        ${outline ? 'bg-white border-black text-black' : 'bg-rose-500 border-rose-500 text-white'}
        ${small ? 'text-sm py-1 font-light border-[1px]' : 'text-md py-3 font-semibold border-2'}
      `}
    >
      {Icon && (
        <Icon
          className="absolute left-4 top-3"
          size={24}
        />
      )}
      {label}
    </button>
  );
}
