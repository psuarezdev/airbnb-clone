import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Listing, Reservation, Profile } from '../../types.d';
import useCountries from '../../hooks/useCountries';
import { useCallback, useMemo } from 'react';
import HeartButton from '../HeartButton';
import Button from '../Button';

interface ListingCardProps {
  listing: Listing;
  reservation?: Reservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  profile?: Profile | null;
}

export default function ListingCard({ listing, reservation, onAction, disabled, actionLabel, actionId, profile }: ListingCardProps) {
  const { getByValue } = useCountries();

  const location = getByValue(listing.locationValue);

  const price = useMemo(() => {
    if (reservation) return reservation.totalPrice;
    return listing.price;
  }, [reservation, listing.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (disabled) return;

    if (onAction && actionId) onAction(actionId);
  }, [disabled, onAction, actionId]);

  return (
    <article className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <Link to={`/listings/${listing.id}`}>
            <img
              className="aspect-square object-cover group-hover:scale-110 transition"
              src={`/api/listings/image/${listing.imageSrc}`}
              alt={listing.title}
            />
          </Link>
          {profile && (
            <div className="absolute top-3 right-3">
              <HeartButton listingId={listing.id} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Link to={`/listings/${listing.id}`} className="flex flex-col gap-2 w-full">
            <p className="font-semibold text-lg">
              {location?.region}, {location?.label}
            </p>
            <p className="font-light text-neutral-500">
              {reservationDate ?? listing.category}
            </p>
            <div className="flex items-center gap-1">
              <p className="font-semibold">
                € {price}
              </p>
              {!reservation && (
                <p className="font-light">night</p>
              )}
            </div>
          </Link>
          {onAction && actionLabel && (
            <Button
              label={actionLabel}
              onClick={handleCancel}
              disabled={disabled}
              small
            />
          )}
        </div>
      </div>
    </article>
  );
}
