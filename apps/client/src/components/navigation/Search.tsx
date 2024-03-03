import { useMemo } from 'react';
import { BiSearch } from 'react-icons/bi';
import { differenceInDays } from 'date-fns';
import useSearchModal from '../../hooks/modals/useSeachModal';
import useCountries from '../../hooks/useCountries';
import { useSearchParams } from 'react-router-dom';

export default function Search() {
  const onOpenSearchModal = useSearchModal(state => state.onOpen);
  const [searchParams] = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = searchParams.get('locationValue');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const guestCount = searchParams.get('guestCount');

  const locationLabel = useMemo(() => {
    return locationValue ? getByValue(locationValue)?.label : 'Anywhere';
  }, [getByValue, locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      let diff = differenceInDays(new Date(endDate), new Date(startDate));

      if (diff === 0) diff = 1;

      return `${diff} night${diff > 1 ? 's' : ''}`;
    }

    return 'Any Week';
  }, [endDate, startDate]);

  const guestLabel = useMemo(() => {
    return guestCount ? `${guestCount} guest${Number(guestCount) > 1 ? 's' : ''}` : 'Add Guests';
  }, [guestCount]);

  return (
    <div onClick={onOpenSearchModal} className="border-[1px] w-full md:w-auto py-2 rounded-full shadow-md hover:shadow-md transition cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold px-6">
          {locationLabel}
        </div>
        <div className="hidden sm:block flex-1 text-sm font-semibold px-6 border-x-[1px] text-center">
          {durationLabel}
        </div>
        <div className="flex items-center gap-3 text-sm pl-6 pr-2 text-gray-600">
          <div className="hidden sm:block">
            {guestLabel}
          </div>
          <div className="p-2 bg-rose-500 rounded-full text-white">
            <BiSearch size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
