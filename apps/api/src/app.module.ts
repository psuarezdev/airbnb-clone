import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ListingModule } from './listing/listing.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../..', 'client/dist')
    // }),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    ListingModule,
    ReservationModule
  ]
})
export class AppModule {}
