import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="hidden md:flex flex-grow justify-self-start basis-0 select-none">
      <img
        className="cursor-pointer w-[100px] aspect-video object-contain"
        src="/images/logo.png"
        alt="Logo"
      />
    </Link>
  );
}
