import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Listing } from '../types.d';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/EmptyState';
import ListingItem from '../components/listings/ListingItem';
import Spinner from '../components/Spinner';
import useReservations from '../hooks/useReservations';

export default function Listing() {
  const { id } = useParams();
  const { accessToken, profile, } = useAuth();
  const { reservations } = useReservations({ listingId: id });

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Make a custom hook for fetching a single listing - useListing

  useEffect(()=> {
    fetch(`/api/listings/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch listing');
        return res.json();
      })
      .then(data => setListing(data))
      .catch(() => setListing(null))
      .finally(() => setIsLoading(false));
  }, [id, accessToken]);

  if (isLoading) return <Spinner />

  if (!listing) return <EmptyState subtitle="Listing not found" />;  

  return <ListingItem reservations={reservations} listing={listing} profile={profile} />;
}
