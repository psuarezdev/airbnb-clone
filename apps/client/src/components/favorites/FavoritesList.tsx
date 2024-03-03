import { Profile, Listing } from '../../types.d';
import Container from '../Container';
import Heading from '../Heading';
import ListingCard from '../listings/ListingCard';

interface FavoritesListProps {
  favorites: Listing[];
  profile: Profile | null;
}

export default function FavoritesList({ favorites, profile }: FavoritesListProps) {
  return (
    <Container>
      <Heading 
        title="Favorites"
        subtitle="List of places you have favorited!"
      />
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {favorites.map(favorite => (
          <ListingCard 
            key={favorite.id}
            listing={favorite}
            profile={profile}
          />
        ))}
      </section>
    </Container>
  );
}
