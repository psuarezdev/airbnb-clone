import { IconType } from 'react-icons';
import { User } from '../../types.d';
import Avatar from '../Avatar';
import ListingCategory from './ListingCategory';
import Map from '../Map';
import useCountries from '../../hooks/useCountries';

interface ListingInfoProps {
  user: User;
  category?: {
    label: string;
    icon: IconType;
    description: string;
  } | undefined;
  description: string;
  roomCount: number;
  guestCount: number;
  bathroomCount: number;
  locationValue: string;
}

export default function ListingInfo({ user, category, description, roomCount, guestCount, bathroomCount, locationValue }: ListingInfoProps) {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng;

  return (
    <div className="flex flex-col gap-8 col-span-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <h3 className="text-xl">Hosted by {user.name}</h3>
          <Avatar src={user.image} />
        </div>
        <div className="flex items-center gap-4 font-light text-neutral-500">
          <p>{guestCount} guest</p>
          <p>{roomCount} room</p>
          <p>{bathroomCount} bathroom</p>
        </div>
      </div>
      <hr />
      {category && (
        <ListingCategory
          label={category.label}
          icon={category.icon}
          description={category.description}
        />
      )}
      <hr />
      <p className="text-lg font-light text-neutral-500">
        {description}
      </p>
      <hr />
      <Map center={coordinates} />
    </div>
  );
}
