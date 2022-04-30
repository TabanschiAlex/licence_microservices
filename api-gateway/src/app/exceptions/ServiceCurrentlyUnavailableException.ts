import { ServiceUnavailableException } from '@nestjs/common';

export class ServiceCurrentlyUnavailableException extends ServiceUnavailableException {
  constructor() {
    super('Service currently unavailable, try later');
  }
}
