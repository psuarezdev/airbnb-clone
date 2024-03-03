interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function Heading({ title, subtitle, center }: HeadingProps) {
  return (
    <header className={center ? 'text-center' : 'text-start'}>
      <h2 className="text-2xl font-bold">
        {title}
      </h2>
      <div className="font-light text-neutral-500 mt-2">
        {subtitle}
      </div>
    </header>
  );
}
