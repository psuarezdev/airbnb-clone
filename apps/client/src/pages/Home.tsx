import useListings from '../hooks/useListings';
import Container from '../components/Container';
import EmptyState from '../components/EmptyState';
import ListingCard from '../components/listings/ListingCard';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const listings = useListings(state => state.listings);
  const profile = useAuth(state => state.profile);

  if (listings?.length === 0) return <EmptyState showReset />;

  return (
    <Container>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 pt-24">
        {listings.map((listing, index) => (
          <ListingCard
            key={`${listing.id}${index}`}
            listing={listing}
            profile={profile}
          />
        ))}
      </section>
    </Container>
  );
}
