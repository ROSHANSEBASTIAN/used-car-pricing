import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigService, ConfigModule } from '@nestjs/config';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // global setting for the app.
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   synchronize: true,
    //   entities: [User, Report],
    //   database: 'db.sqlite',
    // }),

    // for creating TypeOrmModule, use the ConfigService
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          database: config.get<string>('DB_NAME'),
          type: 'sqlite',
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  // creating a middleware to run for each incoming request.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['asvgdsd'] })).forRoutes('*'); // this key is used to encrypt the information in cookie
  }
}
