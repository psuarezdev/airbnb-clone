import { IconType } from 'react-icons';

interface CategoryInputProps {
  label: string;
  icon: IconType
  onClick: (value: string) => void;
  selected?: boolean;
}

export default function CategoryInput({ label, icon: Icon, onClick, selected }: CategoryInputProps) {
  return (
    <div 
      className={`
        flex flex-col gap-3 p-4 rounded-xl border-2 hover:border-black transition cursor-pointer
        ${selected ? 'border-black' : 'border-neutral-200'}
      `}
      onClick={() => onClick(label)}  
    >
      <Icon size={30} />
      <p className="font-semibold">{label}</p>
    </div>
  );
}
