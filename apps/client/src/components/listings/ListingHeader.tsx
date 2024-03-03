import useCountries from '../../hooks/useCountries';
import Heading from '../Heading';
import HeartButton from '../HeartButton';

interface ListingHeaderProps {
  id: string;
  title: string;
  imageSrc: string;
  localtionValue: string;
}

export default function ListingHeader({ id, title, imageSrc, localtionValue }: ListingHeaderProps) {
  const { getByValue } = useCountries();

  const location = getByValue(localtionValue);

  return (
    <>
      <Heading 
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="relative w-full h-[60vh] overflow-hidden rounded-xl">
        <img 
          className="w-full object-cover"
          src={`/api/listings/image/${imageSrc}`}
          alt={title} 
        />
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} />
        </div>
      </div>
    </>
  );
}
