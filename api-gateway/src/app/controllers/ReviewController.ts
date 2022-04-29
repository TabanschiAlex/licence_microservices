import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { CreateReviewRequest } from '../requests/review/CreateReviewRequest';
import { UpdateReviewRequest } from '../requests/review/UpdateReviewRequest';

@Controller('reviews')
@UsePipes(ValidationPipe)
export class ReviewController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly reviewService: ClientKafka,
  ) {}

  @Get()
  public async index(@Query() query) {
    return this.reviewService.emit('get_reviews', query);
  }

  @Get(':id')
  public async edit(@Param('id') id: string) {
    return this.reviewService.emit('get_review', id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async store(@Body() request: CreateReviewRequest, @Req() req) {
    return this.reviewService.emit('store_review', request);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateReviewRequest,
  ) {
    return this.reviewService.emit('update_review', request);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async destroy(@Param('id') id: string) {
    return this.reviewService.emit('destroy_user', id);
  }
}
