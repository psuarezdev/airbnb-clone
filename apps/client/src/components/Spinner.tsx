import { ImSpinner2 } from 'react-icons/im';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <ImSpinner2 className="animate-spin h-12 w-12" />
    </div>
  );
}
