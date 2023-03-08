import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { MongooseModule } from '@nestjs/mongoose';
import { IntervalsController } from './interval.controller';
import { Intervals, IntervalSchema, IntervalService } from './interval.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGODB_URI')
        }
      },
      inject: [ConfigService]
    }),
    MongooseModule.forFeature([{ name: Intervals.name, schema: IntervalSchema }]),
  ],
  controllers: [IntervalsController],
  providers: [IntervalService],
})
export class IntervalModule { }
