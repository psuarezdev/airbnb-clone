import { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';
import useLoginModal from '../hooks/modals/useLoginModal';
import useFavorites from '../hooks/useFavorites';

interface HeartButtonProps {
  listingId: string;
}

export default function HeartButton({ listingId }: HeartButtonProps) {
  const accessToken = useAuth(state => state.accessToken);
  const onOpenLoginModal = useLoginModal(state => state.onOpen);
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  
  const [hasFavorited, setHasFavorited] = useState(favorites?.some(favorite => favorite.id === listingId));

  const toggleFavorite = async () => {
    try {
      if(!accessToken) return onOpenLoginModal();

      const res = await fetch(`/api/users/favorites/${listingId}`, {
        method: hasFavorited ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!res.ok) return toast.error(`Failed to ${hasFavorited ? 'unfavorite' : 'favorite'} the listing`);

      const data = await res.json();

      hasFavorited ? removeFavorite(listingId) : addFavorite(data);

      setHasFavorited(!hasFavorited);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div
      className="relative hover:opacity-80 transition cursor-pointer"
      onClick={toggleFavorite}
    >
      <AiOutlineHeart
        className="fill-white absolute -top-[2px] -right-[2px]"
        size={28}
      />
      <AiFillHeart
        className={hasFavorited ? 'fill-rose-500' : 'fill-neutral-500/70'}
        size={24}
      />
    </div>
  );
}
