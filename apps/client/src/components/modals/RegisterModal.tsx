import { useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import useRegisterModal from '../../hooks/modals/useRegisterModal';
import useLoginModal from '../../hooks/modals/useLoginModal';
import toast from 'react-hot-toast';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';

export default function RegisterModal() {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if(!res.ok) {
        toast.error(data?.message ?? 'An error occurred. Please try again.');
        return; 
      }

      toast.success('Registered');
      reset();
      onToggle();
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  });

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading 
        title="Welcome to Airbnb"
        subtitle="Create an account!"
      />
      <Input 
        id="name"
        type="text"
        label="Name"
        disabled={isSubmitting}
        register={register}
        errors={errors}
        required
      />
      <Input 
        id="email"
        type="email"
        label="Email"
        disabled={isSubmitting}
        register={register}
        errors={errors}
        required
      />
      <Input 
        id="password"
        label="Password"
        type="password"
        disabled={isSubmitting}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="flex items-center justify-center gap-2">
          Already have an account?{' '}
          <button 
            className="text-rose-500 hover:underline"
            onClick={onToggle}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      title="Register"
      actionLabel="Continue"
      disabled={isSubmitting}
      isOpen={registerModal.isOpen}
      onClose={registerModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
