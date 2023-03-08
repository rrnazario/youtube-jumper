import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { IntervalRequest, IntervalService } from './interval.service';

@Controller('intervals')
export class IntervalsController {
  constructor(private readonly intervalService: IntervalService) {}

  @Get(':id')
  async getIntervals(@Param() params): Promise<string> {
    return await this.intervalService.getAsync(params.id);
  }

  @Put(':id')
  async addIntervals(@Param() params, @Body() req : IntervalRequest): Promise<void> {
    console.log(params)
    console.log(req)
    await this.intervalService.AddAsync(params.id, req);
  }
}
