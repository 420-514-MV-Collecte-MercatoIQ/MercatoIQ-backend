import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus() {
    return {
      service: 'MercatoIQ API',
      version: 'v1',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
