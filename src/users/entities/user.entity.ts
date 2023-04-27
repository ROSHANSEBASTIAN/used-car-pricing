import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/entities/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Data inserted with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Data updated with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Data removed with id ', this.id);
  }
}
