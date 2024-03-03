import { useEffect, useState } from 'react';
import { Reservation } from '../types.d';
import useAuth from './useAuth';
import qs from 'query-string';

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default function useReservations(params: IParams) {
  const accessToken = useAuth(state => state.accessToken);
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { listingId, userId, authorId } = params;

  const url = qs.stringifyUrl({
    url: '/api/reservations',
    query: {
      listingId,
      userId,
      authorId
    }
  }, { skipEmptyString: true, skipNull: true });

  const removeReservation = (id: string) => {
    setReservations(prev => prev?.filter(reservation => reservation.id !== id) ?? null);
  };

  useEffect(() => {
    fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch reservations');
        return res.json();
      })
      .then(data => setReservations(data))
      .catch(() => setReservations(null))
      .finally(() => setIsLoading(false));
  }, [accessToken, url]);

  return { reservations, isLoading, removeReservation };
}
