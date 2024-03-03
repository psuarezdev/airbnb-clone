import useReservations from '../hooks/useReservations';
import EmptyState from '../components/EmptyState';
import TripsList from '../components/trips/TripsList';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';

export default function Trips() {
  const profile = useAuth(state => state.profile);
  const { reservations, removeReservation, isLoading } = useReservations({ userId: profile?.id });
  
  if(!profile) {
    return <EmptyState title="Unauthorized" subtitle="Please login to view your trips" />;
  }

  if(isLoading) return <Spinner />;

  if(!reservations || reservations.length === 0) {
    return <EmptyState title="No trips" subtitle="You have no upcoming trips" />;
  }

  return (
    <TripsList
      trips={reservations}
      removeReservation={removeReservation}
      profile={profile}
    />
  );
}
