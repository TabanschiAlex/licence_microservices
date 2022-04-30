import { PipeTransform } from '@nestjs/common';
import { BasicQueryRequest } from '../requests/BasicQueryRequest';

export class QueryDTO implements PipeTransform {
  transform(query: BasicQueryRequest): BasicQueryRequest {
    return {
      page: {
        number: query?.page?.number ?? 1,
        size: query?.page?.size ?? 10,
      },
    };
  }
}
