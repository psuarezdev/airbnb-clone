import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Profile, Reservation } from '../../types.d';
import Container from '../Container';
import Heading from '../Heading';
import useAuth from '../../hooks/useAuth';
import ListingCard from '../listings/ListingCard';

interface TripsListProps {
  trips: Reservation[];
  removeReservation: (id: string) => void;
  profile: Profile;
}

export default function TripsList({ trips, removeReservation, profile }: TripsListProps) {
  const accessToken = useAuth(state => state.accessToken);
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(async(id: string) => {
    try {
      setDeletingId(id);

      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if(!res.ok) return toast.error('Could not cancel trip');

      toast.success('trip cancelled');
      removeReservation(id);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setDeletingId('');
    }
  }, [accessToken, removeReservation]);

  return (
    <Container>
      <Heading 
        title="Trips"
        subtitle="Where you've been and where you're going"
      />
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {trips.map(trip => (
          <ListingCard 
            key={trip.id}
            listing={trip.listing}
            reservation={trip}
            actionId={trip.id}
            onAction={onCancel}
            disabled={deletingId === trip.id}
            actionLabel="Cancel trip"
            profile={profile}
          />
        ))}
      </section>
    </Container>
  );
}
