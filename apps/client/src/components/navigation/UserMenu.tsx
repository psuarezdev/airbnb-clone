import { useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import useAuth from '../../hooks/useAuth';
import Avatar from '../Avatar';
import MenuItem from './MenuItem';
import useRegisterModal from '../../hooks/modals/useRegisterModal';
import useLoginModal from '../../hooks/modals/useLoginModal';
import useRentModal from '../../hooks/modals/useRentModal';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const { accessToken, profile, logOut } = useAuth();
  const navigate = useNavigate();
  const onOpenLoginModal = useLoginModal(state => state.onOpen);
  const onOpenRegisterModal = useRegisterModal(state => state.onOpen);
  const onOpenRentModal = useRentModal(state => state.onOpen);
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const onClose = useCallback((to?: string) => {
    setIsOpen(false);
    if(to) navigate(to);
  }, [navigate]);

  const onRent = useCallback(() => {
    accessToken
      ? onOpenRentModal()
      : onOpenLoginModal();

    onClose();
  }, [accessToken, onOpenLoginModal, onOpenRentModal, onClose]);

  return (
    <div className="flex flex-grow basis-0 justify-end relative">
      <div className="flex items-center gap-3">
        <div
          className="hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer"
          onClick={onRent}
        >
          Airbnb your home
        </div>
        <div
          className="flex items-center gap-3 p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 rounded-full select-none cursor-pointer hover:shadow-md transition"
          onClick={onToggle}
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={profile?.image} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {accessToken && (
              <>
                <MenuItem
                  label="My trips"
                  onClick={() => onClose('/trips')}
                />
                <MenuItem
                  label="My favorites"
                  onClick={() => onClose('/favorites')}
                />
                <MenuItem
                  label="My reservations"
                  onClick={() => onClose('/reservations')}
                />
                <MenuItem
                  label="My properties"
                  onClick={() => onClose('/properties')}
                />
                <MenuItem
                  className="md:hidden"
                  label="Airbnb my home"
                  onClick={onRent}
                />
                <hr />
                <MenuItem
                  className="text-rose-500"
                  label="Logout"
                  onClick={() => {
                    logOut();
                    toast.success('Logged out');
                    onClose('/');
                  }}
                />
              </>
            )}
            {!accessToken && (
              <>
                <MenuItem
                  label="Login"
                  onClick={() => {
                    onClose();
                    onOpenLoginModal();
                  }}
                />
                <MenuItem
                  label="Sign up"
                  onClick={() => {
                    onClose();
                    onOpenRegisterModal();
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
