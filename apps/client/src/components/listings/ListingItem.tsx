import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { differenceInCalendarDays, eachDayOfInterval } from 'date-fns';
import { Range } from 'react-date-range';
import { Listing, User, Profile, Reservation } from '../../types.d';
import useLoginModal from '../../hooks/modals/useLoginModal';
import categories from '../../categories';
import Container from '../Container';
import ListingHeader from './ListingHeader';
import ListingInfo from './ListingInfo';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import ListingReservation from './ListingReservation';

interface ListingItemProps {
  reservations?: Reservation[] | null;
  listing: Listing & { user: User }
  profile: Profile | null;
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection'
};

export default function ListingItem({ reservations, listing, profile }: ListingItemProps) {
  const accessToken = useAuth(state => state.accessToken);
  const loginModal = useLoginModal();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations?.forEach(reservation => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const category = useMemo(() => {
    return categories.find(c => c.label === listing.category);
  }, [listing.category]);

  const onCreateReservation = useCallback(async () => {
    try {
      if (!profile || !accessToken) return loginModal.onOpen();

      setIsLoading(true);

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          userId: profile.id,
          listingId: listing.id,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          totalPrice
        })
      });

      if (!res.ok) return toast.error('Could not make the reservation');

      toast.success('Listing reserved');
      navigate('/trips');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [profile, accessToken, loginModal, listing.id, dateRange, totalPrice, navigate]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(dateRange.endDate, dateRange.startDate);

      dayCount && listing.price
        ? setTotalPrice(dayCount * listing.price)
        : setTotalPrice(listing.price);
    }
  }, [dateRange, listing.price]);

  return (
    <Container>
      <section className="max-w-screen-lg mx-auto">
        <article className="flex flex-col gap-6">
          <ListingHeader
            id={listing.id}
            title={listing.title}
            imageSrc={listing.imageSrc}
            localtionValue={listing.locationValue}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading || listing.user.id === profile?.id}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </article>
      </section>
    </Container>
  );
}
