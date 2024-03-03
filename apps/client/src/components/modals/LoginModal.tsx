import { useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useLoginModal from '../../hooks/modals/useLoginModal';
import useRegisterModal from '../../hooks/modals/useRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import useAuth from '../../hooks/useAuth';

export default function LoginModal() {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const logIn = useAuth(state => state.logIn);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FieldValues>({
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if(!res.ok) {
        toast.error(data?.message ?? 'An error occurred. Please try again.');
        return; 
      }

      logIn(data);
      toast.success('Logged in');
      reset();
      loginModal.onClose();
    } catch (err) {
      toast.error('An error occurred. Please try again.');
    }
  });

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading 
        title="Welcome back"
        subtitle="Login to your account!"
      />
      <Input 
        // In the Auth API, we're using email as the username
        id="username"
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
          Don't have an account?{' '}
          <button 
            className="text-rose-500 hover:underline"
            onClick={onToggle}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      title="Login"
      actionLabel="Continue"
      disabled={isSubmitting}
      isOpen={loginModal.isOpen}
      onClose={loginModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
      footer={footerContent}
    />
  );
}
