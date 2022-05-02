import { PipeTransform } from '@nestjs/common';
import { DataTypes } from '../enums/DataTypes';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class RequestDTO implements PipeTransform {
  constructor(private readonly dataType: DataTypes) {}

  transform(request: RequestWithUser): any {
    return {
      body: request[this.dataType],
      user: request?.user ?? null,
    };
  }
}
