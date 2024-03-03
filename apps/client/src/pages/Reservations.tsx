import EmptyState from '../components/EmptyState';
import Spinner from '../components/Spinner';
import ReservationsList from '../components/reservations/ReservationsList';
import useAuth from '../hooks/useAuth';
import useReservations from '../hooks/useReservations';

export default function Reservations() {
  const { accessToken, profile } = useAuth();
  const { reservations, removeReservation, isLoading } = useReservations({ authorId: profile?.id });

  if(!accessToken || !profile) {
    return <EmptyState title="Unauthorized" subtitle="Please login to view your reservations" />;
  }

  if(isLoading) return <Spinner />

  if(!reservations || reservations.length === 0) {
    return (
      <EmptyState 
        title="No reservations found" 
        subtitle="Looks like you have no reservations yet"
      />
    );
  }

  return (
    <div>
      <ReservationsList
        reservations={reservations}
        removeReservation={removeReservation}
        profile={profile}
      />
    </div>
  );
}
