import { useState, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import categories from '../../categories';
import useRentModal from '../../hooks/modals/useRentModal';
import Modal from './Modal';
import Heading from '../Heading';
import CategoryInput from '../inputs/CategoryInput';
import CountrySelect from '../inputs/CountrySelect';
import Map from '../Map';
import Counter from '../Counter';
import ImageUpload from '../inputs/ImageUpload';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import useListings from '../../hooks/useListings';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5
}

export default function RentModal() {
  const { accessToken, profile } = useAuth();
  const addListing = useListings(state => state.addListing);
  const { isOpen, onClose } = useRentModal();
  const [step, setStep] = useState(STEPS.CATEGORY);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      file: null, // When creating a new listing, first we're going to upload the image to get the imageSrc
      price: 1,
      title: '',
      description: ''
    }
  });

  const category = watch('category');
  const location = watch('location');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const file = watch('file');

  const setCustomValue = (id: string, value: unknown) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  };

  const onBack = () => {
    setStep(prev => prev - 1);
  };

  const onNext = () => {
    setStep(prev => prev + 1);
  };

  const handleClose = () => {
    reset();
    setStep(STEPS.CATEGORY);
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (step !== STEPS.PRICE) return onNext();
      data.price = parseInt(data.price, 10);

      const formData = new FormData();
      formData.append('file', data.file);

      const uploadRes = await fetch('/api/listings/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData
      });

      if (!uploadRes.ok) return toast.error('Failed to upload image');

      const { filename: imageSrc } = await uploadRes.json();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { file, location, ...rest } = data;

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          ...rest,
          imageSrc,
          locationValue: location.value,
          userId: profile?.id
        })
      });

      if (!res.ok) return toast.error('Failed to create listing');

      const listing = await res.json();
      
      addListing(listing);

      toast.success('Listing created!');
      handleClose();
    } catch (err) {
      toast.error('Something went wrong');
    }
  });

  const actionLabel = useMemo(() => {
    return step === STEPS.PRICE ? 'Create' : 'Next';
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    return step === STEPS.CATEGORY ? undefined : 'Back';
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Which of these best describes your place?"
        subtitle="Pick a category"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {categories.map(item => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              label={item.label}
              icon={item.icon}
              selected={item.label === category}
              onClick={(category) => setCustomValue('category', category)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where's your place located?"
          subtitle="Help guests find you!"
        />
        <CountrySelect
          onChange={(value) => setCustomValue('location', value)}
          value={location}
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Share some basics about your place"
          subtitle="What amenities do you have?"
        />
        <Counter
          title="Guests"
          subtitle="How many guests do you allow?"
          value={guestCount}
          onChange={(value) => setCustomValue('guestCount', value)}
        />
        <hr />
        <Counter
          title="Rooms"
          subtitle="How many rooms do you have?"
          value={roomCount}
          onChange={(value) => setCustomValue('roomCount', value)}
        />
        <hr />
        <Counter
          title="Bathrooms"
          subtitle="How many bathrooms do you have?"
          value={bathroomCount}
          onChange={(value) => setCustomValue('bathroomCount', value)}
        />
      </div>
    );
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Add a photo of your place"
          subtitle="Show guests what your place looks like!"
        />
        <ImageUpload
          value={file}
          onChange={(value) => setCustomValue('file', value)}
        />
      </div>
    );
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="How would you describe your place?"
          subtitle="Short and sweet works best!"
        />
        <Input
          id="title"
          label="Title"
          disabled={isSubmitting}
          register={register}
          errors={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isSubmitting}
          register={register}
          errors={errors}
          required
        />
      </div>
    );
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Now, set your price"
          subtitle="How much do you charge per night?"
        />
        <Input
          id="price"
          label="Price"
          type="number"
          disabled={isSubmitting}
          register={register}
          errors={errors}
          formatPrice
          required
        />
      </div>
    );
  }

  return (
    <Modal
      title="Airbnb your home!"
      actionLabel={actionLabel}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      body={bodyContent}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

