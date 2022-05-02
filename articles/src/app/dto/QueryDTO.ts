import { PipeTransform } from '@nestjs/common';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';
import { RequestWithUser } from '../interfaces/RequestWithUser';

export class QueryDTO implements PipeTransform {
  transform(request: RequestWithUser): BasicQueryRequest {
    return {
      page: {
        number: request.body?.page?.number ?? 1,
        size: request.body?.page?.size ?? 10,
      },
    };
  }
}
