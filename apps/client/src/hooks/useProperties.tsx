import { useEffect, useState } from 'react';
import { Listing } from '../types.d';
import useAuth from './useAuth';

export default function useProperties() {
  const accessToken = useAuth(state => state.accessToken);
  const [properties, setProperties] = useState<Listing[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const removeProperty = (id: string) => {
    setProperties(prev => prev?.filter(property => property.id !== id) ?? null);
  };

  useEffect(() => {
    fetch('/api/users/properties', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Could not fetch properties');
        return res.json();
      })
      .then(data => setProperties(data))
      .catch(() => setProperties(null))
      .finally(() => setIsLoading(false));
  }, [accessToken]);

  return { properties, removeProperty, isLoading };
}

