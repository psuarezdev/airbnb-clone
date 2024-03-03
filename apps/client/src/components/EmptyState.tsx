import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Heading from './Heading';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

export default function EmptyState({ title = 'No exac matches', subtitle = 'Try changing or removing some of your filters', showReset }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col items-center justify-center gap-2 h-[60vh]">
      <Heading
        title={title}
        subtitle={subtitle}
        center
      />
      <div className="w-48 mt-4">
        {showReset && (
          <Button 
            outline
            label="Remove all filters"
            onClick={() => navigate('/')}
          />
        )}
      </div>
    </div>
  );
}
