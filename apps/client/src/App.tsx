import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import useAuth from './hooks/useAuth';
import useListings from './hooks/useListings';

import Home from './pages/Home';
import Reservations from './pages/Reservations';
import Trips from './pages/Trips';
import Listing from './pages/Listing';

import ModalProvider from './components/providers/ModalProvider';
import Navbar from './components/navigation/Navbar';
import EmptyState from './components/EmptyState';
import Favorites from './pages/Favorites';
import useFavorites from './hooks/useFavorites';
import Properties from './pages/Properties';

export default function App() {
  const { accessToken, refreshToken, expiresIn, fetchProfile, logIn, logOut } = useAuth();
  const location = useLocation();
  const fetchListings = useListings(state => state.fetch);
  const fetchFavorites = useFavorites(state => state.fetch);

  if (expiresIn && new Date().getTime() > expiresIn) {
    fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Refresh ${refreshToken}` },
    })
      .then(res => res.json())
      .then(data => logIn(data))
      .catch(() => logOut());
  }

  useEffect(() => {
    fetchListings(location.search);

    if (accessToken) {
      fetchProfile(accessToken);
      fetchFavorites(accessToken);
    }
  }, [accessToken, location.search, fetchProfile, fetchListings, fetchFavorites]);

  return (
    <>
      <Navbar />
      <Toaster />
      <ModalProvider />
      <main className="pb-20 pt-28">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route index element={<Home />} />
          <Route path="listings/:id" element={<Listing />} />

          {/* PRIVATE ROUTES */}
          {accessToken && (
            <>
              <Route path="trips" element={<Trips />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="properties" element={<Properties />} />
              <Route path="favorites" element={<Favorites />} />
            </>
          )}

          {/* 404 */}
          <Route path="*" element={<EmptyState title="404" subtitle="Page not found" showReset />} />
        </Routes>
      </main>
    </>
  );
}
