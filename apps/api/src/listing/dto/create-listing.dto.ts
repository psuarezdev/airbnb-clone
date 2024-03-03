import { IsString, IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  imageSrc: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  roomCount: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  bathroomCount: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  guestCount: number;

  @IsNotEmpty()
  @IsString()
  locationValue: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  price: number;
}
