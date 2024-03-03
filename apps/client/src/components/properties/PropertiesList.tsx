import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Listing, Profile } from '../../types.d';
import useAuth from '../../hooks/useAuth';
import Container from '../Container';
import Heading from '../Heading';
import ListingCard from '../listings/ListingCard';
import useListings from '../../hooks/useListings';

interface PropertiesListProps {
  properties: Listing[];
  removeProperty: (id: string) => void;
  profile: Profile;
}

export default function PropertiesList({ properties, removeProperty, profile }: PropertiesListProps) {
  const accessToken = useAuth(state => state.accessToken);
  const removeListing = useListings(state => state.removeListing);
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(async (id: string) => {
    try {
      setDeletingId(id);

      const res = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) return toast.error('Could not delete property');

      toast.success('Property deleted');

      removeProperty(id);
      removeListing(id);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setDeletingId('');
    }
  }, [accessToken, removeProperty, removeListing]);

  return (
    <Container>
      <Heading
        title="Properties"
        subtitle="List of your properties"
      />
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {properties.map(property => (
          <ListingCard
            key={property.id}
            listing={property}
            actionId={property.id}
            onAction={onCancel}
            disabled={deletingId === property.id}
            actionLabel="Delete property"
            profile={profile}
          />
        ))}
      </section>
    </Container>
  );
}
