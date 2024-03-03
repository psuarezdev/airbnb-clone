export type CountrySelectValue = {
  flag: string;
  label: string;
  latlng: number[];
  region: string;
  value: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
  favoriteIds: string[];
  updatedAt: string;
  createdAt: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  createdAt: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  userId: string;
  price: number;
  user: User;
}

export interface Reservation {
  id: string;
  userId: string;
  listingId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  listing: Listing;
}