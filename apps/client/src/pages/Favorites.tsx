import EmptyState from '../components/EmptyState';
import FavoritesList from '../components/favorites/FavoritesList';
import useAuth from '../hooks/useAuth';
import useFavorites from '../hooks/useFavorites';

export default function Favorites() {
  const profile = useAuth(state => state.profile);
  const favorites = useFavorites(state => state.favorites);

  if(!profile) {
    return <EmptyState title="Unauthorized" subtitle="Please login to view your favorites." />;
  }

  if(!favorites || favorites.length === 0) {
    return <EmptyState title="No favorites" subtitle="Looks like you have no favorites listings" />;
  }

  return (
    <FavoritesList
      favorites={favorites} 
      profile={profile}
    />
  );
}
