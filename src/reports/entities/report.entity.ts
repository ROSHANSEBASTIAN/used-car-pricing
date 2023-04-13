import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  color: string;

  @Column()
  model: string;

  @Column()
  make: string;

  @Column()
  year: number;

  @Column()
  mileage: number;

  @Column()
  price: number;
}
