import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  make: string;

  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1940)
  @Max(2023)
  year: number;

  @IsLatitude()
  lat: number;

  @IsLongitude()
  long: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  @Max(10000000)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
