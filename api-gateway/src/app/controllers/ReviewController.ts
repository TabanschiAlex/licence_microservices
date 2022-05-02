import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';

@Controller('reviews')
export class ReviewController implements OnModuleInit {
  constructor(@Inject('REVIEW_SERVICE') private readonly reviewService: ClientKafka) {}

  async onModuleInit() {
    this.reviewService.subscribeToResponseOf('get_reviews');
    this.reviewService.subscribeToResponseOf('get_review');
    this.reviewService.subscribeToResponseOf('store_review');
    this.reviewService.subscribeToResponseOf('update_review');
    this.reviewService.subscribeToResponseOf('destroy_review');
    await this.reviewService.connect();
  }

  @Get()
  public async index(@Query() query: any) {
    return this.reviewService.send('get_reviews', query);
  }

  @Get(':id')
  public async edit(@Param('id') id: string) {
    return this.reviewService.send('get_review', id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async store(@Body() request: any, @Req() req) {
    return this.reviewService.send('store_review', request);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async update(@Param('id') id: string, @Body() request) {
    return this.reviewService.send('update_review', request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async destroy(@Param('id') id: string) {
    return this.reviewService.send('destroy_review', id);
  }
}
