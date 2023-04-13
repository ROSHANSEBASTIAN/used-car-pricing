import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      synchronize: true,
      entities: [User, Report],
      database: 'db.sqlite',
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
