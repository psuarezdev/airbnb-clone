import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Range } from 'react-date-range';
import qs from 'query-string';
import { CountrySelectValue } from '../../types.d';
import useSearchModal from '../../hooks/modals/useSeachModal';
import Modal from './Modal';
import Map from '../Map';
import { formatISO } from 'date-fns';
import Heading from '../Heading';
import CountrySelect from '../inputs/CountrySelect';
import Calendar from '../inputs/Calendar';
import Counter from '../Counter';

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2
}

export default function SearchModal() {
  const navigate = useNavigate();
  const searchModal = useSearchModal();

  const [location, setLocation] = useState<CountrySelectValue>();
  const [step, setStep] = useState(STEPS.LOCATION);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const onBack = useCallback(() => {
    if(step === STEPS.LOCATION) return;
    setStep(prev => prev - 1);
  }, [step]);

  const onNext = useCallback(() => {
    if(step === STEPS.INFO) return;
    setStep(prev => prev + 1);
  }, [step]);

  const onSubmit = useCallback(async() => {
    if(step !== STEPS.INFO) return onNext();

    const params = new URLSearchParams(window.location.search);
    
    let query  = {};

    if(params.size > 0) {
      query = qs.parse(params.toString());
    }

    const updatedQuery: {
      locationValue?: string;
      guestCount?: number;
      roomCount?: number;
      bathroomCount?: number;
      startDate?: string;
      endDate?: string;
    } = {
      ...query,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount
    };

    if(dateRange.startDate) {
      updatedQuery.startDate = formatISO(dateRange.startDate);
    }

    if(dateRange.endDate) {
      updatedQuery.endDate = formatISO(dateRange.endDate);
    }

    const url = qs.stringifyUrl({
      url: '/',
      query: updatedQuery
    }, { skipNull: true });

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    navigate(url);
  }, [bathroomCount, dateRange, guestCount, navigate, onNext, roomCount, searchModal, step, location]);

  const actionLabel = useMemo(() => {
    return step === STEPS.INFO ? 'Search' : 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.LOCATION ? undefined : 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading 
        title="Where do you want to go?"
        subtitle="Find the perfect place for your next trip"
      />
      <CountrySelect 
        value={location}
        onChange={value => setLocation(value as CountrySelectValue)}
      />
      <hr />
      <Map center={location?.latlng} />
    </div>
  );

  if(step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="When do you plan to go?"
          subtitle="MAke sure everyone is free for the trip"
        />
        <Calendar 
          value={dateRange}
          onChange={value => setDateRange(value.selection)}
        />
      </div>
    );
  }

  if(step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading 
          title="More information"
          subtitle="Find the perfect place for your next trip"
        />
        <Counter 
          title="Guests"
          subtitle="How many guests are coming?"
          value={guestCount}
          onChange={value => setGuestCount(value)}
        />
        <Counter 
          title="Rooms"
          subtitle="How many rooms do you need?"
          value={roomCount}
          onChange={value => setRoomCount(value)}
        />
        <Counter 
          title="Bathrooms"
          subtitle="How many bathrooms do you need?"
          value={bathroomCount}
          onChange={value => setBathroomCount(value)}
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      onClose={searchModal.onClose}
      onSubmit={step === STEPS.INFO ? onSubmit : onNext}
      title="Filters"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={onBack}
      body={bodyContent}
    />
  );
}
