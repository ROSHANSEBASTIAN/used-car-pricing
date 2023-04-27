import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lat: number;

  @Expose()
  long: number;

  @Expose()
  price: number;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }) => obj.user.id) // it basically fetches report object and fetches the user's id from it.
  @Expose()
  userId: number;
}
