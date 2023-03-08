import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

export type IntervalDocument = HydratedDocument<Intervals>;

@Schema()
export class Intervals {
  @Prop()
  id: string;

  @Prop()
  intervals: string;
}

export const IntervalSchema = SchemaFactory.createForClass(Intervals);

export interface IntervalRequest {
  intervals: string
}

@Injectable()
export class IntervalService {
  constructor(@InjectModel(Intervals.name) private intervalsModel: Model<IntervalDocument>) { }

  async getAsync(id: string): Promise<string> {
    const result = await this.intervalsModel.findOne({ id: id }).exec();

    return result?.intervals
  }

  async AddAsync(id: string, request: IntervalRequest): Promise<void> {
    const result = await this.intervalsModel.findOne({ id: id }).exec();

    if (result) {
      result.intervals = request.intervals;

      await this.intervalsModel.updateOne({ id: id }, result).exec();
    }
    else {
      const newIntervals: Intervals = {
        id: id,
        intervals: request.intervals
      }

      await this.intervalsModel.insertMany(newIntervals);
    }
  }
}
