import { PipeTransform } from '@nestjs/common';
import { RequestWithUser } from '../interfaces/RequestWithUser';
import { UpdateNameRequest } from '../requests/user/UpdateNameRequest';

export class UpdateNameDTO implements PipeTransform {
  transform(request: RequestWithUser): UpdateNameRequest {
    return {
      uuid: request.body.uuid,
      name: request.body.name ?? null,
    };
  }
}
