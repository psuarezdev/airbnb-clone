interface AvatarProps {
  src?: string | null;
}

export default function Avatar({ src }: AvatarProps) {
  return (
    <img 
      className="w-[30px] h-[30px] rounded-full"
      src={src ? `/api/users/avatar/${src}` : '/images/placeholder.jpg'}
      alt="Avatar"
      width={30}
      height={30}
    />
  );
}
