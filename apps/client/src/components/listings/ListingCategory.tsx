import { IconType } from 'react-icons';

interface ListingCategoryProps {
  label: string;
  icon: IconType;
  description: string;
}

export default function ListingCategory({ label, icon: Icon, description }: ListingCategoryProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Icon className="text-neutral-600" size={40} />
        <div className="flex flex-col">
          <h4 className="text-lg font-semibold">{label}</h4>
          <p className="text-neutral-500 font-light">{description}</p>
        </div>
      </div>
    </div>
  );
}
