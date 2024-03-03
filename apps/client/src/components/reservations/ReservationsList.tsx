import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Profile, Reservation } from '../../types.d';
import useAuth from '../../hooks/useAuth';
import Container from '../Container';
import Heading from '../Heading';
import ListingCard from '../listings/ListingCard';

interface ReservationsListProps {
  reservations: Reservation[];
  removeReservation: (id: string) => void;
  profile: Profile;
}

export default function ReservationsList({ reservations, removeReservation, profile }: ReservationsListProps) {
  const accessToken = useAuth(state => state.accessToken);
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback(async (id: string) => {
    try {
      setDeletingId(id);

      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) return toast.error('Could not cancel reservation');

      toast.success('Reservation cancelled');
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
        title="Reservations"
        subtitle="Bookings on your properties"
      />
      <section className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map(reservation => (
          <ListingCard
            key={reservation.id}
            listing={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Cancel guest reservation"
            profile={profile}
          />
        ))}
      </section>
    </Container>
  );
}
