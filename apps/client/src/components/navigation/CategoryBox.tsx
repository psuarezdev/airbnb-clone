import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';
import qs from 'query-string';

interface CategoryBoxProps {
  label: string;
  icon: IconType 
  selected?: boolean;
}

export default function CategoryBox({ label, icon: Icon, selected }: CategoryBoxProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    
    let query  = {};

    if(params.size > 0) {
      query = qs.parse(params.toString());
    }
    
    const updatedQuery: { category?: string } = {
      ...query,
      category: label
    };

    if (params.get('category') === label) {
      delete updatedQuery.category;
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, { skipNull: true });

    navigate(url);
  }, [label, navigate]);

  return (
    <div 
      className={`
        flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition select-none cursor-pointer
        ${selected ? 'border-b-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500'}
      `}
      onClick={handleClick}
    >
      <Icon size={26} />
      <div className="font-medium text-sm">
        {label}
      </div>
    </div>
  );
}
