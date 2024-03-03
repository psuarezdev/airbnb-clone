import { create } from 'zustand';
import cookies from 'js-cookie';
import { Profile } from '../types.d';

interface LoginProps {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface useAuthStore {
  profile: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  fetchProfile: (accessToken: string) => void;
  logIn: (tokens: LoginProps) => void;
  logOut: () => void;
}

const options: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: 'strict',
  secure: true
};

const useAuth = create<useAuthStore>(set => ({
  profile: null,
  accessToken: cookies.get('accessToken') ?? null,
  refreshToken: cookies.get('refreshToken') ?? null,
  expiresIn: cookies.get('expiresIn') ? Number(cookies.get('expiresIn')) : null,
  fetchProfile: async (accessToken: string) => {
    const res = await fetch('/api/users/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) return;
    
    set({ profile: await res.json() });
  },
  logIn: ({ accessToken, refreshToken, expiresIn }: LoginProps) => {
    cookies.set('accessToken', accessToken, options);
    cookies.set('refreshToken', refreshToken, options);
    cookies.set('expiresIn', expiresIn.toString(), options);

    set({ accessToken, refreshToken, expiresIn });
  },
  logOut: () => {
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
    cookies.remove('expiresIn');

    set({ accessToken: null, refreshToken: null, expiresIn: null, profile: null });
  }
}));


export default useAuth;