import useAuth from '../../hooks/useAuth';
import LoginModal from '../modals/LoginModal';
import RegisterModal from '../modals/RegisterModal';
import RentModal from '../modals/RentModal';
import SearchModal from '../modals/SearchModal';

export default function ModalProvider() {
  const accessToken = useAuth(state => state.accessToken);

  return (
    <>
      {
        !accessToken ? (
          <>
            <LoginModal />
            <RegisterModal />
          </>
        ) : (
          <RentModal />
        )
      }
      <SearchModal />
    </>
  );
}
